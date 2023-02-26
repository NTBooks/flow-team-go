const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const db = require("./sqlite_db");
const fs = require("fs");
const JSZip = require('jszip');
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

            const NFTWallets = resolvedWallet ? resolvedWallet.FINDReport.accounts.map(x => x.address) : [userWallet];

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
        await db.updateTeam(req.user.userName, cleanedTeam, false);

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

    // Delete old cache data older than 1 hour
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

        NFTList = JSON.parse(unzippedFileData);
        cache_served = true;

    }
    else {
        const catalogCount = +catalogSize;

        // TODO: move to .env
        const PAGESIZE = 15;
        const PAGES = (catalogCount / PAGESIZE) + 1;

        const NFTWallets = wallet.map(x => x.address);

        await asyncForEach(NFTWallets, async linkedwallet => {

            for (var i = 0; i < PAGES; i++) {

                try {
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
                }
                catch (ex) {
                    console.log(ex);
                }
            }

        });

        zip.file("nfts.txt", JSON.stringify(NFTList));

        zip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: "DEFLATE" })
            .pipe(fs.createWriteStream(cacheFile))
            .on('finish', function () {
                console.log(cacheFile + " written.");

                setTimeout(() => {
                    try {
                        // delete the file after 60 mins
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


app.get("/v1/galleryexists/:gallery", async (req, res) => {
    try {
        const gallery = req.paramString("gallery");
        res.send(await db.checkName(gallery));
    } catch (ex) {
        res.statusCode = 403;
        return res.send(ex.message ? { message: ex.message } : { message: ex });
    }
});

app.get("/v1/getgallery/:gallery", async (req, res) => {
    try {
        // If we want to do battles this has to happen at the server but we can always cache it
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

        console.log(relevantTeamNFTs);

        res.send({ gallery: gallery, catalogSize: catalogSize, owner: wallet_addr, nfts: NFTList, teams: teamData.length > 0 ? teamData[0].team : null, cache_served: dataLoad.cache_served });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });

    }
});


app.get("/v1/submitteam/:gallery", authenticateToken, async (req, res) => {
    try {
        const gallery = req.paramString("gallery");

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

            return { ...NFTList[teammember.collection]?.find(x => x.id == teammember.id), collectionID: teammember.collection }
        }) : [];

        await asyncForEach(relevantTeamNFTs, async (nftdata) => {
            // Insert each NFT data from the team if it doesn't exist
            await db.addTrackedNFT(nftdata.collectionID, nftdata.id, JSON.stringify(nftdata), 'FLOW');
        });

        const newTeam = relevantTeamNFTs.map(x => {
            return { collection: x.collectionID, id: +x.id }
        });
        await db.updateTeam(req.user.userName, newTeam, true);

        res.send({ message: "SUCCESS", team: newTeam });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }
});


app.get("/v1/nft/:collection/:nftid", async (req, res) => {
    try {

        const collection = req.paramString("collection");
        const nftid = req.paramString("nftid");
        const nftdata = await db.getTrackedNFT(collection, nftid, 'FLOW');

        res.send({ nftdata: nftdata.length === 1 ? nftdata[0] : null });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }
});


app.get("/v1/getbattleteam/:gallery", async (req, res) => {
    try {

        const gallery = req.paramString("gallery");

        // get user's NFTs
        const wallet = await db.getWallet(gallery);
        const teamData = await db.getTeamStatus(gallery, 1);

        if (teamData.length < 1) {
            res.statusCode = 404;
            return res.send({ message: "No team data loaded." });
        }

        const battleHeaders = await db.getBattleHeaders(teamData[0].id);

        res.send({ battleHeaders, teamData, gallery, wallet });

    } catch (ex) {
        res.statusCode = 500;
        return res.send({ message: ex.message });

    }

});

async function RunMatch(teamA, teamB) {
    // Run rounds of (random attribute), (up or down or middle)
    // Add winner record once one team is KOed 

    const attributeCodes = [
        'Current HP', // Reserved for round 4+
        'Smash', // Low Smash is 50%, high smash is 100%
        'ID',
        'Level',
        'Description Length',
        'Description Alphabetical',
        'Name Length',
        'Name Alphabetical',
        'Collection Name Length',
        'Collection Name Alphabetical',
        'Doppleganger' // Special
    ]



    const teamAData = JSON.parse(teamA.team);
    const teamBData = JSON.parse(teamB.team);

    const matchCache = await db.getMatchData([...teamAData, ...teamBData]);

    // A tream starts at their loaded health
    // B team starts full
    const gameState = {
        A: teamAData.map(x => {
            return { id: matchCache.find(y => y.nftid === x.id && y.collection === x.collection).id, hp: matchCache.find(y => y.nftid === x.id && y.collection === x.collection).health }
        }),
        B: teamBData.map(x => { return { id: matchCache.find(y => y.nftid === x.id && y.collection === x.collection).id, hp: 100 } })
    }

    // Mirror match means we KO one copy of each at random
    // Then there is the fight
    const battleID = await db.createNewBattle(teamA.id, teamB.id, teamA.userName, teamB.userName);

    const dopplegangerList = gameState.A.filter(x => gameState.B.find(y => y.id === x.id));

    const hiLo = () => {
        return Math.floor(Math.random() * 2);
    }

    while (dopplegangerList.length > 0) {
        const dupe = dopplegangerList.pop();
        const hiLoRoll = hiLo();
        if (hiLoRoll === 0) {
            // Team A highlander rules
            gameState.A.find(x => x.id === dupe.id).hp = 0;

        } else {
            // Team B highlander rules
            gameState.B.find(x => x.id === dupe.id).hp = 0;
        }
        await db.addBattleLine(battleID, attributeCodes.indexOf('Doppleganger'), hiLoRoll, gameState);

    }

    const HPSum = (list) => {
        if (list.length == 0)
            return 0;
        return list.reduce((accumulator, currentValue) =>
            accumulator + currentValue.hp,
            0);
    }

    let statChanges = [];

    const recursiveRound = async (rnd) => {
        // See if any team A->A are around or if we're on A->B
        const ActiveATeam = HPSum(gameState.A.slice(0, 3)) === 0 ? gameState.A.slice(3).filter(x => x.hp > 0) : gameState.A.slice(0, 3).filter(x => x.hp > 0);
        const ActiveBTeam = HPSum(gameState.B.slice(0, 3)) === 0 ? gameState.B.slice(3).filter(x => x.hp > 0) : gameState.B.slice(0, 3).filter(x => x.hp > 0);

        // check for KO
        if (HPSum(gameState.A) <= 0) {

            await db.setBattleWinner(battleID, false);
            return; // don't recurse
        }

        if (HPSum(gameState.B) <= 0) {
            await db.setBattleWinner(battleID, true);

            // Whoever is alive gets leveled up
            ActiveATeam.filter(x => x.hp > 0).forEach(async y => {
                await db.levelUp(y.id);
                statChanges.push({ id: y.id });
            });

            return; // don't recurse
        }


        // Roll the contest
        const hiLoRoll = hiLo();
        const attributeRoll = rnd < 4 ? Math.floor(Math.random() * (attributeCodes.length - 2)) + 1 : Math.floor(Math.random() * (attributeCodes.length - 1));
        const hitStrength = Math.floor(Math.random() * 30) + 30;
        const aggregateList = [...ActiveATeam, ...ActiveBTeam];
        const expandedAggregateList = aggregateList.map(x => {
            const cacheHit = matchCache.find(y => y.id === x.id);
            return {

                objref: x, level: cacheHit.level, data: JSON.parse(cacheHit.content)
            };
        });

        if (aggregateList === undefined || aggregateList.length === 0) {
            debugger;
        }

        switch (attributeCodes[attributeRoll]) {
            case 'Current HP':
                const HPHit = hiLoRoll != 0 ?
                    Math.max(...aggregateList.map(x => x.hp))
                    : Math.min(...aggregateList.map(x => x.hp));

                aggregateList.filter(x => x.hp === HPHit).forEach(x => x.hp -= hitStrength);
                break;
            case 'Smash':
                const randomSelection = aggregateList[Math.floor(Math.random() * aggregateList.length)];
                randomSelection.hp -= hiLoRoll * 50 + 50; // 50 or 100 damage
                break;
            case 'ID':
                const IDHit = hiLoRoll != 0 ?
                    Math.max(...expandedAggregateList.map(x => x.data.nftid))
                    : Math.min(...expandedAggregateList.map(x => x.data.nftid));

                expandedAggregateList.filter(x => x.data.nftid === IDHit).forEach(x => x.objref.hp -= hitStrength);
                break;
            case 'Level':
                const LevelHit = hiLoRoll != 0 ?
                    Math.max(...expandedAggregateList.map(x => x.level))
                    : Math.min(...expandedAggregateList.map(x => x.level));

                expandedAggregateList.filter(x => x.level === LevelHit).forEach(x => x.objref.hp -= hitStrength);
                break;
            case 'Description Length':
                const DescLenHit = hiLoRoll != 0 ?
                    Math.max(...expandedAggregateList.map(x => x.data.description.length))
                    : Math.min(...expandedAggregateList.map(x => x.data.description.length));

                expandedAggregateList.filter(x => x.data.description.length === DescLenHit).forEach(x => x.objref.hp -= hitStrength);
                break;
            case 'Description Alphabetical':
                const sortedListD = expandedAggregateList.sort((a, b) => {
                    return (a.data.description < b.data.description) ? -1 : (a.data.description > b.data.description) ? 1 : 0;

                });
                const objToChangeD = sortedListD[hiLoRoll == 0 ? 0 : sortedListD.length - 1].objref;
                objToChangeD.hp -= hitStrength;
            case 'Name Length':
                const NameLenHit = hiLoRoll != 0 ?
                    Math.max(...expandedAggregateList.map(x => x.data.name.length))
                    : Math.min(...expandedAggregateList.map(x => x.data.name.length));
                expandedAggregateList.filter(x => x.data.name.length === NameLenHit).forEach(x => x.objref.hp -= hitStrength);
                break;
            case 'Name Alphabetical':
                const sortedListN = expandedAggregateList.sort((a, b) => {
                    return (a.data.name < b.data.name) ? -1 : (a.data.name > b.data.name) ? 1 : 0;

                });
                const objToChangeN = sortedListN[hiLoRoll == 0 ? 0 : sortedListN.length - 1].objref;
                objToChangeN.hp -= hitStrength;
                break;
            case 'Collection Name Length':
                const CollLenHit = hiLoRoll != 0 ?
                    Math.max(...expandedAggregateList.map(x => x.data.collectionName.length))
                    : Math.min(...expandedAggregateList.map(x => x.data.collectionName.length));
                expandedAggregateList.filter(x => x.data.collectionName.length === CollLenHit).forEach(x => x.objref.hp -= hitStrength);
                break;
            case 'Collection Name Alphabetical':
                const sortedListC = expandedAggregateList.sort((a, b) => {
                    return (a.data.collectionName < b.data.collectionName) ? -1 : (a.data.collectionName > b.data.collection) ? 1 : 0;

                });
                const objToChange = sortedListC[hiLoRoll == 0 ? 0 : sortedListC.length - 1].objref;
                objToChange.hp -= hitStrength;
                break;
            default:
                throw "illegal roll";

        }

        aggregateList.forEach(x => { x.hp = Math.max(x.hp, 0) });

        await db.addBattleLine(battleID, attributeRoll, hiLoRoll, gameState);

        await recursiveRound(rnd + 1);
    }

    await db.addBattleLine(battleID, -1, -1, gameState);
    await recursiveRound(0);

    return [battleID, statChanges];

}



app.get("/v1/randombattle", authenticateToken, async (req, res) => {
    try {

        // TODO: Check when last battle was and make sure it's been at least 10 secs
        const gallery = req.user.userName.substring(0, req.user.userName.indexOf(","));

        const eligibleTeams = await db.getBattleTeamList(0);

        const teamAData = await db.getTeamStatus(gallery, 1);

        if (teamAData.length < 1) {
            throw "No team data loaded."
        }

        if (eligibleTeams.length < 1) {
            throw "No eligible teams."
        }

        const randomTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
        const randomTeamGallery = randomTeam.userName.substring(0, randomTeam.userName.indexOf(","));

        const teamBData = await db.getTeamStatus(randomTeamGallery, 1);

        // Run the match...
        const result = await RunMatch(teamAData[0], teamBData[0]);
        const fullBattle = await db.getFullBattle(result[0]);

        res.send({ ...fullBattle, teamAData, teamBData, statChanges: result[1] });

    } catch (ex) {
        res.statusCode = 500;
        return res.send({ message: ex.message });

    }

});


app.get("/v1/vsbattle/:opponent", authenticateToken, async (req, res) => {
    try {

        // TODO: Check when last battle was and make sure it's been at least 10 secs

        const gallery = req.user.userName.substring(0, req.user.userName.indexOf(","));
        const enemy = req.paramString("opponent")


        const teamAData = await db.getTeamStatus(gallery, 1);

        if (teamAData.length < 1) {
            throw { message: "No team data loaded." }
        }

        const teamBData = await db.getTeamStatus(enemy, 1);
        if (teamBData.length < 1) {
            throw { message: "Gallery not found." }
        }

        const result = await RunMatch(teamAData[0], teamBData[0]);

        const fullBattle = await db.getFullBattle(result[0]);

        res.send({ ...fullBattle, teamAData, teamBData, statChanges: result[1] });

    } catch (ex) {
        res.statusCode = 500;
        return res.send({ message: ex.message });
    }

});


app.get("/v1/replaybattle/:id", authenticateToken, async (req, res) => {
    try {

        const gallery = req.user.userName.substring(0, req.user.userName.indexOf(","));
        const id = +req.paramString("id");

        const fullBattle = await db.getFullBattle(id);
        const teamAData = await db.getTeamSnapshot(+fullBattle.header[0].teamA);

        if (teamAData.length < 1) {
            throw "No team data loaded."
        }
        const teamBData = await db.getTeamSnapshot(+fullBattle.header[0].teamB);
        if (teamBData.length < 1) {
            throw "No team data loaded."
        }

        res.send({ ...fullBattle, teamAData, teamBData });

    } catch (ex) {
        res.statusCode = 500;
        return res.send({ message: ex.message });
    }
});



app.get("/v1/getmatchlist", authenticateToken, async (req, res) => {
    try {

        const battleHeaders = await db.getBattleHeaders(req.user.userName);
        res.send(battleHeaders);

    } catch (ex) {
        res.statusCode = 500;
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