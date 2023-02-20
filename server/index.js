const express = require("express");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
//#region data sources
const db = require("./sqlite_db");
const fs = require("fs");
//#endregion



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
        const userWallet = req.bodyString("wallet");
        const tempPin = req.bodyString("pin");

        if (!verifyPropertyName(userName)) {
            throw { message: "Invalid account name" };
        }

        if (req.user.secret !== userName) {
            throw { message: "Account name wasn't generated properly." };
        }


        if (ethRegex.test(userWallet) || /.+\.eth$/.test(userWallet.toLowerCase())) {


            await db.linkWallet(userName, userWallet, 'ETH');

        } else if (tezosRegex.test(userWallet) || /.+\.tez$/.test(userWallet.toLowerCase())) {

            await db.linkWallet(userName, userWallet, 'XTZ');
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


app.post("/v1/markteam", authenticateToken, async (req, res) => {
    try {
        const nftid = req.bodyString("nftid");
        const status = req.bodyString("team");

        await db.markTeam(req.user.userName, nftid, team);


        // Send a fresh token
        res.send({ message: "SUCCESS" });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }

});

app.post("/v1/addwallet", authenticateToken, async (req, res) => {
    try {
        const newwallet = req.bodyString("wallet");
        const gallery = req.user.userName;
        if (ethRegex.test(newwallet) || tezosRegex.test(newwallet)) {

            await db.linkWallet(gallery, newwallet, ethRegex.test(newwallet) ? "ETH" : "XTZ");


        } else {
            throw { message: "Wallet name not recognized." }
        }

        // Send a fresh token
        res.send({ message: "SUCCESS" });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });
    }

});

app.get("/v1/getgallery/:gallery", async (req, res) => {
    try {
        const gallery = req.paramString("gallery");

        // TODO: Get user customizations too

        res.send({ gallery: await db.getWallet(gallery), status: await db.getGalleryStatus(gallery) });

    } catch (ex) {
        res.statusCode = 403;
        return res.send({ message: ex.message });

    }
});



// Serve react frontend
const buildPath = path.normalize(path.join(__dirname, '../../artviewer/dist'));
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