import express from 'express'
import multer from 'multer'
import conn from './mysql.js'
import { isMainThread } from "node:worker_threads"
import { login, register } from './user.js'

conn.connect(function(err) {
    if (err) throw err
    console.log('Connected')
})

const upload = multer()
const app = express()
app.use(upload.array())

app.use(express.json())

app.post("/anjay", function(req, res) {
    res.json({message: "Ntap"})
})

app.get("/anjay", function(req, res) {
    res.json({message: "Ntap"})
})

const getData = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM vehicles WHERE is_out = 0", (err, result) => {
            if (err) reject(err)
            console.log("Async: " + isMainThread)
            resolve(result)
        })
    })
}

app.get("/getDatas", async (req, res) => {
    console.log("Sync: " + isMainThread)
    const result = await getData()
    return res.json({datas: result})
})

app.post("/register", register)

app.post("/login", login)

app.use(function (req,res,next) {
	res.status(404).send({message: '404 not found'})
})

app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({message: 'Something broke!'})
})

app.listen(3007, function() {
    console.log('localhost:3000');
})