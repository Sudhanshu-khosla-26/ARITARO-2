import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
	{
		request_id: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
		file_url: { type: String, required: true },
		original_filename: { type: String },
		version: { type: Number, default: 1 },
		status: {
			type: String,
			enum: ["draft", "internal_review", "approved", "released"],
			default: "draft",
		},
		uploaded_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
		approved_by: { type: Schema.Types.ObjectId, ref: "User" },
		admin_notes: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

reportSchema.index({ request_id: 1, status: 1 });
reportSchema.index({ uploaded_by: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ deletedAt: 1, createdAt: -1 });

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
