dotenv.config();
import express from 'express'
import dotenv from 'dotenv'
import { MONGODB_URL, PORT } from './configs/variables.js';
import Product from './models/product.js';
import './configs/database.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products)
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: 'Bad Request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
