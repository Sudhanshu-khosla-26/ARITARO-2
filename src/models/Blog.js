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
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1, isPublished: 1 });
BlogSchema.index({ author: 1, createdAt: -1 });
BlogSchema.index({ deletedAt: 1, createdAt: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
