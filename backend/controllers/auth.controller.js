import { comparePasswords, generateToken, encryptPassword } from "../helpers/auth.helper.js";
import { getUserByEmail, createUser, getUserById, updateUser } from "../models/user.model.js";


export async function registerController(req, res) {
    try {
        const { firstName, lastName, email, password, address } = req.body

        // Validation
        if (!(email && password && firstName && lastName && address)) {
            return res.status(400).send({ message: 'All fields are required' })
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).send({ message: 'Password must be at least 6 characters long' })
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email.toLowerCase())
        if (existingUser) {
            return res.status(409).send({ message: 'User with this email already exists' })
        }

        const encryptedPassword = await encryptPassword(password)

        const user = await createUser({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
        })

        const token = generateToken({ userId: user._id, email: user.email, role: user.role })

        // Clean user object
        const userResponse = user.toObject()
        delete userResponse.password
        delete userResponse.__v

        res.status(201).json({ user: userResponse, token })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' })
        }

        const user = await getUserByEmail(email.toLowerCase())
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' })
        }

        const passwordValidity = await comparePasswords(password, user.password)
        if (!passwordValidity) {
            return res.status(401).send({ message: 'Invalid email or password' })
        }

        const token = generateToken({ userId: user._id, email: user.email, role: user.role })

        // Clean user object
        const userResponse = user.toObject()
        delete userResponse.password
        delete userResponse.__v

        res.status(200).send({ user: userResponse, token });
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).send({ message: 'Internal server error' })
    }
}


export async function getCurrentUserController(req, res) {
    console.log(req.user)
    try {
        const user = await getUserById(req.user.userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.password = undefined;
        user.__v = undefined;
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function updateUserController(req, res) {
    try {
        const userId = req.user.userId;
        const userData = req.body;
        const updatedUser = await updateUser(userId, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}