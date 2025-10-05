import express from 'express'
import dotenv from 'dotenv'
import { PORT } from './configs/varaibles';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
