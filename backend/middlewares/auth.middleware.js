import { verifyToken } from '../helpers/auth.helper.js'

export function userMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(403).send({ message: 'Token is missing' })
    }
    try {
        const decode = verifyToken(token)
        if (!decode) {
            return res.status(401).send({ message: 'Invalid Token' })
        }
        req.user = decode
        return next()
    } catch (error) {
        console.error('Token verification error:', error)
        return res.status(401).send({ message: 'Invalid Token' })
    }
}

export function adminMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(403).send({ message: 'Token is missing' })
    }
    try {
        const decode = verifyToken(token)
        if (!decode) {
            return res.status(401).send({ message: 'Invalid Token' })
        }
        if (decode.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied, Admin only' })
        }
        req.user = decode
        return next()
    } catch (error) {
        console.error('Token verification error:', error)
        return res.status(401).send({ message: 'Invalid Token' })
    }
}