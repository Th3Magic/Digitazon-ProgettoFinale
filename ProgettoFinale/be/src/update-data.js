
const connection = require('./connection')

async function update(colName, filter, modifier) {
    let db = await connection()
    let col = db.collection(colName);
    await col.updateOne(filter, { $set: { ...modifier } });

}

module.exports = update