dotenv.config();
import express from 'express'
import dotenv from 'dotenv'
import { PORT } from './configs/variables.js';
import fileUpload from 'express-fileupload';
import productRouter from './routes/product.route.js'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
dotenv.config();
import './configs/database.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/products', productRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
