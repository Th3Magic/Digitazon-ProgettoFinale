const connection = require('./connection')

async function updateItem(filter, modifier) {
    let db = await connection()
    let col = db.collection("Shops");
    await col.updateOne(filter, { $set: { ...modifier } });

}

module.exports = updateItem