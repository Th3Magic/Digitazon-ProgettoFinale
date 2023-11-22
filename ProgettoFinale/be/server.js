const express = require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
app.use(bodyparser.json())


app.get('/', async (req, res) => {
    res.send("ok")
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})