
const connection = require('./connection')

async function del(colName, filter) {
    let db = await connection()
    const col = db.collection(colName);

    // Delete the document into the specified collection        
    const deleteResult = await col.deleteOne(filter);
    return deleteResult
}

module.exports = del