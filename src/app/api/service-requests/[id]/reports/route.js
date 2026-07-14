import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { ServiceRequest, Report, AuditLog, User } from "@/models";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Initialize Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const { id } = await params;
		const serviceRequest = await ServiceRequest.findById(id);

		if (!serviceRequest) {
			return Response.json({ message: "Service request not found" }, { status: 444 });
		}

		const dbUser = await User.findById(session.user.id);
		const userRole = dbUser?.role || session.user.role;
		const isAdmin = ["admin", "super_admin", "tester"].includes(userRole);
		const isOwner = (serviceRequest.company_id?._id || serviceRequest.company_id)?.toString() === session.user.id;

		if (!isAdmin && !isOwner) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		// Filter drafts for client accounts
		let reportQuery = { request_id: id };
		if (!isAdmin) {
			reportQuery.status = "released";
		}

		const reports = await Report.find(reportQuery)
			.populate("uploaded_by", "name email")
			.populate("approved_by", "name email")
			.sort({ createdAt: -1 })
			.lean();

		const mapped = reports.map((r) => ({
			id: r._id.toString(),
			request_id: r.request_id.toString(),
			file_url: r.file_url,
			original_filename: r.original_filename || "report.pdf",
			version: r.version,
			status: r.status,
			uploaded_by_name: r.uploaded_by?.name || "",
			approved_by_name: r.approved_by?.name || "",
			admin_notes: r.admin_notes || "",
			createdAt: r.createdAt?.toISOString() ?? null,
		}));

		return Response.json({ success: true, reports: mapped });
	} catch (error) {
		console.error("GET /api/service-requests/[id]/reports error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

export async function POST(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const dbUser = await User.findById(session.user.id);
		const userRole = dbUser?.role || session.user.role;
		const isAdmin = ["admin", "super_admin", "tester"].includes(userRole);
		if (!isAdmin) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;
		const serviceRequest = await ServiceRequest.findById(id);
		if (!serviceRequest) {
			return Response.json({ message: "Service request not found" }, { status: 444 });
		}

		const formData = await request.formData();
		const file = formData.get("file");
		const adminNotes = formData.get("admin_notes") || "";

		if (!file || typeof file === "string") {
			return Response.json({ message: "No file provided" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const hasCloudinary =
			process.env.CLOUDINARY_CLOUD_NAME &&
			process.env.CLOUDINARY_API_KEY &&
			process.env.CLOUDINARY_API_SECRET;

		let fileUrl = "";

		if (!hasCloudinary) {
			console.warn("[Cloudinary Warning] Credentials missing. Saving file locally.");
			const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const sanitizedFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
			const destination = path.join(uploadDir, sanitizedFilename);
			fs.writeFileSync(destination, buffer);
			fileUrl = `/uploads/reports/${sanitizedFilename}`;
		} else {
			const extension = file.name.split(".").pop().toLowerCase();
			const sanitizedBaseName = file.name.split(".")[0].replace(/[^a-zA-Z0-9\-_]/g, "");
			const uploadResult = await new Promise((resolve, reject) => {
				cloudinary.uploader.upload_stream(
					{
						resource_type: extension === "pdf" ? "image" : "raw",
						folder: "aritaro_reports",
						public_id: `${Date.now()}-${sanitizedBaseName}.${extension}`,
					},
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					},
				).end(buffer);
			});
			fileUrl = uploadResult.secure_url;
		}

		// Calculate version count
		const existingCount = await Report.countDocuments({ request_id: id });
		const nextVersion = existingCount + 1;

		const report = await Report.create({
			request_id: id,
			file_url: fileUrl,
			original_filename: file.name,
			version: nextVersion,
			status: "draft",
			uploaded_by: session.user.id,
			admin_notes: adminNotes,
		});

		// Write to Audit Log
		const ip_address = request.headers.get("x-forwarded-for") || "";
		await AuditLog.create({
			actor_id: session.user.id,
			action: "report_uploaded",
			target_type: "Report",
			target_id: report._id,
			metadata: {
				ticket_ref: serviceRequest.ticket_ref,
				version: nextVersion,
				original_filename: file.name,
			},
			ip_address,
		});

		return Response.json({
			success: true,
			message: "Report uploaded successfully as draft",
			report: {
				id: report._id.toString(),
				file_url: report.file_url,
				version: report.version,
				status: report.status,
			},
		});
	} catch (error) {
		console.error("POST /api/service-requests/[id]/reports error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
