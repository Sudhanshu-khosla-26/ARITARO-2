"use server";

import User from "@/models/User";
import ContactRequest from "@/models/ContactRequest";
import ServiceRequest from "@/models/ServiceRequest";
import Report from "@/models/Report";
import AuditLog from "@/models/AuditLog";
import CaseStudy from "@/models/CaseStudy";
import JobOpportunity from "@/models/JobOpportunity";
import { requireAdmin } from "@/lib/session";
import { initApp } from "@/lib/init";
import { sanitizeInput } from "@/lib/security";

const dbUnavailable = {
	success: false,
	error: "Service temporarily unavailable. Please try again later.",
};

export async function getAdminStats() {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const [adminCount, clientCount, contactCount, requestCount] = await Promise.all([
		User.countDocuments({ role: "admin" }),
		User.countDocuments({ role: { $in: ["company", "client"] } }),
		ContactRequest.countDocuments(),
		ServiceRequest.countDocuments(),
	]);

	return {
		success: true,
		stats: { adminCount, clientCount, contactCount, requestCount },
	};
}

export async function listAdmins() {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const admins = await User.find({ role: "admin" })
		.select("name email isVerified isSuspended createdAt lastLogin")
		.sort({ createdAt: 1 })
		.lean();

	return {
		success: true,
		admins: admins.map((admin) => ({
			id: admin._id.toString(),
			name: admin.name,
			email: admin.email,
			isVerified: admin.isVerified,
			isSuspended: admin.isSuspended,
			createdAt: admin.createdAt?.toISOString() ?? null,
			lastLogin: admin.lastLogin?.toISOString() ?? null,
		})),
	};
}

export async function createAdmin(formData) {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	const name = sanitizeInput(String(formData.get("name") || "").trim());
	const email = String(formData.get("email") || "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") || "");

	if (!name || !email || !password) {
		return { success: false, error: "All fields are required" };
	}

	if (password.length < 8) {
		return {
			success: false,
			error: "Password must be at least 8 characters",
		};
	}

	if (!(await initApp())) return dbUnavailable;

	const existing = await User.findOne({ email });
	if (existing) {
		if (existing.role === "admin") {
			return { success: false, error: "This user is already an admin" };
		}
		existing.role = "admin";
		existing.isVerified = true;
		if (name) existing.name = name;
		if (password) existing.password = password;
		await existing.save();
		return {
			success: true,
			message: `${existing.email} has been promoted to admin`,
		};
	}

	const created = await User.create({
		name,
		email,
		password,
		role: "admin",
		isVerified: true,
	});

	return {
		success: true,
		message: `Admin account created for ${email}`,
		admin: {
			id: created._id.toString(),
			name: created.name,
			email: created.email,
			isVerified: created.isVerified,
			isSuspended: created.isSuspended,
			createdAt: created.createdAt?.toISOString() ?? null,
			lastLogin: created.lastLogin?.toISOString() ?? null,
		},
	};
}

export async function removeAdmin(adminId) {
	const { authorized, session } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!adminId) {
		return { success: false, error: "Admin ID is required" };
	}

	if (adminId === session.user.id) {
		return { success: false, error: "You cannot remove your own admin access" };
	}

	if (!(await initApp())) return dbUnavailable;

	const adminCount = await User.countDocuments({ role: "admin" });
	if (adminCount <= 1) {
		return {
			success: false,
			error: "Cannot remove the last admin account",
		};
	}

	const user = await User.findOne({ _id: adminId, role: "admin" });
	if (!user) {
		return { success: false, error: "Admin not found" };
	}

	user.role = "company"; // Reset to standard company role
	await user.save();

	return {
		success: true,
		message: `${user.email} has been removed from admin access`,
	};
}

export async function listClients() {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const clients = await User.find({ role: { $in: ["company", "client"] } })
		.select("name email company company_name industry isVerified isSuspended createdAt lastLogin")
		.sort({ createdAt: 1 })
		.lean();

	return {
		success: true,
		clients: clients.map((client) => ({
			id: client._id.toString(),
			name: client.name,
			email: client.email,
			company: client.company_name || client.company || "Not set",
			industry: client.industry || "Not set",
			isVerified: client.isVerified,
			isSuspended: client.isSuspended,
			createdAt: client.createdAt?.toISOString() ?? null,
			lastLogin: client.lastLogin?.toISOString() ?? null,
		})),
	};
}

export async function createClient(formData) {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	const name = sanitizeInput(String(formData.get("name") || "").trim());
	const email = String(formData.get("email") || "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") || "");
	const company = sanitizeInput(String(formData.get("company") || "").trim());
	const industry = sanitizeInput(String(formData.get("industry") || "").trim());

	if (!name || !email || !password) {
		return { success: false, error: "All fields are required" };
	}

	if (password.length < 8) {
		return {
			success: false,
			error: "Password must be at least 8 characters",
		};
	}

	if (!(await initApp())) return dbUnavailable;

	const existing = await User.findOne({ email });
	if (existing) {
		if (existing.role === "company") {
			return { success: false, error: "This user is already a client company" };
		}
		existing.role = "company";
		if (name) existing.name = name;
		if (password) existing.password = password;
		if (company) {
			existing.company = company;
			existing.company_name = company;
		}
		if (industry) existing.industry = industry;
		await existing.save();
		return {
			success: true,
			message: `${existing.email} has been promoted/demoted to company`,
		};
	}

	await User.create({
		name,
		email,
		password,
		role: "company",
		company: company || name,
		company_name: company || name,
		industry,
		isVerified: true,
	});

	return {
		success: true,
		message: `Client account created for ${email}`,
	};
}

export async function removeClient(clientId) {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!clientId) {
		return { success: false, error: "Client ID is required" };
	}

	if (!(await initApp())) return dbUnavailable;

	const client = await User.findOne({ _id: clientId, role: { $in: ["company", "client"] } });
	if (!client) {
		return { success: false, error: "Client not found" };
	}

	await User.findByIdAndDelete(clientId);

	return {
		success: true,
		message: `${client.email} has been deleted successfully`,
	};
}

export async function getCompanyDetail(companyId) {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const client = await User.findById(companyId)
		.select("name email company company_name industry phone isVerified isSuspended createdAt lastLogin")
		.lean();

	if (!client) {
		return { success: false, error: "Company not found" };
	}

	const [requests, reports, logs] = await Promise.all([
		ServiceRequest.find({ company_id: companyId }).sort({ createdAt: -1 }).lean(),
		Report.find({ request_id: { $in: await ServiceRequest.find({ company_id: companyId }).distinct("_id") } })
			.populate("uploaded_by", "name email")
			.populate("approved_by", "name email")
			.sort({ createdAt: -1 })
			.lean(),
		AuditLog.find({ actor_id: companyId }).sort({ createdAt: -1 }).limit(50).lean(),
	]);

	return {
		success: true,
		company: {
			id: client._id.toString(),
			name: client.name,
			email: client.email,
			company_name: client.company_name || client.company || "Not set",
			industry: client.industry || "Not set",
			phone: client.phone || "",
			isVerified: client.isVerified,
			isSuspended: client.isSuspended,
			createdAt: client.createdAt?.toISOString() ?? null,
			lastLogin: client.lastLogin?.toISOString() ?? null,
		},
		requests: requests.map((r) => ({
			id: r._id.toString(),
			ticket_ref: r.ticket_ref,
			service_type: r.service_type,
			engagement_type: r.engagement_type,
			status: r.status,
			priority: r.priority,
			createdAt: r.createdAt?.toISOString() ?? null,
		})),
		reports: reports.map((rep) => ({
			id: rep._id.toString(),
			request_id: rep.request_id.toString(),
			file_url: rep.file_url,
			original_filename: rep.original_filename || "report.pdf",
			version: rep.version,
			status: rep.status,
			uploaded_by_name: rep.uploaded_by?.name || "",
			createdAt: rep.createdAt?.toISOString() ?? null,
		})),
		logs: logs.map((l) => ({
			id: l._id.toString(),
			action: l.action,
			target_type: l.target_type || "",
			metadata: l.metadata || {},
			createdAt: l.createdAt?.toISOString() ?? null,
		})),
	};
}

export async function listCaseStudies() {
	if (!(await initApp())) return { success: false, error: "Database not connected" };
	const cases = await CaseStudy.find({}).sort({ createdAt: -1 }).lean();
	return {
		success: true,
		cases: cases.map((c) => ({
			id: c._id.toString(),
			industry: c.industry,
			type: c.type,
			challenge: c.challenge,
			findings: c.findings || [],
			impact: c.impact,
			stats: c.stats || {},
			color: c.color || "#3B82F6",
			isPublished: c.isPublished,
		})),
	};
}

export async function createCaseStudy(formData) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	const industry = sanitizeInput(String(formData.get("industry") || "").trim());
	const type = sanitizeInput(String(formData.get("type") || "").trim());
	const challenge = sanitizeInput(String(formData.get("challenge") || "").trim());
	const findingsRaw = String(formData.get("findings") || "").trim();
	const findings = findingsRaw ? findingsRaw.split("\n").map(f => f.trim()).filter(Boolean) : [];
	const impact = sanitizeInput(String(formData.get("impact") || "").trim());
	const vulns = sanitizeInput(String(formData.get("vulns") || "").trim());
	const critical = sanitizeInput(String(formData.get("critical") || "").trim());
	const remediation = sanitizeInput(String(formData.get("remediation") || "").trim());
	const color = sanitizeInput(String(formData.get("color") || "#3B82F6").trim());

	if (!industry || !type || !challenge || !impact) {
		return { success: false, error: "Required fields are missing" };
	}

	const created = await CaseStudy.create({
		industry,
		type,
		challenge,
		findings,
		impact,
		stats: { vulns, critical, remediation },
		color,
		isPublished: true,
	});

	return { success: true, message: "Case study created successfully", id: created._id.toString() };
}

export async function removeCaseStudy(caseStudyId) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	await CaseStudy.findByIdAndDelete(caseStudyId);
	return { success: true, message: "Case study deleted successfully" };
}

export async function togglePublishCaseStudy(caseStudyId, isPublished) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	await CaseStudy.findByIdAndUpdate(caseStudyId, { isPublished });
	return { success: true, message: "Publication state updated" };
}

export async function listJobOpportunities() {
	if (!(await initApp())) return { success: false, error: "Database not connected" };
	const jobs = await JobOpportunity.find({}).sort({ createdAt: -1 }).lean();
	return {
		success: true,
		jobs: jobs.map((j) => ({
			id: j._id.toString(),
			title: j.title,
			department: j.department,
			location: j.location,
			type: j.type,
			isPublished: j.isPublished,
		})),
	};
}

export async function createJobOpportunity(formData) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	const title = sanitizeInput(String(formData.get("title") || "").trim());
	const department = sanitizeInput(String(formData.get("department") || "").trim());
	const location = sanitizeInput(String(formData.get("location") || "").trim());
	const type = sanitizeInput(String(formData.get("type") || "Full-Time").trim());

	if (!title || !department || !location) {
		return { success: false, error: "Required fields are missing" };
	}

	const created = await JobOpportunity.create({
		title,
		department,
		location,
		type,
		isPublished: true,
	});

	return { success: true, message: "Job opportunity created successfully", id: created._id.toString() };
}

export async function removeJobOpportunity(jobId) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	await JobOpportunity.findByIdAndDelete(jobId);
	return { success: true, message: "Job opportunity deleted successfully" };
}

export async function togglePublishJobOpportunity(jobId, isPublished) {
	const { authorized } = await requireAdmin();
	if (!authorized) return { success: false, error: "Unauthorized" };
	if (!(await initApp())) return dbUnavailable;

	await JobOpportunity.findByIdAndUpdate(jobId, { isPublished });
	return { success: true, message: "Publication state updated" };
}
