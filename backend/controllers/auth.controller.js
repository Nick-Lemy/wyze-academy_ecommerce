import { comparePasswords } from "../helpers/auth.helper.js";
import { getUserByEmail } from "../models/user.model.js";

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
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error' })
    }
    res.status(200).send({ message: 'User authenticated successfully' });
}