import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { ServiceRequest, AuditLog, Notification, User } from "@/models";

// Valid workflow transitions helper
const isValidTransition = (from, to) => {
	const transitions = {
		submitted: ["under_review", "cancelled"],
		under_review: ["scoped", "cancelled", "on_hold"],
		scoped: ["quoted", "assigned", "on_hold", "cancelled"],
		quoted: ["assigned", "on_hold", "cancelled"],
		assigned: ["in_progress", "on_hold", "cancelled"],
		in_progress: ["internal_qa", "on_hold", "cancelled"],
		internal_qa: ["report_delivered", "in_progress", "on_hold"],
		report_delivered: ["client_review", "closed"],
		client_review: ["closed", "in_progress"],
		closed: [],
		on_hold: ["under_review", "scoped", "quoted", "assigned", "in_progress", "cancelled"],
		cancelled: [],
		escalated: ["under_review", "scoped", "quoted", "assigned", "in_progress", "internal_qa", "report_delivered"],
	};

	// Allow admins to override/reset if they need to, but validate basic workflow sequence
	return (transitions[from] || []).includes(to);
};

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const { id } = await params;
		const serviceRequest = await ServiceRequest.findById(id)
			.populate("company_id", "name email company company_name industry")
			.populate("assigned_admin_id", "name email")
			.lean();

		if (!serviceRequest) {
			return Response.json({ message: "Service request not found" }, { status: 444 });
		}

		const dbUser = await User.findById(session.user.id);
		const userRole = dbUser?.role || session.user.role;
		const isAdmin = ["admin", "super_admin", "tester"].includes(userRole);
		if (!isAdmin && serviceRequest.company_id?._id?.toString() !== session.user.id) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		const mapped = {
			id: serviceRequest._id.toString(),
			ticket_ref: serviceRequest.ticket_ref,
			company_id: serviceRequest.company_id?._id?.toString(),
			company_name: serviceRequest.company_id?.company_name || serviceRequest.company_id?.company || serviceRequest.company_id?.name || "",
			company_email: serviceRequest.company_id?.email || "",
			service_type: serviceRequest.service_type,
			engagement_type: serviceRequest.engagement_type,
			scope_description: serviceRequest.scope_description,
			target_environment: serviceRequest.target_environment,
			status: serviceRequest.status,
			priority: serviceRequest.priority,
			assigned_admin_id: serviceRequest.assigned_admin_id?._id?.toString(),
			assigned_admin_name: serviceRequest.assigned_admin_id?.name || "",
			business_justification: serviceRequest.business_justification || "",
			desired_start_date: serviceRequest.desired_start_date?.toISOString() ?? null,
			deadline: serviceRequest.deadline?.toISOString() ?? null,
			contact_name: serviceRequest.contact_name || "",
			contact_email: serviceRequest.contact_email || "",
			contact_phone: serviceRequest.contact_phone || "",
			authorization_confirmed: serviceRequest.authorization_confirmed,
			sla_due_at: serviceRequest.sla_due_at?.toISOString() ?? null,
			createdAt: serviceRequest.createdAt?.toISOString() ?? null,
			updatedAt: serviceRequest.updatedAt?.toISOString() ?? null,
		};

		return Response.json({ success: true, request: mapped });
	} catch (error) {
		console.error("GET /api/service-requests/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

export async function PATCH(request, { params }) {
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

		const body = await request.json();
		const oldStatus = serviceRequest.status;
		const { status, priority, assigned_admin_id, scope_description, target_environment, business_justification } = body;

		const ip_address = request.headers.get("x-forwarded-for") || "";

		// Enforce transition controls if status changes
		if (status && status !== oldStatus) {
			// Clients can only advance to client_review or closed
			if (!isAdmin) {
				if (!["client_review", "closed"].includes(status)) {
					return Response.json({ message: "Forbidden transition for client" }, { status: 403 });
				}
				if (!isValidTransition(oldStatus, status)) {
					return Response.json({ message: `Invalid status transition from ${oldStatus} to ${status}` }, { status: 400 });
				}
			} else {
				// Admin transitions
				if (!isValidTransition(oldStatus, status)) {
					// Soft warning, allow it for super_admins or override but log it
					console.warn(`Admin forcing transition from ${oldStatus} to ${status}`);
				}
			}

			serviceRequest.status = status;

			// Write to Audit Log
			await AuditLog.create({
				actor_id: session.user.id,
				action: "status_changed",
				target_type: "ServiceRequest",
				target_id: serviceRequest._id,
				metadata: {
					ticket_ref: serviceRequest.ticket_ref,
					before: oldStatus,
					after: status,
				},
				ip_address,
			});

			// Notify company user on status update
			await Notification.create({
				user: serviceRequest.company_id,
				title: `Status Update: ${serviceRequest.ticket_ref}`,
				message: `Your request status has changed from ${oldStatus.toUpperCase().replace("_", " ")} to ${status.toUpperCase().replace("_", " ")}.`,
				type: "status_change",
				link: `/dashboard/services`,
				referenceId: serviceRequest._id,
				referenceModel: "ServiceRequest",
			});
		}

		// Update other fields (admin only)
		if (isAdmin) {
			if (priority) serviceRequest.priority = priority;
			if (assigned_admin_id) serviceRequest.assigned_admin_id = assigned_admin_id;
			if (scope_description) serviceRequest.scope_description = scope_description;
			if (target_environment) serviceRequest.target_environment = target_environment;
			if (business_justification) serviceRequest.business_justification = business_justification;
		}

		await serviceRequest.save();

		return Response.json({
			success: true,
			message: "Service request updated successfully",
			request: {
				id: serviceRequest._id.toString(),
				ticket_ref: serviceRequest.ticket_ref,
				status: serviceRequest.status,
				priority: serviceRequest.priority,
			},
		});
	} catch (error) {
		console.error("PATCH /api/service-requests/[id] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
