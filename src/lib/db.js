import mongoose from "mongoose";

async function connectDB() {
	if (mongoose.connection.readyState >= 1) return mongoose.connection;
	await mongoose.connect(process.env.MONGODB_URI);
	return mongoose.connection;
}

export default connectDB;
