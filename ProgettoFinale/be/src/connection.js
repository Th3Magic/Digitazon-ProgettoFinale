const { MongoClient } = require("mongodb");
const url = process.env.CONNECTION_STRING
const client = new MongoClient(url);
const dbName = "ProgettoFinale";
let isConnected = false

async function connection() {

    try {
        if (!isConnected) {
            await client.connect();
        }

        return client.db(dbName);

    } catch (err) {
        console.log(err.stack);
    }

}

module.exports = connection
