dotenv.config();
import express from 'express'
import dotenv from 'dotenv'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME, PORT } from './configs/variables.js';
import Product from './models/product.js';
import './configs/database.js';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';

cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/add-file', async (req, res) => {

})


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
    const { file } = req.files;
    const { title, price, description, miniTitle, category, features, sku } = req.body;
    console.log({ title, price, description, miniTitle, category, features, sku })
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
        })
        const { secure_url } = result
        const product = new Product({ title, price, description, miniTitle, category, features, sku, image: secure_url });
        await product.save();
        res.status(201).send({ ...product });
    } catch (error) {
        res.status(400).send({ error: `Error: ${error}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
