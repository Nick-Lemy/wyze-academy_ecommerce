import { comparePasswords, generateToken } from "../helpers/auth.helper.js";
import { getUserByEmail } from "../models/user.model.js";


export async function registerController(req, res) {
    try {
        const { firstName, lastName, email, password, address } = req.body
        if (!(email && password && firstName && lastName && address)) {
            res.status(400).send('All field are required')
        }
        const encryptedPassword = await encryptPassword(password)

        const user = await createUser({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
        })
        const token = generateToken({ userId: user._id, email, role: user.role })
        user.token = token
        user.password = undefined
        user.__v = undefined

        res.status(201).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email)
        if (!user) {
            res.status(404).send({ message: 'User not found' })
        }
        const passwordValidity = await comparePasswords(password, user.password)
        if (!passwordValidity) {
            res.status(403).send({ message: "The password is incorrect" })
        }
        const token = generateToken({ userId: user._id, email: user.email, role: user.role })
        res.status(200).send({ user, token });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error' })
    }
}
