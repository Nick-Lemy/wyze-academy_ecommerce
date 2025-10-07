import { Schema, model } from "mongoose"
import Product from "./product.model.js"

const userSchema = new Schema({
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    favorites: {
        type: [String],
        default: []
    },
    cart: {
        type: [{
            productId: String,
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: []
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    token: {
        type: String
    }
})

const User = model('user', userSchema)
export default User

export async function createUser(data) {
    try {
        const existingUser = await User.findOne({ email: data.email })
        if (existingUser) {
            throw new Error("User already exists")
        }
        const user = new User(data)
        await user.save()
        return user
    } catch (error) {
        throw new Error("Error creating user")
    }
}

export async function updateUser(userId, data) {
    try {
        const user = await User.findByIdAndUpdate(userId, data, { new: true })
        if (!user) {
            throw new Error("User not found")
        }
        return user
    } catch (error) {
        throw new Error("Error updating user")
    }
}

export async function getAllUsers() {
    try {
        const users = await User.find()
        return users
    } catch (error) {
        throw new Error("Error fetching users")
    }
}

export async function getUserById(userId) {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        return user
    } catch (error) {
        throw new Error("Error fetching user by id")
    }
}

export async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email })
        return user
    } catch (error) {
        throw new Error("Error fetching user by email")
    }
}