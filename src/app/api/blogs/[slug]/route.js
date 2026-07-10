import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { requireAdmin } from "@/lib/session";

// GET /api/blogs/[slug] - fetch a single blog by slug
export async function GET(request, { params }) {
	try {
		await connectDB();
		const { slug } = await params;

		const blog = await Blog.findOne({ slug }).populate("author", "name").lean();

		if (!blog) {
			return Response.json({ message: "Blog not found" }, { status: 404 });
		}

		if (!blog.isPublished) {
			// Allow admins to preview unpublished
			const { authorized } = await requireAdmin().catch(() => ({
				authorized: false,
			}));
			if (!authorized) {
				return Response.json({ message: "Blog not found" }, { status: 404 });
			}
		}

		return Response.json({
			blog: {
				id: blog._id.toString(),
				title: blog.title,
				slug: blog.slug,
				excerpt: blog.excerpt,
				content: blog.content,
				coverImage: blog.coverImage,
				tags: blog.tags,
				isPublished: blog.isPublished,
				publishedAt: blog.publishedAt?.toISOString() ?? null,
				createdAt: blog.createdAt?.toISOString() ?? null,
				metaTitle: blog.metaTitle,
				metaDescription: blog.metaDescription,
				author: blog.author ? { name: blog.author.name } : null,
			},
		});
	} catch (error) {
		console.error("GET /api/blogs/[slug] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// PATCH /api/blogs/[slug] - update blog (toggle publish or full edit) (admin only)
export async function PATCH(request, { params }) {
	try {
		const { authorized } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const { slug } = await params;
		const body = await request.json();

		const blog = await Blog.findOne({ slug });
		if (!blog) {
			return Response.json({ message: "Blog not found" }, { status: 404 });
		}

		// Full-edit fields
		const editableFields = ["title", "slug", "excerpt", "content", "coverImage", "tags", "metaTitle", "metaDescription"];
		for (const field of editableFields) {
			if (field in body) blog[field] = body[field];
		}

		// Publish toggle
		if (body.isPublished !== undefined) {
			blog.isPublished = body.isPublished;
			if (body.isPublished && !blog.publishedAt) {
				blog.publishedAt = new Date();
			}
		}

		await blog.save();
		return Response.json({ message: "Blog updated", slug: blog.slug });
	} catch (error) {
		console.error("PATCH /api/blogs/[slug] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}


// DELETE /api/blogs/[slug] - remove a blog (admin only)
export async function DELETE(request, { params }) {
	try {
		const { authorized, session } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const { slug } = await params;

		const blog = await Blog.findOneAndDelete({
			slug,
			author: session.user.id,
		});
		if (!blog) {
			return Response.json({ message: "Blog not found" }, { status: 404 });
		}

		return Response.json({ message: "Blog deleted" });
	} catch (error) {
		console.error("DELETE /api/blogs/[slug] error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
