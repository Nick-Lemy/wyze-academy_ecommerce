import { verifyToken } from '../helpers/auth.helper.js'

export function userMiddleware(req, res, next) {
    // console.log('headers:=>>>>>>>>>>>>.', req.headers)
    console.log(req.headers.authorization)

    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        res.status(403).send({ message: 'Token is missing' })
    }
    try {
        const decode = verifyToken(token)
        console.log(decode)
        req.user = decode
    } catch (error) {
        return res.status(401).send({ message: 'Invalid Token' })
    }
    return next()
}

export function adminMiddleware(req, res, next) {
    const token = req.headers.Authorization.split(' ')[1]
    if (!token) {
        res.status(403).send({ message: 'Token is missing' })
    }
    try {
        const decode = verifyToken(token)
        console.log(decode)
        if (decode.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied, Admin only' })
        }
        req.user = decode
    } catch (error) {
        return res.status(401).send({ message: 'Invalid Token' })
    }
    return next()
}