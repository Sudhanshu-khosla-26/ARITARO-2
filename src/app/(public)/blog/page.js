import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import BlogCard from "./BlogCard";

export const metadata = {
	title: "Blog | Aritaro – Cybersecurity & AI Insights",
	description:
		"Explore expert articles on enterprise cybersecurity, AI automation, threat intelligence, and compliance from the Aritaro team.",
	keywords: "cybersecurity blog, AI insights, threat intelligence, penetration testing, cloud security, aritaro",
	openGraph: {
		title: "Blog | Aritaro – Cybersecurity & AI Insights",
		description: "Expert insights on cybersecurity, AI, and enterprise defence from Aritaro.",
		type: "website",
	},
};

export const dynamic = "force-dynamic";

async function getPublishedBlogs() {
	await connectDB();
	const blogs = await Blog.find({ isPublished: true })
		.populate("author", "name")
		.sort({ publishedAt: -1 })
		.lean();

	// Serialize Mongoose documents to plain objects for Client Component props
	return blogs.map((b) => ({
		id: b._id.toString(),
		title: b.title,
		slug: b.slug,
		excerpt: b.excerpt,
		coverImage: b.coverImage ?? null,
		tags: b.tags ?? [],
		isPublished: b.isPublished,
		publishedAt: b.publishedAt?.toISOString() ?? null,
		createdAt: b.createdAt?.toISOString() ?? null,
		author: b.author ? { name: b.author.name } : null,
	}));
}

function formatDate(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default async function BlogIndexPage() {
	const blogs = await getPublishedBlogs();

	return (
		<main style={{ minHeight: "100vh", background: "#020617", color: "#F1F5F9", fontFamily: "var(--font-sans)" }}>
			{/* Hero */}
			<section
				style={{
					padding: "100px 24px 60px",
					textAlign: "center",
					background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
					borderBottom: "1px solid rgba(51,65,85,0.3)",
				}}
			>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						background: "rgba(99,102,241,0.08)",
						border: "1px solid rgba(99,102,241,0.2)",
						borderRadius: 100,
						padding: "4px 16px",
						marginBottom: 20,
					}}
				>
					<span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818CF8", boxShadow: "0 0 8px rgba(129,140,248,0.7)" }} />
					<span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "2px", color: "#818CF8", fontWeight: 600 }}>
						BLOG & INSIGHTS
					</span>
				</div>
				<h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
					Intelligence{" "}
					<span
						style={{
							background: "linear-gradient(135deg, #818CF8, #22D3EE)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Briefings
					</span>
				</h1>
				<p style={{ fontSize: 16, color: "#94A3B8", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
					Expert perspectives on cybersecurity, AI automation, threat intelligence, and enterprise defence.
				</p>
			</section>

			{/* Blog Grid */}
			<section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
				{blogs.length === 0 ? (
					<div style={{ textAlign: "center", padding: "80px 24px", color: "#64748B" }}>
						<div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
						<h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>No Blog yet</h2>
						<p style={{ fontSize: 14, color: "#94A3B8" }}>Stay tuned — our team is preparing fresh insights.</p>
					</div>
				) : (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
							gap: 28,
						}}
					>
						{blogs.map((blog) => (
							<BlogCard key={blog.id} blog={blog} />
						))}
					</div>
				)}
			</section>
		</main>
	);
}
