import mongoose, { Schema } from "mongoose";

const serviceRequestSchema = new Schema(
	{
		ticket_ref: { type: String, unique: true },
		company_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		service_type: {
			type: String,
			enum: ["api_pt", "wap_pt", "cloud_security", "ai_pt"],
			required: true,
		},
		engagement_type: {
			type: String,
			enum: ["black_box", "grey_box", "white_box"],
			required: true,
		},
		scope_description: { type: String, required: true },
		target_environment: { type: String, required: true },
		status: {
			type: String,
			enum: [
				"submitted",
				"under_review",
				"scoped",
				"quoted",
				"assigned",
				"in_progress",
				"internal_qa",
				"report_delivered",
				"client_review",
				"closed",
				"on_hold",
				"escalated",
				"cancelled",
			],
			default: "submitted",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "critical"],
			default: "medium",
		},
		assigned_admin_id: { type: Schema.Types.ObjectId, ref: "User" },
		business_justification: { type: String },
		desired_start_date: { type: Date },
		deadline: { type: Date },
		contact_name: { type: String },
		contact_email: { type: String },
		contact_phone: { type: String },
		authorization_confirmed: { type: Boolean, default: false },
		sla_due_at: { type: Date },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

serviceRequestSchema.pre("save", async function () {
	if (!this.ticket_ref) {
		const year = new Date().getFullYear();
		try {
			const count = await this.constructor.countDocuments();
			const seq = String(count + 1).padStart(4, "0");
			this.ticket_ref = `ARI-${year}-${seq}`;
		} catch (err) {
			const rand = Math.floor(1000 + Math.random() * 9000);
			this.ticket_ref = `ARI-${year}-${rand}`;
		}
	}
});

serviceRequestSchema.index({ company_id: 1, createdAt: -1 });
serviceRequestSchema.index({ company_id: 1, status: 1 });
serviceRequestSchema.index({ assigned_admin_id: 1, status: 1 });
serviceRequestSchema.index({ status: 1, sla_due_at: 1 });
serviceRequestSchema.index({ deletedAt: 1, createdAt: -1 });

const ServiceRequest =
	mongoose.models.ServiceRequest ||
	mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
