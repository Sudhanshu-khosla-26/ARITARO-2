import mongoose, { Schema } from "mongoose";

const JobOpportunitySchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, lowercase: true, trim: true },
		department: { type: String, required: true, trim: true },
		location: { type: String, required: true, trim: true },
		type: { type: String, default: "Full-Time" },
		description: { type: String },
		requirements: [{ type: String }],
		experience: { type: String },
		isPublished: { type: Boolean, default: true },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

JobOpportunitySchema.index({ isPublished: 1, createdAt: -1 });
JobOpportunitySchema.index({ slug: 1 });
JobOpportunitySchema.index({ department: 1, isPublished: 1 });
JobOpportunitySchema.index({ deletedAt: 1, createdAt: -1 });

const JobOpportunity =
	mongoose.models.JobOpportunity || mongoose.model("JobOpportunity", JobOpportunitySchema);

export default JobOpportunity;
