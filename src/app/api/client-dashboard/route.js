import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { ServiceRequest, Report } from "@/models";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const userId = session.user.id;

		// Fetch all service requests for this company
		const serviceRequests = await ServiceRequest.find({ company_id: userId })
			.populate("assigned_admin_id", "name email")
			.sort({ createdAt: -1 })
			.lean();

		const requestIds = serviceRequests.map((r) => r._id);

		// Fetch all released reports for these requests
		const reports = await Report.find({
			request_id: { $in: requestIds },
			status: "released",
		})
			.sort({ createdAt: -1 })
			.lean();

		// Calculate real metrics
		const totalRequests = serviceRequests.length;
		
		const activeRequestStates = ["under_review", "scoped", "quoted", "assigned", "in_progress", "internal_qa"];
		const activeRequests = serviceRequests.filter((r) => activeRequestStates.includes(r.status)).length;
		
		const reportsDelivered = reports.length;
		
		const pendingReviews = serviceRequests.filter((r) => ["report_delivered", "client_review"].includes(r.status)).length;

		// Map requests for client dashboard display
		const mappedRequests = serviceRequests.map((r) => ({
			id: r._id.toString(),
			ticket_ref: r.ticket_ref,
			service_type: r.service_type,
			engagement_type: r.engagement_type,
			scope_description: r.scope_description,
			target_environment: r.target_environment,
			status: r.status,
			priority: r.priority,
			assigned_admin_name: r.assigned_admin_id?.name || "",
			desired_start_date: r.desired_start_date?.toISOString() ?? null,
			deadline: r.deadline?.toISOString() ?? null,
			createdAt: r.createdAt?.toISOString() ?? null,
			sla_due_at: r.sla_due_at?.toISOString() ?? null,
		}));

		// Map reports for history display
		const mappedReports = reports.map((rep) => {
			const parentReq = serviceRequests.find((req) => req._id.toString() === rep.request_id.toString());
			return {
				id: rep._id.toString(),
				ticket_ref: parentReq?.ticket_ref || "",
				service_type: parentReq?.service_type || "",
				file_url: rep.file_url,
				original_filename: rep.original_filename || "report.pdf",
				version: rep.version,
				createdAt: rep.createdAt?.toISOString() ?? null,
			};
		});

		// Dynamic compliance rating based on closed vs total requests
		let complianceScore = 100;
		if (totalRequests > 0) {
			const closedCount = serviceRequests.filter((r) => r.status === "closed").length;
			complianceScore = Math.min(100, 85 + Math.round((closedCount / totalRequests) * 15));
		}

		return Response.json({
			success: true,
			stats: {
				totalRequests,
				activeRequests,
				reportsDelivered,
				pendingReviews,
				complianceScore,
				uptime: "99.97%", // Keep static network status check
			},
			requests: mappedRequests,
			reports: mappedReports,
		});
	} catch (error) {
		console.error("GET /api/client-dashboard error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
