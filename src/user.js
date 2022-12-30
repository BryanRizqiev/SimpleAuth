import { hashPassword, comparePassword } from "./hash.js"
import { generateToken } from "./jwt.js"
import conn from './mysql.js'
import Validator from "fastest-validator"
const v = new Validator()

// query
const insertUser = (username, password, name) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO users (username, password, name) VALUES (?, ?, ?);", 
        [username, password, name],
        (err, result, fieldsreturned) => {
            if (err) reject(err)
            resolve(fieldsreturned)
        })
    })
}

const selectOneUser = (username) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT id, name, password FROM users WHERE username = ? LIMIT 1;", 
        [username],
        (err, result, fieldsreturned) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

const register = async (req, res) => {
    
    const schema = {
        username: { type: "string" },
        password: { type: "string" },
        name: { type: "string" }
    }

    try {

        const { username, password, name } = req.body

        let check = v.compile(schema)
        check = check({ username, password, name })
        if (check.length) return res.status(400).json(check)

        const hashedPassword = await hashPassword(password, 10)
        
        // null
        const result = await insertUser(username, hashedPassword, name)

        return res.status(201).json({ username, password, name, hashedPassword, result })
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: err.message})
    }
}

const login = async (req, res) => {

    const schema = {
        username: { type: "string" },
        password: { type: "string" }
    }

    try {

        const { username, password } = req.body

        let check = v.compile(schema)
        check = check({ username, password })
        if (check.length) return res.status(400).json(check)
        
        const result = await selectOneUser(username)

        if (result[0] == undefined) {
            return res.status(401).json({ 
                auth: false,
                message: "Kredensial tidak cocok (username tidak ada)"
            })
        } else  {
            const compare = await comparePassword(password, result[0].password)

            if (!compare) return res.status(401).json({ 
                auth: false,
                message: "Kredensial tidak cocok"
            })
            
            const token = generateToken({
                user: result[0].id,
                name: result[0].name
            })

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ 
                auth: true,
                message: "Berhasil login",
                token
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({ 
            auth: false,
            message: err.message
        })
    }
    
}

export { register, login }