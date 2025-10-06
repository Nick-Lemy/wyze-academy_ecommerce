import { createUser, getAllUsers, getUserById } from "../models/user.model.js";
import { encryptPassword, generateToken } from "../helpers/auth.helper.js"

export async function getUsersController(req, res) {
    try {
        const users = await getAllUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getUserByIdController(req, res) {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function addUserController(req, res) {
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
        const token = generateToken({ userId: user._id, email })
        user.token = token
        user.password = undefined
        user.__v = undefined

        res.status(201).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}
