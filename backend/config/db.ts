// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const connectDB = async (): Promise<void> => {
    //Ensure DB URI
    if (!process.env.MONGODB_URI) {
        console.error(
            'FATAL ERROR: MONGODB_URI environment variable is not defined.'
        );
        process.exit(1);
    }
    try {
        const connectionDBURI = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Server Connected: ', connectionDBURI.connection.host);
    } catch (err: unknown) {
        let errMsg = 'An unknown error occurred during database connection.';
        if (err instanceof Error) {
            errMsg = err.message;
        } else if (typeof err === 'string') {
            errMsg = err;
        }
        console.error(`Error while connecting to DB ${errMsg}`);
        process.exit(1);
    }
};

export default connectDB;
