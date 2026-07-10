import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { AuditLog } from "@/models";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		const isAdmin = ["admin", "super_admin"].includes(session.user.role);
		if (!isAdmin) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		await connectDB();

		const logs = await AuditLog.find()
			.populate("actor_id", "name email role company_name")
			.sort({ createdAt: -1 })
			.limit(200)
			.lean();

		const mapped = logs.map((l) => ({
			id: l._id.toString(),
			actor_name: l.actor_id?.name || "System",
			actor_email: l.actor_id?.email || "",
			actor_role: l.actor_id?.role || "",
			actor_company: l.actor_id?.company_name || "",
			action: l.action,
			target_type: l.target_type || "",
			target_id: l.target_id?.toString() || "",
			metadata: l.metadata || {},
			ip_address: l.ip_address || "",
			createdAt: l.createdAt?.toISOString() ?? null,
		}));

		return Response.json({ success: true, logs: mapped });
	} catch (error) {
		console.error("GET /api/audit-logs error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
