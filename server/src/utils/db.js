import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("hi");
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connceted succesfully`);
    } catch (e) {
        console.log(`connection failed -MONGODB`);
        process.exit(1);
    }
}

export default connectDB;