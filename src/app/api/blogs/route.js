import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { requireAdmin } from "@/lib/session";

// GET /api/blogs - fetch all blogs (public: only published, admin: all)
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const adminView = searchParams.get("admin") === "true";

		const { authorized } = await requireAdmin().catch(() => ({ authorized: false }));

		const filter = adminView && authorized ? {} : { isPublished: true };

		const blogs = await Blog.find(filter)
			.populate("author", "name email")
			.sort({ createdAt: -1 })
			.lean();

		return Response.json({
			blogs: blogs.map((b) => ({
				id: b._id.toString(),
				title: b.title,
				slug: b.slug,
				excerpt: b.excerpt,
				coverImage: b.coverImage,
				tags: b.tags,
				isPublished: b.isPublished,
				publishedAt: b.publishedAt?.toISOString() ?? null,
				createdAt: b.createdAt?.toISOString() ?? null,
				author: b.author ? { name: b.author.name, email: b.author.email } : null,
			})),
		});
	} catch (error) {
		console.error("GET /api/blogs error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

// POST /api/blogs - create a new blog (admin only)
export async function POST(request) {
	try {
		const { authorized, session } = await requireAdmin();
		if (!authorized) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();
		const body = await request.json();

		const {
			title,
			slug,
			excerpt,
			content,
			coverImage,
			tags,
			isPublished,
			metaTitle,
			metaDescription,
		} = body;

		if (!title || !slug || !excerpt || !content) {
			return Response.json(
				{ message: "title, slug, excerpt, and content are required" },
				{ status: 400 },
			);
		}

		const existing = await Blog.findOne({ slug });
		if (existing) {
			return Response.json(
				{ message: "A blog with this slug already exists" },
				{ status: 409 },
			);
		}

		const blog = await Blog.create({
			title,
			slug,
			excerpt,
			content,
			coverImage: coverImage || "",
			author: session.user.id,
			tags: tags ?? [],
			isPublished: isPublished ?? false,
			publishedAt: isPublished ? new Date() : null,
			metaTitle: metaTitle || title,
			metaDescription: metaDescription || excerpt,
		});

		return Response.json({ message: "Blog created", blog: { id: blog._id.toString(), slug: blog.slug } }, { status: 201 });
	} catch (error) {
		console.error("POST /api/blogs error:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
