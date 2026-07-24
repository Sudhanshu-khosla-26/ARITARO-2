import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aritaro.in";

export default async function sitemap() {
	const currentDate = new Date().toISOString().split("T")[0];

	// Static routes list
	const staticPaths = [
		{ route: "", changeFrequency: "daily", priority: 1.0 },
		{ route: "/services", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/services/wap-pt", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/services/api-pt", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/services/cloud", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/services/ai-pt", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/request-assessment", changeFrequency: "weekly", priority: 0.9 },
		{ route: "/about", changeFrequency: "monthly", priority: 0.8 },
		{ route: "/blog", changeFrequency: "daily", priority: 0.8 },
		{ route: "/case-studies", changeFrequency: "weekly", priority: 0.8 },
		{ route: "/careers", changeFrequency: "monthly", priority: 0.7 },
		{ route: "/contact", changeFrequency: "monthly", priority: 0.8 },
		{ route: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
		{ route: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
		{ route: "/legal/disclosure", changeFrequency: "yearly", priority: 0.4 },
	];

	const staticRoutes = staticPaths.map((item) => ({
		url: `${BASE_URL}${item.route}`,
		lastModified: currentDate,
		changeFrequency: item.changeFrequency,
		priority: item.priority,
	}));

	let blogRoutes = [];
	try {
		await connectDB();
		const blogs = await Blog.find({ isPublished: true }, "slug updatedAt").lean();
		blogRoutes = blogs.map((b) => ({
			url: `${BASE_URL}/blog/${b.slug}`,
			lastModified: b.updatedAt ? new Date(b.updatedAt).toISOString().split("T")[0] : currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		}));
	} catch (error) {
		console.warn("Dynamic blog fetching for sitemap skipped or database unavailable:", error.message);
	}

	return [...staticRoutes, ...blogRoutes];
}
