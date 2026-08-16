import mongoose from "mongoose";

async function connectDB() {
	if (mongoose.connection.readyState >= 1) return mongoose.connection;
	const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
	if (!uri) throw new Error("MongoDB connection string is not configured");
	await mongoose.connect(uri);
	return mongoose.connection;
}

export default connectDB;
