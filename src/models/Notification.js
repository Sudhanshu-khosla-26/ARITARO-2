import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		message: { type: String, required: true },
		type: {
			type: String,
			enum: ["status_change", "report_ready", "sla_breach", "message", "info", "success", "warning", "error", "update"],
			default: "info",
		},
		isRead: { type: Boolean, default: false },
		link: { type: String },
		referenceId: { type: Schema.Types.ObjectId, refPath: "referenceModel" },
		referenceModel: {
			type: String,
			enum: ["QuoteRequest", "ContactRequest", "ServiceRequest"],
		},
	},
	{ timestamps: true },
);

NotificationSchema.index({ user: 1, isRead: 1 });

const Notification =
	mongoose.models.Notification ||
	mongoose.model("Notification", NotificationSchema);

export default Notification;
