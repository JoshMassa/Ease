import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatApp';

async function connectToDatabase() {
    try {
        await mongoose.connect(url);
        console.log('Connected successfully to MongoDB server');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

export { connectToDatabase };
