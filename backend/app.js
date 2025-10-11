import express from 'express'
import dotenv from 'dotenv'
import { PORT } from './configs/variables.js';
import fileUpload from 'express-fileupload';
import productRouter from './routes/product.route.js'
import publicProductRouter from './routes/public-product.route.js'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
import { adminMiddleware, userMiddleware } from './middlewares/auth.middleware.js';
import cors from 'cors';
dotenv.config();
import './configs/database.js';
import orderRouter from './routes/order.route.js';
import checkoutRouter from './routes/checkout.route.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.get('/', (req, res) => {
    res.send('Welcome to Wyze Academy!');
});

// Public routes (no authentication required)
app.use('/products', publicProductRouter)

// Protected routes (authentication required)  
app.use('/products', userMiddleware, productRouter)
app.use('/users', adminMiddleware, userRouter)
app.use('/auth', authRouter)
app.use('/orders', userMiddleware, orderRouter)
app.use('/checkout', checkoutRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
