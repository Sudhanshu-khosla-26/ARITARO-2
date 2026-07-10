import connectDB from "@/lib/db";
import ContactRequest from "@/models/ContactRequest";
import { requireAdmin } from "@/lib/session";
import { sanitizeInput } from "@/lib/security";

// PATCH /api/contact-requests/[id] - update status and/or admin notes (admin only)
export async function PATCH(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const { id } = await params;
		const body = await request.json();

		const contactReq = await ContactRequest.findById(id);
		if (!contactReq) {
			return Response.json({ message: "Contact request not found" }, { status: 404 });
		}

		if (body.status !== undefined) {
			contactReq.status = body.status;
		}

		if (body.adminNotes !== undefined) {
			contactReq.adminNotes = sanitizeInput(body.adminNotes);
		}

		await contactReq.save();
		return Response.json({ message: "Contact request updated successfully" });
	} catch (error) {
		console.error("PATCH /api/contact-requests/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// DELETE /api/contact-requests/[id] - delete a contact request (admin only)
export async function DELETE(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const { id } = await params;

		const contactReq = await ContactRequest.findByIdAndDelete(id);
		if (!contactReq) {
			return Response.json({ message: "Contact request not found" }, { status: 404 });
		}

		return Response.json({ message: "Contact request deleted successfully" });
	} catch (error) {
		console.error("DELETE /api/contact-requests/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
