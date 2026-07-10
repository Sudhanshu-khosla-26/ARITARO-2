import connectDB from "@/lib/db";
import { User } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	const { name, email, password } = await req.json();
	if (!name || !email || !password) {
		return NextResponse.json({ message: "All fields are required" }).status(
			400,
		);
	}
	if (password.length < 6) {
		return NextResponse.json(
			{ message: "Password must be at least 6 characters long" },
			{ status: 400 },
		).status(400);
	}
	const conn = connectDB();
	if (!conn)
		return NextResponse.json(
			{ message: "Database connection failed" },
			{ status: 500 },
		).status(500);
	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) {
		return NextResponse.json(
			{ message: "User already exists" },
			{ status: 400 },
		).status(400);
	}
	const user = await User.create({
		name,
		email,
		password,
		lastLogin: Date.now(),
	});
	return NextResponse.json(
		{ message: "User created successfully" },
		{ status: 200 },
	).status(200);
}
