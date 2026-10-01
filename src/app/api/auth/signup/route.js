import connectDB from "@/lib/db";
import { User } from "@/models";
import { sanitizeInput } from "@/lib/security";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const body = await req.json().catch(() => ({}));
		const { name, email, password, company, industry } = body;

		if (!name || !email || !password || !company) {
			return NextResponse.json(
				{ message: "Name, email, password, and company are required." },
				{ status: 400 },
			);
		}

		if (typeof password !== "string" || password.length < 8) {
			return NextResponse.json(
				{ message: "Password must be at least 8 characters long." },
				{ status: 400 },
			);
		}

		await connectDB();

		const normalizedEmail = String(email).trim().toLowerCase();
		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
		}

		await User.create({
			name: sanitizeInput(String(name).trim()),
			email: normalizedEmail,
			password,
			company: sanitizeInput(String(company).trim()),
			company_name: sanitizeInput(String(company).trim()),
			industry: industry ? sanitizeInput(String(industry).trim()) : undefined,
			lastLogin: new Date(),
		});

		return NextResponse.json({ message: "User created successfully." }, { status: 201 });
	} catch (error) {
		console.error("Signup internal error:", error);
		return NextResponse.json(
			{ message: "Failed to create account. Please try again later." },
			{ status: 500 },
		);
	}
}
