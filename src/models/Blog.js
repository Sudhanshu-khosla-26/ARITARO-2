import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		excerpt: { type: String, required: true },
		content: { type: String, required: true },
		coverImage: { type: String },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		tags: [{ type: String }],
		isPublished: { type: Boolean, default: false },
		publishedAt: { type: Date },
		metaTitle: { type: String },
		metaDescription: { type: String },
	},
	{ timestamps: true },
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
