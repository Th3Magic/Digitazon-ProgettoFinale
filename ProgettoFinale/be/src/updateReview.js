const connection = require('./connection')
const { ObjectId } = require('mongodb');

async function updateReview(id, review) {
    let db = await connection()
    let col1 = db.collection("Shops");
    let col2 = db.collection("Users");
    let orderId = new ObjectId(id)
    await col1.updateOne(
        { "orders._id": orderId },
        { $push: { reviews: review } }
    )

    await col2.updateOne(
        { "orders._id": orderId },
        { $push: { reviews: review } }
    )
}

module.exports = updateReview