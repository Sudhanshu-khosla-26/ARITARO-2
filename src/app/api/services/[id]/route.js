import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/session";

// GET /api/services/[id] - fetch a single service (admin, full raw doc)
export async function GET(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}
		await connectDB();
		const { id } = await params;
		const service = await Service.findById(id).lean();
		if (!service) {
			return Response.json({ message: "Service not found" }, { status: 404 });
		}
		return Response.json({
			service: {
				...service,
				id: service._id.toString(),
				_id: service._id.toString(),
				faqs: service.faqs?.map((f) => ({
					question: f.question,
					answer: f.answer,
				})) ?? [],
			},
		});
	} catch (error) {
		console.error("GET /api/services/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// PATCH /api/services/[id] - update any service fields (admin only)
export async function PATCH(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}
		await connectDB();
		const { id } = await params;
		const body = await request.json();

		const allowed = [
			"name",
			"slug",
			"description",
			"shortDescription",
			"duration",
			"icon",
			"overview",
			"methodology",
			"scope",
			"deliverables",
			"standards",
			"sampleFindings",
			"faqs",
			"isPublished",
			"image",
			"pdfUrl",
		];

		const updates = {};
		for (const key of allowed) {
			if (key in body) updates[key] = body[key];
		}

		const service = await Service.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true }
		);

		if (!service) {
			return Response.json({ message: "Service not found" }, { status: 404 });
		}

		return Response.json({ message: "Service updated", service: { id: service._id.toString(), name: service.name } });
	} catch (error) {
		console.error("PATCH /api/services/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// DELETE /api/services/[id] - delete a service (admin only)
export async function DELETE(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}
		await connectDB();
		const { id } = await params;
		const service = await Service.findByIdAndDelete(id);
		if (!service) {
			return Response.json({ message: "Service not found" }, { status: 404 });
		}
		return Response.json({ message: "Service deleted" });
	} catch (error) {
		console.error("DELETE /api/services/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
