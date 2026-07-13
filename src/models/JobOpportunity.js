import mongoose, { Schema } from "mongoose";

const JobOpportunitySchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		department: { type: String, required: true, trim: true },
		location: { type: String, required: true, trim: true },
		type: { type: String, default: "Full-Time" },
		isPublished: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const JobOpportunity =
	mongoose.models.JobOpportunity || mongoose.model("JobOpportunity", JobOpportunitySchema);

export default JobOpportunity;
