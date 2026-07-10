"use server";

import connectDB from "@/lib/db";
import ContactRequest from "@/models/ContactRequest";
import ServiceRequest from "@/models/ServiceRequest";
import Notification from "@/models/Notification";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { sanitizeInput } from "@/lib/security";
import { initApp } from "@/lib/init";
import { getSession } from "@/lib/session";
import { z } from "zod";

const contactSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	company: z.string().optional(),
	phone: z.string().optional(),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(1, "Message is required"),
});

const serviceRequestInputSchema = z.object({
	service_type: z.enum(["api_pt", "wap_pt", "cloud_security", "ai_pt"]),
	engagement_type: z.enum(["black_box", "grey_box", "white_box"]),
	scope_description: z.string().min(1, "Scope description is required"),
	target_environment: z.string().min(1, "Target environment is required"),
	business_justification: z.string().optional(),
	desired_start_date: z.string().optional(),
	deadline: z.string().optional(),
	contact_name: z.string().min(1, "Contact name is required"),
	contact_email: z.string().email("Invalid contact email address"),
	contact_phone: z.string().optional(),
	authorization_confirmed: z.boolean().or(z.string().transform((v) => v === "true")),
});

const dbUnavailable = {
	success: false,
	error: "Service temporarily unavailable. Please try again later.",
};

export async function submitContact(formData) {
	const session = await getSession();
	if (!session || !session.user) {
		return { success: false, error: "You must be logged in to submit a contact request." };
	}

	const raw = {
		name: formData.get("name"),
		email: formData.get("email"),
		company: formData.get("company") || undefined,
		phone: formData.get("phone") || undefined,
		subject: formData.get("subject"),
		message: formData.get("message"),
	};

	const parsed = contactSchema.safeParse(raw);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message };
	}

	if (!(await initApp())) return dbUnavailable;

	await ContactRequest.create({
		type: "contact",
		name: sanitizeInput(parsed.data.name),
		email: parsed.data.email,
		company: parsed.data.company ? sanitizeInput(parsed.data.company) : undefined,
		phone: parsed.data.phone,
		subject: sanitizeInput(parsed.data.subject),
		message: sanitizeInput(parsed.data.message),
	});

	return { success: true, message: "Message sent! We'll respond within 24 hours." };
}

export async function submitServiceRequest(formData) {
	const session = await getSession();
	if (!session || !session.user) {
		return { success: false, error: "You must be logged in to submit a request." };
	}

	const raw = {
		service_type: formData.get("service_type"),
		engagement_type: formData.get("engagement_type"),
		scope_description: formData.get("scope_description"),
		target_environment: formData.get("target_environment"),
		business_justification: formData.get("business_justification") || undefined,
		desired_start_date: formData.get("desired_start_date") || undefined,
		deadline: formData.get("deadline") || undefined,
		contact_name: formData.get("contact_name"),
		contact_email: formData.get("contact_email"),
		contact_phone: formData.get("contact_phone") || undefined,
		authorization_confirmed: formData.get("authorization_confirmed") === "true" || formData.get("authorization_confirmed") === true,
	};

	const parsed = serviceRequestInputSchema.safeParse(raw);
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0]?.message };
	}

	if (!(await initApp())) return dbUnavailable;

	try {
		// Calculate SLA due date (24 business hours)
		const sla_due_at = new Date();
		sla_due_at.setDate(sla_due_at.getDate() + 1);

		const serviceRequest = await ServiceRequest.create({
			company_id: session.user.id,
			service_type: parsed.data.service_type,
			engagement_type: parsed.data.engagement_type,
			scope_description: sanitizeInput(parsed.data.scope_description),
			target_environment: sanitizeInput(parsed.data.target_environment),
			business_justification: parsed.data.business_justification ? sanitizeInput(parsed.data.business_justification) : undefined,
			desired_start_date: parsed.data.desired_start_date ? new Date(parsed.data.desired_start_date) : undefined,
			deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
			contact_name: sanitizeInput(parsed.data.contact_name),
			contact_email: parsed.data.contact_email,
			contact_phone: parsed.data.contact_phone,
			authorization_confirmed: parsed.data.authorization_confirmed,
			sla_due_at,
		});

		// Write Audit Log
		await AuditLog.create({
			actor_id: session.user.id,
			action: "service_request_submitted",
			target_type: "ServiceRequest",
			target_id: serviceRequest._id,
			metadata: {
				ticket_ref: serviceRequest.ticket_ref,
				service_type: parsed.data.service_type,
				engagement_type: parsed.data.engagement_type,
			},
		});

		// Notify Admins
		const admins = await User.find({ role: { $in: ["admin", "super_admin"] } });
		for (const admin of admins) {
			await Notification.create({
				user: admin._id,
				title: `New Service Request: ${serviceRequest.ticket_ref}`,
				message: `A new ${parsed.data.service_type.toUpperCase()} request has been submitted by ${session.user.name}.`,
				type: "status_change",
				link: `/admin/dashboard`,
				referenceId: serviceRequest._id,
				referenceModel: "ServiceRequest",
			});
		}

		// Also create a contact request mirroring it for legacy trackers
		await ContactRequest.create({
			type: "audit",
			name: sanitizeInput(parsed.data.contact_name),
			email: parsed.data.contact_email,
			company: session.user.company || session.user.name,
			phone: parsed.data.contact_phone,
			subject: `Service Request: ${serviceRequest.ticket_ref}`,
			message: `Environment: ${parsed.data.target_environment}. Scope: ${parsed.data.scope_description}`,
		});

		return {
			success: true,
			message: "Service request submitted successfully!",
			ticket_ref: serviceRequest.ticket_ref,
		};
	} catch (err) {
		console.error("Error creating service request:", err);
		return {
			success: false,
			error: err.message || "Failed to submit request to database.",
		};
	}
}

export async function createNotification(userId, title, message, type, link) {
	const conn = await connectDB();
	if (!conn) return;
	await Notification.create({ user: userId, title, message, type, link });
}

export async function broadcastNotification(title, message, type) {
	await initApp();
	const clients = await User.find({ role: { $in: ["company", "client"] }, isSuspended: false });
	await Notification.insertMany(
		clients.map((u) => ({ user: u._id, title, message, type })),
	);
	return { success: true, count: clients.length };
}