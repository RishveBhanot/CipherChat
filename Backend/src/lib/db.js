import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongo DB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`MongoDB not connected`, error);
    }
};