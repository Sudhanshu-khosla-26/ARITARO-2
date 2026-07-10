"use client";

import Link from "next/link";

function formatDate(iso) {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default function BlogCard({ blog }) {
	return (
		<Link href={`/blog/${blog.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
			<article
				style={{
					background: "rgba(15,23,42,0.7)",
					border: "1px solid rgba(51,65,85,0.5)",
					borderRadius: 16,
					overflow: "hidden",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					transition: "border-color 0.25s, transform 0.25s",
					cursor: "pointer",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.borderColor = "rgba(129,140,248,0.4)";
					e.currentTarget.style.transform = "translateY(-4px)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
					e.currentTarget.style.transform = "translateY(0)";
				}}
			>
				{blog.coverImage ? (
					<div style={{ height: 200, overflow: "hidden", flexShrink: 0 }}>
						<img
							src={blog.coverImage}
							alt={blog.title}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					</div>
				) : (
					<div
						style={{
							height: 200,
							background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(34,211,238,0.1) 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 42,
							flexShrink: 0,
						}}
					>
						🛡️
					</div>
				)}

				<div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
					{blog.tags?.length > 0 && (
						<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
							{blog.tags.slice(0, 3).map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: 10,
										padding: "2px 8px",
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

					<h2 style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.4, margin: 0 }}>
						{blog.title}
					</h2>

					<p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0, flex: 1 }}>
						{blog.excerpt.slice(0, 130)}{blog.excerpt.length > 130 ? "…" : ""}
					</p>

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							paddingTop: 8,
							borderTop: "1px solid rgba(51,65,85,0.3)",
							marginTop: "auto",
						}}
					>
						<span style={{ fontSize: 12, color: "#64748B" }}>
							{blog.author?.name ?? "Aritaro Team"} · {formatDate(blog.publishedAt)}
						</span>
						<span style={{ fontSize: 12, color: "#818CF8", fontWeight: 600 }}>Read →</span>
					</div>
				</div>
			</article>
		</Link>
	);
}
