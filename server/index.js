const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
//#region data sources
const db = require("./sqlite_db");
const fs = require("fs");
var JSZip = require('jszip');
//#endregion
const fcl = require("@onflow/fcl");

fcl.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet")

const find = JSON.parse(fs.readFileSync("./node_modules/@findonflow/find-flow-contracts/find.json", "utf-8"));

//#region Utils
const { verifyPropertyName } = require("./placenames");

//#endregion

//#region Auth
function generateAccessToken(data, customExpire = null) {
    if (typeof data !== 'object')
        throw { message: "Data must be an object." };
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: customExpire ? customExpire : (+process.env.SESSION_MINS) + 'm' });
}



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    try {

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

            err && console.log(err);

            if (err && err.name == "TokenExpiredError") {
                res.statusCode = 403;
                return res.send({ name: err.name, message: err.message, expiredAt: err.expiredAt });
            }

            // sends this when token expires
            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    } catch (ex) {
        res.sendStatus(500);
    }
}


//#endregion

require("dotenv").config({ path: '.env' });

const env = process.env.NODE_ENV || "development";
const app = express();


app.use(bodyParser.json({ limit: '2mb' }));


const port =
    env === "development" ? process.env.DEV_PORT : process.env.PROD_PORT;

app.use(require("sanitize").middleware);

app.set("trust proxy", true);
app.use(express.static(path.join(__dirname, "..", "public")));

app.options("*", cors());

app.get("/v1/connect", async (req, res) => {

    const expires = (new Date()).getTime() + (+process.env.SESSION_MINS);
    // Create the login request confirm token
    const secret = await db.uniqueName();
    const salt = Math.random();
    const token = "BEARER " + generateAccessToken({ secret, expires, salt });

    // Sends a special connection token that can't be used for anything else
    return res.send({ token, expires, secret });
});


app.post("/v1/create", authenticateToken, async (req, res) => {
    try {
        // User wishes to set a pin
        const userName = req.bodyString("name");
        const userWallet = req.bodyString("wallet").toLowerCase();
        const tempPin = req.bodyString("pin");

        if (!verifyPropertyName(userName)) {
            throw { message: "Invalid account name" };
        }

        if (req.user.secret !== userName) {
            throw { message: "Account name wasn't generated properly." };
        }


        if (/^0x[0-9a-fA-F]{16}$/.test(userWallet) || /.+\.find$/.test(userWallet)) {



            const resolvedWallet = userWallet.indexOf('.find') > 0 ? await fcl.query({
                cadence: find.networks.mainnet.scripts.getStatus.code,
                args: (arg, t) => [
                    arg(userWallet, t.String),

                ],
            }) : null;

            const NFTWallets = resolvedWallet ? resolvedWallet.FINDReport.accounts.map(x => x.address) : [wallet_addr];


            await asyncForEach(NFTWallets, async (wallet_addr) => {
                await db.linkWallet(userName, wallet_addr, userWallet, 'FLOW');
            });



        } else {
            throw { message: "Wallet address invalid." };
        }

        let dbres = await db.claimName(userName, tempPin);
        if (dbres.indexOf("Name already exists") === 0) {
            return res.send({ message: dbres })
        }

        return res.send({ message: dbres, name: userName, token: generateAccessToken({ userName }) });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }
});


app.post("/v1/changepin", authenticateToken, async (req, res) => {
    try {
        // User wishes to set a pin
        const userName = req.user.userName;

        const newpin = req.bodyString("pin");

        if (!verifyPropertyName(userName))
            throw { message: "Invalid account name" };


        if (!/^.{4,}$/.test(newpin))
            throw { message: "Passwords must be at least 4 characters long." };




        let dbres = await db.updatePin(userName, newpin);

        return res.send({ message: dbres, name: userName, token: generateAccessToken({ userName }) })

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }
});


app.post("/v1/login", async (req, res) => {
    try {
        // User wishes to set a pin
        const userName = req.bodyString("gallery");
        const pin = req.bodyString("pin");

        if (!pin || pin === '') {
            throw { message: "Empty pin." };
        }

        if (!/^.{4,}$/.test(pin))
            throw { message: "Invalid pin." };

        if (!verifyPropertyName(userName)) {
            throw { message: "Invalid account name" };
        }

        if ("FAIL" === await db.login(userName, pin)) {
            return res.send({ message: "Login Incorrect", name: userName })
        }


        return res.send({ message: "SUCCESS", name: userName, token: generateAccessToken({ userName }) });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }
});


app.post("/v1/checktoken", authenticateToken, async (req, res) => {
    try {
        const userName = req.bodyString("gallery");
        if (!verifyPropertyName(userName)) {
            throw { message: "Invalid account name" };
        }

        if (req.user.userName !== userName) {
            throw { message: "Account name wasn't generated properly." };
        }

        // Send a fresh token
        res.send({ message: "SUCCESS", token: generateAccessToken({ userName }) });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }

});


app.post("/v1/updateteam", authenticateToken, async (req, res) => {
    try {

        const team = req.body.team;

        const cleanedTeam = team.map(x => {
            if (x === null) {
                return null; // Keep nulls as placeholders
            }

            if (!/^[A-Za-z_0-9]{2,}$/.test(x.collection)) {
                throw { message: "data corrupt" };
            }


            return { collection: x.collection, id: +x.id }
        })

        // Team should be an array of 6 {id, collection}

        await db.updateTeam(req.user.userName, cleanedTeam);


        // Send a fresh token
        res.send({ message: "SUCCESS" });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }

});

var catalogSizeCache = null;

async function cacheCollectionCt() {


    if (!catalogSizeCache) {
        catalogSizeCache = await fcl.query({
            cadence: fs.readFileSync("cadence/get_nft_catalog_count.cdc", "utf-8")
        });
    }
    return catalogSizeCache;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function walletCache(alias, catalogSize, wallet) {
    let NFTList = {};
    let cache_served = false;
    const cacheFile = `.tmp/${alias}.zip`;

    // Delete old cache data
    try {
        if (fs.existsSync(cacheFile)) {
            if ((new Date()) - fs.statSync(cacheFile).mtime > 60 * 1000 * 60)
                fs.unlinkSync(cacheFile);
        }
    } catch {
        console.log("Failed to delete cache file.");
    }

    const zip = new JSZip();
    // check for a cache file and return it if so
    if (fs.existsSync(cacheFile)) {
        const fdata = await fs.promises.readFile(cacheFile);

        const fileData = await JSZip.loadAsync(fdata);
        const unzippedFileData = await fileData.files["nfts.txt"].async('string');
        //console.log(fileData) // These are your file contents   
        NFTList = JSON.parse(unzippedFileData);
        cache_served = true;

        // TODO: Check file data
        // For now, delete the file after 5 mins just in case it's old. Cron would be better for cleaning this dir but it's overkill

        // console.log("Cache queued for deletion.", new Date());
        // setTimeout(() => {
        //     try {
        //         console.log("Attempt unlink.", new Date());
        //         // delete the file after 5 mins
        //         if (fs.existsSync(cacheFile)) {

        //             fs.unlinkSync(cacheFile);
        //         }
        //     } catch {
        //         console.log("Failed to delete cache file.");
        //     }
        // }, 60 * 1000 * 5);


    }
    else {
        const catalogCount = +catalogSize;
        const PAGESIZE = 15;
        const PAGES = (catalogCount / PAGESIZE) + 1;

        const NFTWallets = wallet.map(x => x.address);



        await asyncForEach(NFTWallets, async linkedwallet => {
            for (var i = 0; i < PAGES; i++) {
                const response = await fcl.query({
                    cadence: fs.readFileSync("cadence/get_all_nfts_in_account.cdc", "utf-8"),
                    args: (arg, t) => [
                        arg(linkedwallet, t.Address),
                        arg(`${PAGESIZE}`, t.Int),
                        arg(`${i}`, t.Int)
                    ],
                });
                for (let [key, value] of Object.entries(response)) {
                    if (NFTList[key] === undefined && value && value.length > 0) {
                        NFTList[key] = [];
                    }
                    if (value && value.length > 0) {
                        NFTList[key] = [...NFTList[key], ...value];
                    }
                }
                //console.log(response);
            }
        });




        zip.file("nfts.txt", JSON.stringify(NFTList));

        zip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: "DEFLATE" })
            .pipe(fs.createWriteStream(cacheFile))
            .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                console.log(cacheFile + " written.");

                setTimeout(() => {
                    try {
                        // delete the file after 5 mins
                        if (fs.existsSync(cacheFile))
                            fs.unlinkSync(cacheFile);
                    } catch {
                        console.log("Failed to delete cache file.");
                    }
                }, 60 * 1000 * 60);
            });



    }

    return { cache_served, NFTList };
}

app.get("/v1/getgallery/:gallery", async (req, res) => {
    try {

        // TODO: if we want to do battles this has to happen at the server but we can always cache it
        // TODO: Add a sqlite table for wallet caches that live at least 5 mins

        const gallery = req.paramString("gallery");
        const mode = req.queryString("view") == true;

        // TODO: Get user customizations too

        // get user's NFTs
        const wallet = await db.getWallet(gallery);

        const teamData = await db.getTeamStatus(gallery);

        if (wallet.length <= 0) {
            throw { message: "Gallery does not exist." };
        }

        const wallet_addr = wallet[0].address;

        const catalogSize = await cacheCollectionCt();

        const dataLoad = await walletCache(wallet[0].alias, catalogSize, wallet);
        const NFTList = dataLoad.NFTList;

        const relevantTeamNFTs = teamData.length > 0 ? JSON.parse(teamData[0].team).filter(x => x !== null).map(teammember => {

            return NFTList[teammember.collection]?.find(x => x.id == teammember.id)
        }) : [];

        console.log(relevantTeamNFTs);

        res.send({ gallery: gallery, catalogSize: catalogSize, owner: wallet_addr, nfts: NFTList, teams: teamData.length > 0 ? teamData[0].team : null, cache_served: dataLoad.cache_served });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });

    }
});




// TODO: add authentication
app.get("/v1/submitteam/:gallery", authenticateToken, async (req, res) => {
    try {


        const gallery = req.paramString("gallery");

        // get user's NFTs
        const wallet = await db.getWallet(gallery);

        const teamData = await db.getTeamStatus(gallery);

        if (wallet.length <= 0) {
            throw { message: "Gallery does not exist." };
        }

        const wallet_addr = wallet[0].address;

        const catalogSize = await cacheCollectionCt();

        const dataLoad = await walletCache(wallet[0].alias, catalogSize, wallet);
        const NFTList = dataLoad.NFTList;

        const relevantTeamNFTs = teamData.length > 0 ? JSON.parse(teamData[0].team).filter(x => x !== null).map(teammember => {

            return NFTList[teammember.collection]?.find(x => x.id == teammember.id)
        }) : [];



        await asyncForEach(relevantTeamNFTs, async (nftdata) => {
            // Insert each NFT data from the team if it doesn't exist
            await db.addTrackedNFT(nftdata.collectionName, nftdata.id, JSON.stringify(nftdata), 'FLOW');
        });



        res.send({ message: "SUCCESS" });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });

    }
});


app.get("/v1/nft/:collection/:nftid", async (req, res) => {
    try {

        const collection = req.paramString("collection");
        const nftid = req.paramString("nftid");

        // get user's NFTs
        const nftdata = await db.getTrackedNFT(collection, nftid, 'FLOW');



        res.send({ nftdata: nftdata.length === 1 ? nftdata[0] : null });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });

    }
});



// Serve react frontend
const buildPath = path.normalize(path.join(__dirname, '../client/dist'));
app.use(express.static(buildPath));
const rootRouter = express.Router();

rootRouter.get('(/*)?', async (req, res, next) => {
    try {

        if (req.url.indexOf("/g/") > -1) {
            // console.log("Sending modified file");
            const fileContents = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');

            // TODO: make better previews
            const modContents = `${fileContents.substring(0, fileContents.indexOf("<!-- NODEOG -->"))}
            <meta property="og:image" content="" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1024" />
            <meta property="og:image:height" content="1024" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://waxworks.io/" />
            <meta property="og:title" content="" />
            <meta property="og:description" content="" />
            
            ${fileContents.substring(fileContents.indexOf("<!-- /NODEOG -->") + 16)}`;

            res.set('Content-Type', 'text/html');
            res.send(modContents);
            return;
        }
        // load the index file and change the opengraph section (for social preview links)

        res.sendFile(path.join(buildPath, 'index.html'));
    } catch (ex) {
        res.send("Could not load frontend.");
    }
});
app.use(rootRouter);

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Listening to requests on http://localhost:${process.env.PORT}`);
});

// NOTE: To run the server on a droplet install pm2 and then run: pm2 start "npm run start"
// NOTE: install cloudflared on the server