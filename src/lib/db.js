import dns from "node:dns";
import mongoose from "mongoose";

// Force trusted public resolvers to avoid local ISP/router DNS issues with mongo+srv
try {
	dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);
} catch (e) {
	// ignore
}

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const uri = process.env.MONGODB_URI || process.env.MONGODB_CONNECTION_STRING;
		if (!uri) throw new Error("MongoDB connection string is not configured");

		const opts = {
			bufferCommands: false,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
		};

		cached.promise = mongoose.connect(uri, opts).then((m) => m);
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectDB;
