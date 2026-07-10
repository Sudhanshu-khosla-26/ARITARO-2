import connectDB from "@/lib/db";
import ContactRequest from "@/models/ContactRequest";
import { requireAdmin } from "@/lib/session";
import { sanitizeInput } from "@/lib/security";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/contact-requests - admin only, fetches all contact requests
export async function GET(request) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const requests = await ContactRequest.find().sort({ createdAt: -1 }).lean();

		return Response.json({
			contactRequests: requests.map((r) => ({
				id: r._id.toString(),
				type: r.type,
				name: r.name,
				email: r.email,
				company: r.company,
				phone: r.phone,
				subject: r.subject,
				message: r.message,
				service: r.service,
				status: r.status,
				adminNotes: r.adminNotes,
				createdAt: r.createdAt?.toISOString() ?? null,
			})),
		});
	} catch (error) {
		console.error("GET /api/contact-requests error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// POST /api/contact-requests - user must be logged in to submit contact requests
export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized: You must be logged in to submit a contact request." }, { status: 401 });
		}

		await connectDB();
		const body = await request.json();
		const { type, name, email, company, phone, subject, message, service } = body;

		if (!name || !email || !message) {
			return Response.json(
				{ message: "name, email, and message are required" },
				{ status: 400 }
			);
		}

		const contactReq = await ContactRequest.create({
			type: type || "contact",
			name: sanitizeInput(name),
			email: email.trim().toLowerCase(),
			company: company ? sanitizeInput(company) : undefined,
			phone: phone || undefined,
			subject: subject ? sanitizeInput(subject) : undefined,
			message: sanitizeInput(message),
			service: service || undefined,
			status: "new",
		});

		return Response.json(
			{
				message: "Contact request submitted successfully!",
				contactRequest: { id: contactReq._id.toString() },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("POST /api/contact-requests error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
