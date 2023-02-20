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
                    "CREATE TABLE Team (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, nftID TEXT, team TEXT)"
                );

                await db.run(
                    "CREATE TABLE Wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, address TEXT)"
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
            return await db.all("SELECT address, chain FROM Wallets WHERE userName = ?", [username]);

        } catch (dbError) {
            console.error(dbError);
        }

    },
    linkWallet: async (username, address, chain) => {
        try {

            const option = await db.all(
                `INSERT INTO Wallets (userName, address, chain, verified) 
                SELECT ?, ?, ?, 0
                WHERE NOT EXISTS(SELECT 1 FROM Wallets WHERE userName = ? AND address = ? AND chain = ?)`

                , [username, address, chain, username, address, chain]
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
    getTeamStatus: async (username) => {
        try {
            const option = await db.all(
                `SELECT * FROM Status WHERE userName = ?
              `
                , [username]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    markTeam: async (username, nftid, team) => {
        try {


            const deleteOld = await db.all(
                `DELETE FROM Status 
                WHERE  userName = ? AND nftID = ? AND team = ?`

                , [username, nftid, status]
            );

            const option = await db.all(
                `INSERT INTO Status (userName, nftID, status, value) VALUES (?, ?, ?)
              `

                , [username, nftid, team]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },
    unmarkTeam: async (username, nftid, team) => {
        try {

            const option = await db.all(
                `DELETE FROM Status 
                WHERE  userName = ? AND nftID = ? AND team = ?`

                , [username, nftid, team]
            );

            return option;
        } catch (dbError) {
            console.error(dbError);
        }
    },


};
