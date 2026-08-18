import dns from "node:dns";
import mongoose from "mongoose";

// Force trusted public resolvers to avoid local ISP/router DNS issues with mongo+srv.
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

async function connectDB() {
	if (mongoose.connection.readyState >= 1) return mongoose.connection;
	const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
	if (!uri) throw new Error("MongoDB connection string is not configured");
	await mongoose.connect(uri);
	return mongoose.connection;
}

export default connectDB;
