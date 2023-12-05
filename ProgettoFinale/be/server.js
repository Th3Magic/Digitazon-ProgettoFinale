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
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: true, msg: 'All fields are required' })
    } else {
        next()
    }
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization || req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: true, msg: 'Unauthorized: Token not provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: true, msg: 'Unauthorized: Invalid token.' });
        }

        req.user = decoded;
        next();
    });
}

app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/user-info', verifyToken, (req, res) => {
    res.json(req.user);
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
        const token = jwt.sign({ name: user.name, email: user.email, city: user.city, address: user.address, orders: user.orders }, process.env.JWT_SECRET);
        loggedInUsers.push({ ...user, token });
        res.json({ msg: 'Login successful.', name: user.name, email: user.email, city: user.city, address: user.address, orders: user.orders, token: token });
    } else if (shop) {
        const token = jwt.sign({ name: shop.name, email: shop.email, city: shop.city, address: shop.address, orders: shop.orders, type: shop.type, menu: shop.menu }, process.env.JWT_SECRET);
        loggedInUsers.push({ ...shop, token });
        res.json({ msg: 'Login successful.', name: shop.name, email: shop.email, city: shop.city, address: shop.address, orders: shop.orders, type: shop.type, menu: shop.menu, token: token });
    } else {
        res.status(400).json({ error: true, msg: 'Invalid credentials.' })
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
        res.status(400).json({ error: true, msg: 'User not found or not logged in.' })
    }
})

// Endpoint per la modifica dati utente
app.put('/users/:user', async (req, res) => {
    const user = req.params.user
    const modifier = req.body
    const userIsLogged = loggedInUsers.find(u => u.email === user)
    if (userIsLogged) {
        await update("Users", { email: user }, modifier)
        res.status(200).json({ msg: 'Modified successfully' })
    } else {
        res.status(401).json({ error: true, msg: 'User must be logged' })
    }
})

// Endpoint per l'eliminazione di un utente
app.delete('/users/:user', async (req, res) => {
    const user = req.params.user
    const userIsLogged = loggedInUsers.find(u => u.email === user)
    if (userIsLogged) {
        await del("Users", { email: user })
        res.status(200).json({ msg: 'Deleted successfully' })
    } else {
        res.status(401).json({ error: true, msg: 'User must be logged' })
    }
})

// Endpoint per ottenere un utente
app.get('/users/:user', async (req, res) => {
    const user = req.params.user
    const userIsLogged = loggedInUsers.find(u => u.email === user)
    if (userIsLogged) {
        let result = await select("Users", { email: user })
        res.status(200).json(result)
    } else {
        res.status(401).json({ error: true, msg: 'User must be logged' })
    }
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
app.delete('/shops/:city/:shop', async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    const userIsLogged = loggedInUsers.find(u => u.email === shop)
    if (userIsLogged) {
        await del("Shops", { email: shop, city: city })
        res.status(200).json({ msg: 'Deleted successfully' })
    } else {
        res.status(401).json({ error: true, msg: 'User must be logged' })
    }
})

// Endpoint per la modifica del menu di uno shop
app.put('/shops/:city/:shop/menu', async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    const item = req.body
    const userIsLogged = loggedInUsers.find(u => u.email === shop)
    if (userIsLogged) {
        await updateItem({ email: shop, city: city }, item)
        res.status(200).json({ msg: 'Modified successfully' })
    } else {
        res.status(401).json({ error: true, msg: 'User must be logged' })
    }
})

// Endpoint per l'inserimento di un ordine
app.post('/orders/:city/:shop', async (req, res) => {
    const city = req.params.city
    const shop = req.params.shop
    const order = req.body
    const date = getDate()
    const userIsLogged = loggedInUsers.find(u => u.email === order.user)
    if (userIsLogged) {
        await updateOrder({ shop: shop, city: city, user: order.user }, { date: date, ...order })
        res.status(200).json({ msg: 'Order added successfully' })
    } else {
        res.status(400).json({ error: true, msg: "Couldn't complete the order" })
    }
})

// Endpoint per l'inserimento di una review'
app.put('/orders/:order', async (req, res) => {
    const orderId = req.params.order
    const review = req.body
    await updateReview(orderId, review)
    res.status(200).json({ msg: 'Review added successfully' })
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})