"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import ReactMarkdown from "react-markdown";

function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

const inputStyle = {
	width: "100%",
	padding: "10px 12px",
	borderRadius: 8,
	border: "1px solid rgba(28,31,38,0.6)",
	background: "rgba(21,24,32,0.8)",
	color: "#F1F5F9",
	fontSize: 14,
};

const labelStyle = {
	display: "block",
	fontSize: 12,
	fontWeight: 600,
	color: "#94A3B8",
	marginBottom: 6,
};

const PAGE_SIZE = 12;

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ isPublished }) {
	return (
		<span
			style={{
				display: "inline-block",
				padding: "3px 10px",
				borderRadius: 100,
				fontSize: 11,
				fontWeight: 600,
				textTransform: "uppercase",
				letterSpacing: "0.5px",
				background: isPublished
					? "rgba(16,185,129,0.15)"
					: "rgba(100,116,139,0.2)",
				color: isPublished ? "#10B981" : "#94A3B8",
			}}
		>
			{isPublished ? "Published" : "Draft"}
		</span>
	);
}

// ─── Blog Grid Card ───────────────────────────────────────────────────────────
function BlogCard({ blog, onEdit, onTogglePublish, onDelete }) {
	return (
		<div
			style={{
				background: "rgba(21,24,32,0.6)",
				border: "1px solid rgba(28,31,38,0.5)",
				borderRadius: 14,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				transition: "border-color 0.2s",
			}}
		>
			{blog.coverImage ? (
				<div style={{ height: 160, overflow: "hidden", position: "relative" }}>
					<img
						src={blog.coverImage}
						alt={blog.title}
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
				</div>
			) : (
				<div
					style={{
						height: 160,
						background:
							"linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1))",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 32,
					}}
				>
					✍️
				</div>
			)}

			<div
				style={{
					padding: "16px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 8,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						gap: 8,
					}}
				>
					<h3
						style={{
							fontSize: 14,
							fontWeight: 700,
							color: "#F1F5F9",
							lineHeight: 1.4,
							margin: 0,
						}}
					>
						{blog.title}
					</h3>
					<StatusBadge isPublished={blog.isPublished} />
				</div>

				<p
					style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}
				>
					{blog.excerpt.slice(0, 100)}
					{blog.excerpt.length > 100 ? "…" : ""}
				</p>

				{blog.tags?.length > 0 && (
					<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
						{blog.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								style={{
									fontSize: 10,
									padding: "2px 8px",
									borderRadius: 100,
									background: "rgba(99,102,241,0.15)",
									color: "#3B82F6",
									fontWeight: 500,
								}}
							>
								{tag}
							</span>
						))}
					</div>
				)}

				<div
					style={{
						fontSize: 11,
						color: "#6B7280",
						marginTop: "auto",
						paddingTop: 8,
					}}
				>
					{formatDate(blog.createdAt)}
				</div>

				<div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
					<button
						onClick={() => onEdit(blog)}
						style={{
							padding: "6px 12px",
							fontSize: 12,
							borderRadius: 8,
							cursor: "pointer",
							background: "rgba(34,211,238,0.1)",
							border: "1px solid rgba(34,211,238,0.25)",
							color: "#22D3EE",
						}}
					>
						Edit
					</button>
					<button
						onClick={() => onTogglePublish(blog.slug, !blog.isPublished)}
						style={{
							flex: 1,
							padding: "6px 0",
							fontSize: 12,
							borderRadius: 8,
							cursor: "pointer",
							background: blog.isPublished
								? "rgba(100,116,139,0.15)"
								: "rgba(16,185,129,0.12)",
							border: `1px solid ${blog.isPublished ? "rgba(100,116,139,0.3)" : "rgba(16,185,129,0.3)"}`,
							color: blog.isPublished ? "#94A3B8" : "#10B981",
						}}
					>
						{blog.isPublished ? "Unpublish" : "Publish"}
					</button>
					<a
						href={`/blog/${blog.slug}`}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							padding: "6px 10px",
							fontSize: 12,
							borderRadius: 8,
							cursor: "pointer",
							background: "rgba(99,102,241,0.12)",
							border: "1px solid rgba(99,102,241,0.3)",
							color: "#3B82F6",
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						↗
					</a>
					<button
						onClick={() => onDelete(blog.slug)}
						style={{
							padding: "6px 12px",
							fontSize: 12,
							borderRadius: 8,
							cursor: "pointer",
							background: "rgba(239,68,68,0.1)",
							border: "1px solid rgba(239,68,68,0.3)",
							color: "#F87171",
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

// ─── Live Preview ─────────────────────────────────────────────────────────────
function BlogPreview({ form }) {
	return (
		<div
			style={{
				background: "#020617",
				border: "1px solid rgba(99,102,241,0.25)",
				borderRadius: 14,
				overflow: "hidden",
			}}
		>
			{form.coverImage && (
				<div style={{ height: 200, overflow: "hidden" }}>
					<img
						src={form.coverImage}
						alt="cover preview"
						style={{ width: "100%", height: "100%", objectFit: "cover" }}
						onError={(e) => {
							e.target.style.display = "none";
						}}
					/>
				</div>
			)}
			<div style={{ padding: 24 }}>
				{form.tags && (
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 6,
							marginBottom: 12,
						}}
					>
						{form.tags
							.split(",")
							.map((t) => t.trim())
							.filter(Boolean)
							.map((tag) => (
								<span
									key={tag}
									style={{
										fontSize: 11,
										padding: "3px 10px",
										borderRadius: 100,
										background: "rgba(99,102,241,0.15)",
										color: "#3B82F6",
										fontWeight: 500,
									}}
								>
									{tag}
								</span>
							))}
					</div>
				)}
				<h2
					style={{
						fontSize: 22,
						fontWeight: 800,
						color: "#F1F5F9",
						marginBottom: 10,
						lineHeight: 1.3,
					}}
				>
					{form.title || "Blog Title"}
				</h2>
				<p
					style={{
						fontSize: 14,
						color: "#94A3B8",
						lineHeight: 1.6,
						marginBottom: 20,
					}}
				>
					{form.excerpt || "Your excerpt will appear here…"}
				</p>
				{form.content && (
					<div
						style={{
							fontSize: 14,
							color: "#CBD5E1",
							lineHeight: 1.8,
							borderTop: "1px solid rgba(28,31,38,0.4)",
							paddingTop: 20,
							whiteSpace: "pre-wrap",
						}}
						className="prose"
					>
						<ReactMarkdown>
							{form.content.slice(0, 600) +
								(form.content.length > 600
									? "\n\n…(truncated in preview)"
									: "")}
						</ReactMarkdown>
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Main ManageBlogs Component ──────────────────────────────────────────────
export default function ManageBlogs() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("grid"); // "grid" | "add" | "edit"
	const [editingSlug, setEditingSlug] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(true);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [ConfirmDialog, confirm] = useConfirm();

	const [form, setForm] = useState({
		title: "",
		slug: "",
		excerpt: "",
		content: "",
		coverImage: "",
		tags: "",
		isPublished: false,
		metaTitle: "",
		metaDescription: "",
	});

	const fetchBlogs = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/blogs?admin=true");
			const data = await res.json();
			setBlogs(data.blogs || []);
		} catch {
			toast.error("Failed to load blogs");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBlogs();
	}, [fetchBlogs]);

	function openEdit(blog) {
		setForm({
			title: blog.title || "",
			slug: blog.slug || "",
			excerpt: blog.excerpt || "",
			content: "", // content not in list response — fetch full
			coverImage: blog.coverImage || "",
			tags: (blog.tags || []).join(", "),
			isPublished: blog.isPublished ?? false,
			metaTitle: blog.metaTitle || "",
			metaDescription: blog.metaDescription || "",
		});
		setEditingSlug(blog.slug);
		// Fetch the full blog (includes content) then update form
		fetch(`/api/blogs/${blog.slug}`)
			.then((r) => r.json())
			.then((d) => {
				if (d.blog) {
					setForm((prev) => ({
						...prev,
						content: d.blog.content || "",
						metaTitle: d.blog.metaTitle || prev.metaTitle,
						metaDescription: d.blog.metaDescription || prev.metaDescription,
					}));
				}
			})
			.catch(() => toast.error("Could not load blog content"));
		setView("edit");
	}

	// Auto-generate slug from title
	function handleTitleChange(val) {
		setForm((prev) => ({
			...prev,
			title: val,
			slug: slugify(val),
		}));
	}

	function handleFormChange(key, val) {
		setForm((prev) => ({ ...prev, [key]: val }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		try {
			const isEdit = view === "edit";
			const url = isEdit ? `/api/blogs/${editingSlug}` : "/api/blogs";
			const method = isEdit ? "PATCH" : "POST";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...form,
					tags: form.tags
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean),
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			toast.success(isEdit ? "Blog updated!" : "Blog created!");
			if (!isEdit) {
				setForm({
					title: "",
					slug: "",
					excerpt: "",
					content: "",
					coverImage: "",
					tags: "",
					isPublished: false,
					metaTitle: "",
					metaDescription: "",
				});
			}
			await fetchBlogs();
			setView("grid");
		} catch (err) {
			toast.error(err.message || "Failed to save blog");
		} finally {
			setSubmitting(false);
		}
	}

	async function handleTogglePublish(slug, isPublished) {
		const res = await fetch(`/api/blogs/${slug}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isPublished }),
		});
		if (res.ok) {
			toast.success(`Blog ${isPublished ? "published" : "unpublished"}`);
			await fetchBlogs();
		} else {
			toast.error("Failed to update blog");
		}
	}

	async function handleDelete(slug) {
		const ok = await confirm({
			title: "Delete blog post?",
			description:
				"This will permanently remove the article. This action cannot be undone.",
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (!ok) return;
		const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
		if (res.ok) {
			toast.success("Blog deleted");
			await fetchBlogs();
		} else {
			toast.error("Failed to delete blog");
		}
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
			{/* ── Header bar ── */}
			<div
				className="dash-panel"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: 12,
				}}
			>
				<h2
					className="dash-panel-title"
					style={{ margin: 0 }}
				>
					Manage Blogs{view === "grid" && ` (${blogs.length})`}
					{view === "edit" && " — Editing"}
				</h2>
				<div style={{ display: "flex", gap: 10 }}>
					{(view === "add" || view === "edit") && (
						<button
							type="button"
							onClick={() => setView("grid")}
							style={{
								padding: "8px 16px",
								fontSize: 13,
								borderRadius: 9,
								cursor: "pointer",
								background: "rgba(28,31,38,0.4)",
								border: "1px solid rgba(28,31,38,0.6)",
								color: "#94A3B8",
							}}
						>
							← Back to Grid
						</button>
					)}
					{view === "grid" && (
						<button
							type="button"
							className="dash-btn-primary"
							onClick={() => setView("add")}
						>
							+ New Blog
						</button>
					)}
					{(view === "add" || view === "edit") && (
						<button
							type="button"
							onClick={() => setPreviewOpen((p) => !p)}
							style={{
								padding: "8px 16px",
								fontSize: 13,
								borderRadius: 9,
								cursor: "pointer",
								background: "rgba(99,102,241,0.12)",
								border: "1px solid rgba(99,102,241,0.3)",
								color: "#3B82F6",
							}}
						>
							{previewOpen ? "Hide Preview" : "Show Preview"}
						</button>
					)}
				</div>
			</div>

			{ConfirmDialog}

			{/* ── Grid View ── */}
			{view === "grid" && (
				<>
					{loading ? (
						<p style={{ color: "#6B7280", fontSize: 14 }}>Loading blogs…</p>
					) : blogs.length === 0 ? (
						<div
							className="dash-panel"
							style={{
								textAlign: "center",
								padding: "60px 24px",
								color: "#6B7280",
							}}
						>
							<div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
							<h3
								style={{
									color: "#F1F5F9",
									fontSize: 16,
									fontWeight: 600,
									marginBottom: 8,
								}}
							>
								No blogs yet
							</h3>
							<p style={{ fontSize: 14, color: "#94A3B8" }}>
								Click &quot;+ New Blog&quot; to publish your first article.
							</p>
						</div>
					) : (
						<>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
									gap: 20,
								}}
							>
								{blogs.slice(0, visibleCount).map((blog) => (
									<BlogCard
										key={blog.id}
										blog={blog}
										onEdit={openEdit}
										onTogglePublish={handleTogglePublish}
										onDelete={handleDelete}
									/>
								))}
							</div>
							{visibleCount < blogs.length && (
								<div style={{ textAlign: "center", marginTop: 20 }}>
									<span style={{ fontSize: 12, color: "#6B7280", marginRight: 12 }}>
										Showing {Math.min(visibleCount, blogs.length)} of {blogs.length}
									</span>
									<button
										onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
										style={{
											padding: "8px 24px",
											background: "rgba(59,130,246,0.08)",
											border: "1px solid rgba(59,130,246,0.2)",
											borderRadius: 8,
											color: "#60A5FA",
											fontSize: 13,
											fontWeight: 600,
											cursor: "pointer",
											transition: "all 0.2s ease",
										}}
									>
										Load More
									</button>
								</div>
							)}
						</>
					)}
				</>
			)}

			{/* ── Add / Edit Blog View ── */}
			{(view === "add" || view === "edit") && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: previewOpen ? "1fr 1fr" : "1fr",
						gap: 24,
						alignItems: "start",
					}}
				>
					{/* Form */}
					<form
						onSubmit={handleSubmit}
						style={{ display: "grid", gap: 18 }}
					>
						<div
							className="dash-panel"
							style={{ display: "grid", gap: 16 }}
						>
							<h3
								style={{
									fontSize: 15,
									fontWeight: 700,
									color: "#F1F5F9",
									margin: 0,
								}}
							>
								Article Details
							</h3>

							<div>
								<label style={labelStyle}>Title *</label>
								<input
									value={form.title}
									onChange={(e) => handleTitleChange(e.target.value)}
									style={inputStyle}
									placeholder="Your blog post title"
									required
								/>
							</div>

							<div>
								<label style={labelStyle}>Slug *</label>
								<input
									value={form.slug}
									onChange={(e) => handleFormChange("slug", e.target.value)}
									style={{
										...inputStyle,
										fontFamily: "var(--font-mono)",
										fontSize: 12,
									}}
									placeholder="auto-generated-from-title"
									required
								/>
							</div>

							<div>
								<label style={labelStyle}>Excerpt *</label>
								<textarea
									value={form.excerpt}
									onChange={(e) => handleFormChange("excerpt", e.target.value)}
									style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
									placeholder="Short description shown in cards and meta…"
									required
								/>
							</div>

							<div>
								<label style={labelStyle}>Cover Image URL</label>
								<input
									value={form.coverImage}
									onChange={(e) =>
										handleFormChange("coverImage", e.target.value)
									}
									style={inputStyle}
									placeholder="https://example.com/image.jpg"
									type="url"
								/>
								{form.coverImage && (
									<div
										style={{
											marginTop: 8,
											height: 100,
											borderRadius: 8,
											overflow: "hidden",
											border: "1px solid rgba(28,31,38,0.4)",
										}}
									>
										<img
											src={form.coverImage}
											alt="cover"
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
									</div>
								)}
							</div>

							<div>
								<label style={labelStyle}>Tags (comma-separated)</label>
								<input
									value={form.tags}
									onChange={(e) => handleFormChange("tags", e.target.value)}
									style={inputStyle}
									placeholder="cybersecurity, AI, cloud"
								/>
							</div>
						</div>

						<div
							className="dash-panel"
							style={{ display: "grid", gap: 16 }}
						>
							<h3
								style={{
									fontSize: 15,
									fontWeight: 700,
									color: "#F1F5F9",
									margin: 0,
								}}
							>
								Content *
							</h3>
							<textarea
								value={form.content}
								onChange={(e) => handleFormChange("content", e.target.value)}
								style={{
									...inputStyle,
									minHeight: 280,
									resize: "vertical",
									fontFamily: "var(--font-mono)",
									fontSize: 13,
									lineHeight: 1.6,
								}}
								placeholder="Write your full blog content here…"
								required
							/>
						</div>

						<div
							className="dash-panel"
							style={{ display: "grid", gap: 16 }}
						>
							<h3
								style={{
									fontSize: 15,
									fontWeight: 700,
									color: "#F1F5F9",
									margin: 0,
								}}
							>
								SEO Metadata
							</h3>
							<div>
								<label style={labelStyle}>
									Meta Title (leave blank to use post title)
								</label>
								<input
									value={form.metaTitle}
									onChange={(e) =>
										handleFormChange("metaTitle", e.target.value)
									}
									style={inputStyle}
									placeholder="SEO page title…"
								/>
							</div>
							<div>
								<label style={labelStyle}>
									Meta Description (leave blank to use excerpt)
								</label>
								<textarea
									value={form.metaDescription}
									onChange={(e) =>
										handleFormChange("metaDescription", e.target.value)
									}
									style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
									placeholder="Brief description for search engine results…"
								/>
							</div>
						</div>

						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<label
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									cursor: "pointer",
									fontSize: 14,
									color: "#CBD5E1",
								}}
							>
								<input
									type="checkbox"
									checked={form.isPublished}
									onChange={(e) =>
										handleFormChange("isPublished", e.target.checked)
									}
									style={{ accentColor: "#3B82F6", width: 16, height: 16 }}
								/>
								Publish immediately
							</label>
						</div>

						<button
							type="submit"
							className="dash-btn-primary"
							disabled={submitting}
							style={{ width: "fit-content" }}
						>
							{submitting
								? view === "edit"
									? "Saving…"
									: "Creating…"
								: view === "edit"
									? "Save Changes"
									: form.isPublished
										? "Publish Blog"
										: "Save as Draft"}
						</button>
					</form>

					{/* Live Preview */}
					{previewOpen && (
						<div style={{ position: "sticky", top: 24 }}>
							<div
								style={{
									fontSize: 11,
									fontWeight: 600,
									color: "#6B7280",
									textTransform: "uppercase",
									letterSpacing: "1px",
									marginBottom: 10,
								}}
							>
								Live Preview
							</div>
							<BlogPreview form={form} />
						</div>
					)}
				</div>
			)}
		</div>
	);
}
