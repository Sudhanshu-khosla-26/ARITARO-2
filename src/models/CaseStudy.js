import mongoose, { Schema } from "mongoose";

const CaseStudySchema = new Schema(
	{
		industry: { type: String, required: true, trim: true },
		type: { type: String, required: true, trim: true },
		challenge: { type: String, required: true },
		findings: [{ type: String }],
		impact: { type: String, required: true },
		stats: {
			vulns: { type: String },
			critical: { type: String },
			remediation: { type: String },
		},
		color: { type: String, default: "#3B82F6" },
		isPublished: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const CaseStudy =
	mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);

export default CaseStudy;
