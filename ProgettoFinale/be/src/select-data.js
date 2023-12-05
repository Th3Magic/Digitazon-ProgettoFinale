
const connection = require('./connection')

async function select(colName, filter) {
    // Reference the "people" collection in the specified database
    let db = await connection()
    let col = db.collection(colName);

    // Find and return the document
    return document = filter ? await col.findOne(filter) :
        await col.find({}).toArray()

}

module.exports = select
