import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { ServiceRequest, Report, AuditLog, Notification, User } from "@/models";
import { sendEmail } from "@/lib/email";

export async function PATCH(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const dbUser = await User.findById(session.user.id);
		const userRole = dbUser?.role || session.user.role;
		const isAdmin = ["admin", "super_admin"].includes(userRole);
		if (!isAdmin) {
			return Response.json({ message: "Forbidden" }, { status: 403 });
		}

		const { id, reportId } = await params;
		const serviceRequest = await ServiceRequest.findById(id);
		if (!serviceRequest) {
			return Response.json({ message: "Service request not found" }, { status: 444 });
		}

		const report = await Report.findById(reportId);
		if (!report) {
			return Response.json({ message: "Report not found" }, { status: 444 });
		}

		const body = await request.json();
		const { status, admin_notes } = body;

		const ip_address = request.headers.get("x-forwarded-for") || "";
		const oldStatus = report.status;

		if (status && status !== oldStatus) {
			report.status = status;
			if (status === "approved" || status === "released") {
				report.approved_by = session.user.id;
			}

			// Write Report Audit Log
			await AuditLog.create({
				actor_id: session.user.id,
				action: "report_status_changed",
				target_type: "Report",
				target_id: report._id,
				metadata: {
					ticket_ref: serviceRequest.ticket_ref,
					before: oldStatus,
					after: status,
				},
				ip_address,
			});

			// If status is released, auto-transition the ServiceRequest to report_delivered
			if (status === "released") {
				const oldRequestStatus = serviceRequest.status;
				serviceRequest.status = "report_delivered";
				await serviceRequest.save();

				// Write ServiceRequest Audit Log
				await AuditLog.create({
					actor_id: session.user.id,
					action: "status_changed",
					target_type: "ServiceRequest",
					target_id: serviceRequest._id,
					metadata: {
						ticket_ref: serviceRequest.ticket_ref,
						before: oldRequestStatus,
						after: "report_delivered",
					},
					ip_address,
				});

				// Create notification for company client
				await Notification.create({
					user: serviceRequest.company_id,
					title: `Report Released: ${serviceRequest.ticket_ref}`,
					message: `A new security audit report (v${report.version}) has been released for your review.`,
					type: "report_ready",
					link: `/dashboard/reports`,
					referenceId: serviceRequest._id,
					referenceModel: "ServiceRequest",
				});

				// Send email to company contact
				const clientUser = await User.findById(serviceRequest.company_id);
				if (clientUser && clientUser.email) {
					try {
						await sendEmail({
							to: clientUser.email,
							subject: `[Aritaro] Security Report Released - ${serviceRequest.ticket_ref}`,
							html: `
								<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
									<h2 style="color: #4f46e5; margin-top: 0;">Security Report Released</h2>
									<p>Hello ${clientUser.name},</p>
									<p>A new security assessment report has been completed and released to your aritaro portal.</p>
									<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
										<tr>
											<td style="padding: 8px 0; font-weight: bold; width: 150px;">Ticket Ref:</td>
											<td style="padding: 8px 0;">${serviceRequest.ticket_ref}</td>
										</tr>
										<tr>
											<td style="padding: 8px 0; font-weight: bold;">Service Type:</td>
											<td style="padding: 8px 0;">${serviceRequest.service_type.toUpperCase().replace("_", " ")}</td>
										</tr>
										<tr>
											<td style="padding: 8px 0; font-weight: bold;">Report Version:</td>
											<td style="padding: 8px 0;">v${report.version}</td>
										</tr>
									</table>
									<p>Please log in to your dashboard to download the report and submit any feedback or closure confirmation.</p>
									<a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Access Portal</a>
									<p style="margin-top: 30px; font-size: 12px; color: #64748b;">This is an automated security notification from Aritaro Pvt Limited.</p>
								</div>
							`,
						});
					} catch (emailError) {
						console.error("Nodemailer report release email failed:", emailError);
					}
				}
			}
		}

		if (admin_notes !== undefined) {
			report.admin_notes = admin_notes;
		}

		await report.save();

		return Response.json({
			success: true,
			message: "Report updated successfully",
			report: {
				id: report._id.toString(),
				status: report.status,
				version: report.version,
			},
		});
	} catch (error) {
		console.error("PATCH /api/service-requests/[id]/reports/[reportId] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
