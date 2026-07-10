import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { ServiceRequest, AuditLog, Notification, User } from "@/models";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const { searchParams } = new URL(request.url);
		const companyIdParam = searchParams.get("company_id");

		let query = {};

		const dbUser = await User.findById(session.user.id);
		const userRole = dbUser?.role || session.user.role;
		const isAdmin = ["admin", "super_admin", "tester"].includes(userRole);

		if (isAdmin) {
			if (companyIdParam) {
				query.company_id = companyIdParam;
			}
		} else {
			// Regular companies can only view their own
			query.company_id = session.user.id;
		}

		const requests = await ServiceRequest.find(query)
			.populate("company_id", "name email company company_name industry")
			.populate("assigned_admin_id", "name email")
			.sort({ createdAt: -1 })
			.lean();

		const mapped = requests.map((r) => ({
			id: r._id.toString(),
			ticket_ref: r.ticket_ref,
			company_id: r.company_id?._id?.toString(),
			company_name: r.company_id?.company_name || r.company_id?.company || r.company_id?.name || "",
			company_email: r.company_id?.email || "",
			service_type: r.service_type,
			engagement_type: r.engagement_type,
			scope_description: r.scope_description,
			target_environment: r.target_environment,
			status: r.status,
			priority: r.priority,
			assigned_admin_id: r.assigned_admin_id?._id?.toString(),
			assigned_admin_name: r.assigned_admin_id?.name || "",
			business_justification: r.business_justification || "",
			desired_start_date: r.desired_start_date?.toISOString() ?? null,
			deadline: r.deadline?.toISOString() ?? null,
			contact_name: r.contact_name || "",
			contact_email: r.contact_email || "",
			contact_phone: r.contact_phone || "",
			authorization_confirmed: r.authorization_confirmed,
			sla_due_at: r.sla_due_at?.toISOString() ?? null,
			createdAt: r.createdAt?.toISOString() ?? null,
			updatedAt: r.updatedAt?.toISOString() ?? null,
		}));

		return Response.json({ success: true, requests: mapped });
	} catch (error) {
		console.error("GET /api/service-requests error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			service_type,
			engagement_type,
			scope_description,
			target_environment,
			business_justification,
			desired_start_date,
			deadline,
			contact_name,
			contact_email,
			contact_phone,
			authorization_confirmed,
		} = body;

		if (!service_type || !engagement_type || !scope_description || !target_environment) {
			return Response.json({ message: "Missing required fields" }, { status: 400 });
		}

		if (!authorization_confirmed) {
			return Response.json({ message: "Authorization confirmation is required" }, { status: 400 });
		}

		await connectDB();

		const company_id = session.user.id;

		// Calculate SLA due date (e.g. 24 business hours = 1 day for initial review)
		const sla_due_at = new Date();
		sla_due_at.setDate(sla_due_at.getDate() + 1);

		const serviceRequest = await ServiceRequest.create({
			company_id,
			service_type,
			engagement_type,
			scope_description,
			target_environment,
			business_justification,
			desired_start_date: desired_start_date ? new Date(desired_start_date) : undefined,
			deadline: deadline ? new Date(deadline) : undefined,
			contact_name,
			contact_email,
			contact_phone,
			authorization_confirmed,
			sla_due_at,
		});

		// Create Audit Log
		const ip_address = request.headers.get("x-forwarded-for") || "";
		await AuditLog.create({
			actor_id: company_id,
			action: "service_request_submitted",
			target_type: "ServiceRequest",
			target_id: serviceRequest._id,
			metadata: {
				ticket_ref: serviceRequest.ticket_ref,
				service_type,
				engagement_type,
			},
			ip_address,
		});

		// Notify Admins
		const admins = await User.find({ role: { $in: ["admin", "super_admin"] } });
		for (const admin of admins) {
			await Notification.create({
				user: admin._id,
				title: `New Service Request: ${serviceRequest.ticket_ref}`,
				message: `A new ${service_type.toUpperCase()} request has been submitted by ${session.user.name}.`,
				type: "status_change",
				link: `/admin/dashboard`,
				referenceId: serviceRequest._id,
				referenceModel: "ServiceRequest",
			});
		}

		return Response.json({
			success: true,
			message: "Service request submitted successfully",
			request: {
				id: serviceRequest._id.toString(),
				ticket_ref: serviceRequest.ticket_ref,
				status: serviceRequest.status,
			},
		});
	} catch (error) {
		console.error("POST /api/service-requests error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
