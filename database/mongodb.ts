import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    throw new Error('DB_URI is not defined in the environment variables, please define the MONGODB_URI variable in your .env file.');
}

const connectToDB = async () => {
    try {
        await mongoose.connect(DB_URI!);
        console.log(`Connected to MongoDB in ${NODE_ENV} mode successfully!`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure

    }
}

export default connectToDB;