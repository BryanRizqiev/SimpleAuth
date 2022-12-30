import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()


const generateToken = (payload) => {

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '5m' })
    return token
}

// kurang berguna
const verify = (token) => {
    
    return jwt.verify(token, process.env.SECRET_KEY, (err) => {

    })
}

export { generateToken, verify }