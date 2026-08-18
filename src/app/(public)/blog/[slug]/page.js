import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

// ─── Dynamic SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
	const { slug } = await params;

	try {
		await connectDB();
		const blog = await Blog.findOne({ slug, isPublished: true }).lean();

		if (!blog) {
			return {
				title: "Article not found | Aritaro",
				description:
					"The article you are looking for does not exist or has been removed.",
			};
		}

		return {
			title: `${blog.metaTitle || blog.title} | Aritaro Blog`,
			description: blog.metaDescription || blog.excerpt,
			keywords: blog.tags?.join(", "),
			openGraph: {
				title: blog.metaTitle || blog.title,
				description: blog.metaDescription || blog.excerpt,
				type: "article",
				publishedTime: blog.publishedAt?.toISOString(),
				images: blog.coverImage
					? [{ url: blog.coverImage, alt: blog.title }]
					: [],
			},
			twitter: {
				card: "summary_large_image",
				title: blog.metaTitle || blog.title,
				description: blog.metaDescription || blog.excerpt,
				images: blog.coverImage ? [blog.coverImage] : [],
			},
		};
	} catch (error) {
		console.warn("Blog metadata unavailable without database connection:", error.message);
		return {
			title: "Aritaro Blog",
			description: "Cybersecurity insights and AI automation thought leadership from Aritaro.",
		};
	}
}

function formatDate(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default async function SingleBlogPage({ params }) {
	const { slug } = await params;
	let blog = null;

	try {
		await connectDB();
		blog = await Blog.findOne({ slug, isPublished: true })
			.populate("author", "name")
			.lean();
	} catch (error) {
		console.warn("Blog article unavailable without database connection:", error.message);
	}

	if (!blog) {
		return (
			<main
				style={{
					minHeight: "100vh",
					background: "#020617",
					color: "#F1F5F9",
					fontFamily: "var(--font-sans)",
					display: "grid",
					placeItems: "center",
					padding: "40px 24px",
				}}
			>
				<div style={{ textAlign: "center", maxWidth: 640 }}>
					<h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: 12 }}>Article unavailable</h1>
					<p style={{ color: "#94A3B8", lineHeight: 1.7 }}>
						This article cannot be loaded right now because the database is unavailable.
					</p>
				</div>
			</main>
		);
	}

	// ── Structured Data (JSON-LD) ─────────────────────────────────────────
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.metaTitle || blog.title,
		description: blog.metaDescription || blog.excerpt,
		image: blog.coverImage || undefined,
		datePublished: blog.publishedAt?.toISOString(),
		dateModified: blog.updatedAt?.toISOString(),
		author: {
			"@type": "Person",
			name: blog.author?.name ?? "Aritaro Team",
		},
		publisher: {
			"@type": "Organization",
			name: "Aritaro Pvt Limited",
			logo: { "@type": "ImageObject", url: "/aritaro-logo.png" },
		},
		keywords: blog.tags?.join(", "),
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `https://aritaro.com/blog/${slug}`,
		},
	};

	return (
		<>
			{/* JSON-LD structured data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<main
				style={{
					minHeight: "100vh",
					background: "#020617",
					color: "#F1F5F9",
					fontFamily: "var(--font-sans)",
				}}
			>
				{/* Cover Image */}
				{blog.coverImage && (
					<div
						style={{
							width: "100%",
							height: "clamp(240px, 40vw, 480px)",
							overflow: "hidden",
							position: "relative",
						}}
					>
						<img
							src={blog.coverImage}
							alt={blog.title}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
						<div
							style={{
								position: "absolute",
								inset: 0,
								background:
									"linear-gradient(to bottom, rgba(2,6,23,0) 40%, rgba(2,6,23,1) 100%)",
							}}
						/>
					</div>
				)}

				{/* Article Container */}
				<article
					style={{
						maxWidth: 760,
						margin: "0 auto",
						padding: "60px 24px 100px",
					}}
				>
					{/* Back link */}
					<Link
						href="/blog"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 6,
							fontSize: 13,
							color: "#818CF8",
							textDecoration: "none",
							marginBottom: 32,
							opacity: 0.8,
						}}
					>
						← All Articles
					</Link>

					{/* Tags */}
					{blog.tags?.length > 0 && (
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: 8,
								marginBottom: 20,
							}}
						>
							{blog.tags.map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: 11,
										padding: "3px 12px",
										borderRadius: 100,
										background: "rgba(99,102,241,0.12)",
										color: "#818CF8",
										fontWeight: 500,
									}}
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{/* Title */}
					<h1
						style={{
							fontSize: "clamp(24px, 4vw, 38px)",
							fontWeight: 900,
							lineHeight: 1.25,
							marginBottom: 16,
							color: "#F1F5F9",
						}}
					>
						{blog.title}
					</h1>

					{/* Excerpt */}
					<p
						style={{
							fontSize: 16,
							color: "#94A3B8",
							lineHeight: 1.7,
							marginBottom: 24,
							borderLeft: "3px solid rgba(99,102,241,0.5)",
							paddingLeft: 16,
						}}
					>
						{blog.excerpt}
					</p>

					{/* Meta row */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 16,
							marginBottom: 40,
							paddingBottom: 24,
							borderBottom: "1px solid rgba(51,65,85,0.4)",
							flexWrap: "wrap",
						}}
					>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: "50%",
								background: "linear-gradient(135deg, #6366F1, #22D3EE)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 14,
								fontWeight: 700,
								color: "white",
								flexShrink: 0,
							}}
						>
							{(blog.author?.name ?? "A").charAt(0).toUpperCase()}
						</div>
						<div>
							<div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>
								{blog.author?.name ?? "Aritaro Team"}
							</div>
							<div style={{ fontSize: 12, color: "#64748B" }}>
								{formatDate(blog.publishedAt)}
							</div>
						</div>
					</div>

					{/* Content */}
					<div
						className="prose"
						style={{
							fontSize: 15,
							lineHeight: 1.85,
							color: "#CBD5E1",
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
						}}
					>
						<ReactMarkdown>{blog.content}</ReactMarkdown>
					</div>

					{/* Footer */}
					<div
						style={{
							marginTop: 60,
							paddingTop: 32,
							borderTop: "1px solid rgba(51,65,85,0.4)",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 12,
						}}
					>
						<Link
							href="/blog"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 6,
								fontSize: 13,
								color: "#818CF8",
								textDecoration: "none",
								padding: "8px 16px",
								borderRadius: 8,
								border: "1px solid rgba(99,102,241,0.3)",
								background: "rgba(99,102,241,0.08)",
							}}
						>
							← Back to Blog
						</Link>
						<Link
							href="/contact"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 6,
								fontSize: 13,
								color: "#22D3EE",
								textDecoration: "none",
								padding: "8px 16px",
								borderRadius: 8,
								border: "1px solid rgba(34,211,238,0.3)",
								background: "rgba(34,211,238,0.08)",
							}}
						>
							Get in Touch →
						</Link>
					</div>
				</article>
			</main>
		</>
	);
}
