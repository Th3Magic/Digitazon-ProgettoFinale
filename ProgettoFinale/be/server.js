const express = require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const jwt = require('jsonwebtoken');
const cors = require('cors');

const select = require('./src/select-data')
const insert = require('./src/insert-data')
const update = require('./src/update-data')
const updateItem = require('./src/updateItem')
const updateOrder = require('./src/updateOrder')
const updateReview = require('./src/updateReview')
const del = require('./src/delete-data')

const loggedInUsers = []

function getDate() {
    const dataCorrente = new Date()
    const day = String(dataCorrente.getDate()).padStart(2, '0')
    const month = String(dataCorrente.getMonth() + 1).padStart(2, '0')
    const year = dataCorrente.getFullYear()
    const hours = String(dataCorrente.getHours()).padStart(2, '0')
    const minutes = String(dataCorrente.getMinutes()).padStart(2, '0')
    const seconds = String(dataCorrente.getSeconds()).padStart(2, '0')

    return dataFormat = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

async function userAlreadyExists(req, res, next) {
    const email = req.body.email
    const user = await select("Users", { email: email })
    if (!user) {
        next()
    } else {
        res.status(400).json({ error: true, msg: 'Email already registered, try to login instead' })
    }
}

function fieldsNotCompiled(req, res, next) {
    const { name, email, password, city, address } = req.body
    if (!name || !email || !password || !city || !address) {
        return res.status(422).json({ error: true, msg: 'All fields are required' })
    } else {
        next()
    }
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ error: true, msg: 'Unauthorized: Token not provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: true, msg: 'Unauthorized: Invalid token.' });
        }

        const routeParam = req.params.user || req.params.shop;

        if (routeParam !== decoded.email) {
            return res.status(403).json({ error: true, msg: 'Forbidden: You do not have access to this resource.' });
        }

        req.user = decoded;
        next()
    })
}

app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/API-key', (req, res) => {
    res.json(process.env.API_KEY);
})

// Endpoint per la lista di tutti gli utenti registrati
app.get('/users', async (req, res) => {
    const users = await select("Users")
    const filteredUsers = users.map(({ password, _id, ...keep }) => keep)
    res.json(filteredUsers)
})

// Endpoint per la registrazione di un nuovo utente
app.post('/signup', fieldsNotCompiled, userAlreadyExists, async (req, res) => {
    const user = req.body
    if (user.type === "restaurant" || user.type === "store") {
        await insert("Shops", {
            orders: [], reviews: [], menu: {
                "Antipasti": [],
                "Primi": [],
                "Secondi": [],
                "Fast Food": [],
                "Dolci": [],
                "Pizze": [],
                "Bibite": []
            }, ...user
        })
        res.status(201).json({ message: 'Shop registered successfully.' })
    } else {
        await insert("Users", { orders: [], contacts: ["email"], reviews: [], ...user })
        res.status(201).json({ message: 'User registered successfully.' })
    }
})

// Endpoint per il login di un utente
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await select("Users", { email: email, password: password })
    const shop = await select("Shops", { email: email, password: password })
    if (user) {
        const token = jwt.sign(user, process.env.JWT_SECRET)
        loggedInUsers.push({ ...user, token })
        let { password, ...filteredUser } = user
        res.json({ msg: 'Login successful', ...filteredUser, token: token });
    } else if (shop) {
        const token = jwt.sign(shop, process.env.JWT_SECRET);
        loggedInUsers.push({ ...shop, token });
        let { password, ...filteredShop } = shop
        res.json({ msg: 'Login successful', ...filteredShop, token: token });
    } else {
        res.status(400).json({ error: true, msg: 'Invalid credentials' })
    }
})

// Endpoint per il logout di un utente
app.post('/logout', (req, res) => {
    const { email } = req.body
    const index = loggedInUsers.findIndex(u => u.email === email)
    if (index !== -1) {
        loggedInUsers.splice(index, 1)
        res.json({ msg: 'Logout successful.' })
    } else {
        res.status(400).json({ error: true, msg: 'User not logged in.' })
    }
})

// Endpoint per ottenere un utente
app.get('/users/:user', verifyToken, async (req, res) => {
    const user = req.params.user
    let result = await select("Users", { email: user })
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({ error: true, msg: 'User not found' })
    }
})

// Endpoint per la modifica dati utente
app.put('/users/:user', verifyToken, async (req, res) => {
    const user = req.params.user
    const modifier = req.body
    await update("Users", { email: user }, modifier)
    res.status(200).json({ msg: 'Modified successfully' })
})

// Endpoint per l'eliminazione di un utente
app.delete('/users/:user', verifyToken, async (req, res) => {
    const user = req.params.user
    await del("Users", { email: user })
    res.status(200).json({ msg: 'Deleted successfully' })
})

// Endpoint per ottenere uno shop
app.get('/shops/:city/:shop', async (req, res) => {
    const city = req.params.city
    const shopName = req.params.shop
    const shop = await select("Shops", { name: shopName, city: city })
    if (shop) {
        const { password, ...filteredShop } = shop
        res.status(200).json(filteredShop)
    } else {
        res.status(404).json({ error: true, msg: "Shop not found" })
    }
})

// Endpoint per l'eliminazione di uno shop
app.delete('/shops/:city/:shop', verifyToken, async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    await del("Shops", { email: shop, city: city })
    res.status(200).json({ msg: 'Deleted successfully' })
})

// Endpoint per la modifica del menu di uno shop
app.put('/shops/:city/:shop/menu', verifyToken, async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    const item = req.body
    console.log(item, shop, city)
    await updateItem({ email: shop, city: city }, item)
    res.status(200).json({ msg: 'Modified successfully' })
})

// Endpoint per l'inserimento di un ordine
app.post('/orders/:city/:shop', async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    const order = req.body
    const date = getDate()
    const loggedUser = loggedInUsers.find(user => user.email === order.user)
    if (loggedUser) {
        await updateOrder({ shop: shop, city: city, user: order.user }, { date: date, ...order })
        res.status(200).json({ msg: 'Order added successfully' })
    } else {
        res.status(403).json({ error: true, msg: 'Forbidden: You do not have access to this resource.' })
    }
})

// Endpoint per l'inserimento di una review
app.put('/orders/:order', async (req, res) => {
    const orderId = req.params.order
    const review = req.body
    const loggedUser = loggedInUsers.find(user => user.name === review.name && user.surname === review.surname)
    if (loggedUser) {
        await updateReview(orderId, review)
        res.status(200).json({ msg: 'Review added successfully' })
    } else {
        res.status(400).json({ error: true, msg: 'Can not complete the requested operation' })
    }

})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})