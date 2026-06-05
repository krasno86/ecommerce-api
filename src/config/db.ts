import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        console.log(`MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    } catch (error: any) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;