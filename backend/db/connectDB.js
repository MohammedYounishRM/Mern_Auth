import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Is Connected In ${connect.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;