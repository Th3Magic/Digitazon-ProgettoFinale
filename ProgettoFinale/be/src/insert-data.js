const connection = require('./connection')

async function insert(colName, input) {
    let db = await connection()
    const col = db.collection(colName);

    // Insert the document into the specified collection        
    const p = await col.insertOne(input);
    return p
}

module.exports = insert
