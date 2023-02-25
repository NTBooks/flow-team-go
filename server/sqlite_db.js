/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

const fs = require("fs");
const dbFile = "./.data/flowdb.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");

const { randomPropertyName } = require("./placenames");

let db;

const bcrypt = require('bcryptjs');

dbWrapper
    .open({
        filename: dbFile,
        driver: sqlite3.Database
    })
    .then(async dBase => {
        db = dBase;

        try {

            if (!exists) {
                await db.run(
                    "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, pin TEXT, salt TEXT, created INT)"
                );

                await db.run(
                    "CREATE TABLE Team (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, team TEXT, battlemode INT)"
                );

                await db.run(
                    "CREATE TABLE Wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, address TEXT, alias TEXT, chain TEXT, verified INT)"
                );

                await db.run(
                    "CREATE TABLE NFTStats (id INTEGER PRIMARY KEY AUTOINCREMENT, collection TEXT, nftid INT, chain TEXT, health INT, level INT, content TEXT)"
                );

                // Store copies of the team composition
                await db.run(
                    "CREATE TABLE BattleHeader (id INTEGER PRIMARY KEY AUTOINCREMENT, teamA TEXT, teamB TEXT, teamAGalleryID TEXT, teamBGalleryID TEXT, battleDate DATETIME, viewed INT, winner TEXT)"
                );

                await db.run(
                    "CREATE TABLE BattleLine (id INTEGER PRIMARY KEY AUTOINCREMENT, headerID INT, statRoll INT, highestLowestRoll INT, idStatsDeltas TEXT )"
                );
            }
        } catch (dbError) {
            console.error(dbError);
        }
    });

module.exports = {
    uniqueName: async () => {

        let checkName = async (name) => {
            const exists = await db.get(
                "SELECT * from Users WHERE userName = ?", [name]
            );

            if (!exists)
                return name;

            return checkName(randomPropertyName());
        }

        return await checkName(randomPropertyName());

    },
    claimName: async (name, pin) => {
        try {

            const exists = await db.get(
                "SELECT * from Users WHERE userName = ?", [name]
            );

            if (exists) {
                throw "Name already exists.";
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(pin, salt);

            const option = await db.all(
                "INSERT INTO Users (userName, pin, created, salt) VALUES (?, ?, ?, ?)", [name, hash, (new Date()).getTime(), salt]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
            return dbError;
        }
    },
    login: async (name, pin) => {
        try {

            const exists = await db.get(
                "SELECT pin, salt from Users WHERE userName = ?", [name]
            );

            if (exists) {

                return bcrypt.compareSync(pin, exists.pin) ? "SUCCESS" : "FAIL"; // true

            }

            return 'FAIL';
        } catch (dbError) {
            console.error(dbError);
            return dbError;
        }
    },
    updatePin: async (name, pin) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(pin, salt);

            const option = await db.all(
                "UPDATE Users SET pin = ? WHERE userName = ?", [hash, name]
            );

            return "SUCCESS";
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getWallet: async (username) => {
        try {
            return await db.all("SELECT address, chain, alias FROM Wallets WHERE userName like ?||',%'", [username]);

        } catch (dbError) {
            console.error(dbError);
        }

    },
    linkWallet: async (username, address, alias, chain) => {
        try {

            const option = await db.all(
                `INSERT INTO Wallets (userName, address, alias, chain, verified) 
                SELECT ?, ?, ?, ?, 0
                WHERE NOT EXISTS(SELECT 1 FROM Wallets WHERE userName = ? AND address = ? AND chain = ? AND alias = ?)`

                , [username, address, alias, chain, username, address, chain, alias]
            );


            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    unlinkWallet: async (username, address, chain) => {
        try {

            const option = await db.all(
                `DELETE FROM Wallets 
                WHERE  userName = ? AND address = ? AND chain = ?`

                , [username, address, chain]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getTeamStatus: async (username, battlemode = 0) => {
        try {
            const option = await db.all(
                `SELECT * FROM Team WHERE battlemode = ${battlemode} AND userName like ?||',%' ORDER BY id DESC LIMIT 1
              `
                , [username]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getTeamSnapshot: async (id) => {
        try {
            const option = await db.all(
                `SELECT * FROM Team WHERE id = ? ORDER BY id DESC LIMIT 1
              `
                , [id]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getTeamHistory: async (username, battlemode = 0) => {
        try {
            const option = await db.all(
                `SELECT * FROM Team WHERE battlemode = ${battlemode} AND userName like ?||',%' ORDER BY id DESC
              `
                , [username]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    updateTeam: async (username, team, battleMode) => {
        try {

            // Keep battle teams forever so they can be used in the records
            if (battleMode === 0) {
                await db.all(
                    `DELETE FROM Team 
                WHERE  userName = ? AND battlemode = ?`

                    , [username, battleMode]
                );
            }

            const option = await db.all(
                `INSERT INTO Team (userName, team, battlemode) VALUES (?, ?, ?)
              `

                , [username, JSON.stringify(team), battleMode]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },

    getTrackedNFT: async (collection, nftid, chain) => {
        try {

            const option = await db.all(
                `SELECT id,collection, nftid, chain, health, level, content FROM NFTStats  WHERE collection = ? AND nftid = ? AND chain = ? LIMIT 1`

                , [collection, nftid, chain]
            );


            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },

    levelUp: async (id) => {
        try {

            const option = await db.all(
                `UPDATE NFTStats SET level  = level +1 WHERE id = ?`

                , [id]
            );


            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },

    addTrackedNFT: async (collection, nftid, content, chain) => {
        try {

            const option = await db.all(
                `INSERT INTO NFTStats (collection, nftid, chain, health, level, content) 
                SELECT ?, ?, ?, 100, 1, ?
                WHERE NOT EXISTS(SELECT 1 FROM NFTStats WHERE collection = ? AND nftid = ? AND chain = ?)`

                , [collection, nftid, chain, content, collection, nftid, chain]
            );


            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    createNewBattle: async (teamA, teamB, teamAName, teamBName) => {
        try {



            const option = await db.get(
                `INSERT INTO BattleHeader (teamA, teamB, teamAGalleryID, teamBGalleryID, battleDate, viewed) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0);`

                , [JSON.stringify(teamA), JSON.stringify(teamB), teamAName, teamBName]
            );

            const inserted = await db.get(
                `SELECT last_insert_rowid() as rowID`


            );

            return inserted.rowID;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getMatchData: async (NFTList) => {
        try {

            // We have list of collection and id, want to get list of NFT Stats and NFT Data per those lists
            // SELECT Collection then INNER JOIN the ID

            const qry = `SELECT * FROM NFTStats WHERE nftid||':'||collection IN (${NFTList.map(x => `'${x.id}:${x.collection}'`).join(',')})`;

            const option = await db.all(qry
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getBattleHeaders: async (gallery) => {
        try {



            const option = await db.all(
                `SELECT * FROM BattleHeader WHERE teamAGalleryID = ? OR teamBGalleryID = ? ORDER BY id DESC LIMIT 20 
              `

                , [gallery, gallery]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    setBattleViewed: async (id) => {
        try {



            const option = await db.all(
                `UPDATE BattleHeader SET viewed = true WHERE id = ?
              `

                , [id]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    setBattleWinner: async (id, ownerWon) => {
        try {



            const option = await db.all(
                `UPDATE BattleHeader SET winner = ? WHERE id = ?
              `

                , [ownerWon, id]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    addBattleLine: async (headerID, statRoll, hiLoRoll, statDeltas) => {
        try {

            // Use special statRoll for end of battle

            const option = await db.all(
                `INSERT INTO BattleLine (headerID, statRoll, highestLowestRoll, idStatsDeltas) VALUES (?, ?, ?, ?)
              `

                , [headerID, statRoll, hiLoRoll, JSON.stringify(statDeltas)]
            );
            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    getBattleTeamList: async (newerThanID = 0) => {
        try {
            const option = await db.all(
                `SELECT DISTINCT userName FROM Team WHERE id > ${newerThanID} AND battlemode = 1 ORDER BY id DESC LIMIT 1000
              `

            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }

    },
    getFullBattle: async (battleID) => {
        try {
            const header = await db.all(
                `SELECT * FROM BattleHeader WHERE id = ?
          `

                , [battleID]
            );

            const lines = await db.all(
                `SELECT * FROM BattleLine WHERE headerID = ?
          `

                , [battleID]
            );
            return { header, lines };

        } catch (dbError) {
            console.error(dbError);
        }

    }

    // INT, StatRoll INT, HighestLowestRoll INT, IDStatsList TEXT


};
