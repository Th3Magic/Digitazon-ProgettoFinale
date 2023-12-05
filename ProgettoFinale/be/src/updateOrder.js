const connection = require('./connection')
const { ObjectId } = require('mongodb');

async function updateOrder(filter, modifier) {
    let db = await connection()
    let col1 = db.collection("Shops");
    let col2 = db.collection("Users");
    const orderId = new ObjectId();
    let { shop, shopAddress, ...orderToAddShop } = modifier
    let { user, ...orderToAddUser } = modifier
    orderToAddShop._id = orderId;
    orderToAddUser._id = orderId;
    await col1.updateOne(
        { email: filter.shop, city: filter.city },
        { $push: { orders: orderToAddShop } }
    );

    await col2.updateOne(
        { email: filter.user },
        { $push: { orders: orderToAddUser } }
    );
}

module.exports = updateOrder