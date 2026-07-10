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
	},
	{ timestamps: true },
);

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
