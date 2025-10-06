import bcrypt from "bcryptjs"
import { SECRET_KEY } from "../configs/variables.js"
import jwt from "jsonwebtoken"


export async function encryptPassword(password) {
    return await bcrypt.hash(password, 10)
}

export async function comparePasswords(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword)
}

export function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '10h' })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY)
    } catch (error) {
        return null
    }
}