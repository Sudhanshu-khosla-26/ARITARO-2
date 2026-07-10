import mongoose, { Schema } from "mongoose";

const ContactRequestSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["contact", "quote", "audit"],
			default: "contact",
		},
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, trim: true },
		company: { type: String, trim: true },
		phone: { type: String, trim: true },
		subject: { type: String, trim: true },
		message: { type: String, required: true },
		service: { type: String, trim: true },
		status: {
			type: String,
			enum: ["new", "in_progress", "resolved"],
			default: "new",
		},
		adminNotes: { type: String },
	},
	{ timestamps: true },
);

ContactRequestSchema.index({ status: 1, type: 1 });

const ContactRequest =
	mongoose.models.ContactRequest ||
	mongoose.model("ContactRequest", ContactRequestSchema);

export default ContactRequest;
