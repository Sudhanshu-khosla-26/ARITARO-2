import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
	{
		actor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
		action: { type: String, required: true }, // e.g. "status_changed", "report_uploaded"
		target_type: { type: String }, // e.g. "ServiceRequest", "Report"
		target_id: { type: Schema.Types.ObjectId },
		metadata: { type: Schema.Types.Mixed }, // JSON storage for before/after states
		ip_address: { type: String },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }, // Append-only, no update timestamps
);

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
