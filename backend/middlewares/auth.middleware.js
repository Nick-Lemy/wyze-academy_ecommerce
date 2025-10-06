import { verifyToken } from '../helpers/auth.helper'

export default function adminMiddleware(req, res, next) {
    console.log(req.headers.Authorization)
    const token = req.headers.Authorization.split(' ')[1]
    if (!token) {
        res.status(403).send("token is missing")
    }
    try {
        const decode = verifyToken(token)
        console.log(decode)
        req.user = decode
    } catch (error) {
        return res.status(401).send('Invalid Token')
    }
    return next()
}


export default function adminMiddleware(req, res, next) {
    console.log(req.headers.Authorization)
    const token = req.headers.Authorization.split(' ')[1]
    if (!token) {
        res.status(403).send("token is missing")
    }
    try {
        const decode = verifyToken(token)
        console.log(decode)
        if (decode.role !== 'admin') {
            return res.status(403).send('Access denied')
        }
        req.user = decode
    } catch (error) {
        return res.status(401).send('Invalid Token')
    }
    return next()
}