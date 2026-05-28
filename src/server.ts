import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';

dotenv.config();

connectDB();

const app: Application = express();

app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('E-commerce API is running with TypeScript...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});