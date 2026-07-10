import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		description: { type: String, required: true },
		shortDescription: { type: String, required: true },
		duration: { type: String, default: "2-4 weeks" },
		icon: { type: String, default: "shield" },
		overview: { type: String, required: true },
		methodology: [{ type: String }],
		scope: [{ type: String }],
		deliverables: [{ type: String }],
		standards: [{ type: String }],
		sampleFindings: [{ type: String }],
		faqs: [
			{
				question: { type: String, required: true },
				answer: { type: String, required: true },
			},
		],
		isPublished: { type: Boolean, default: true },
		image: { type: String },
		pdfUrl: { type: String },
	},
	{ timestamps: true },
);

const Service =
	mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
