import connectDB from "@/lib/db";
import { User } from "@/models";
import { NextResponse } from "next/server";

export async function POST(req, res) {
	try {
		const { name, email, password, company, industry } = await req.json();

		if (!name || !email || !password || !company) {
			return NextResponse.json(
				{ message: "Name, email, password and company are required" },
				{ status: 400 },
			);
		}

		if (password.length < 8) {
			return NextResponse.json(
				{ message: "Password must be at least 8 characters long" },
				{ status: 400 },
			);
		}

		await connectDB();

		const normalizedEmail = String(email).trim().toLowerCase();
		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return NextResponse.json({ message: "User already exists" }, { status: 409 });
		}

		await User.create({
			name: String(name).trim(),
			email: normalizedEmail,
			password,
			company: String(company).trim(),
			company_name: String(company).trim(),
			industry: industry ? String(industry).trim() : undefined,
			lastLogin: new Date(),
		});

		return NextResponse.json({ message: "User created successfully" }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ message: error?.message || "Failed to create user" },
			{ status: 500 },
		);
	}
}
