"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/ConfirmDialog";

function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

const inputStyle = {
	width: "100%",
	padding: "10px 12px",
	borderRadius: 8,
	border: "1px solid rgba(51,65,85,0.6)",
	background: "rgba(15,23,42,0.8)",
	color: "#F1F5F9",
	fontSize: 14,
	boxSizing: "border-box",
};

const labelStyle = {
	display: "block",
	fontSize: 12,
	fontWeight: 600,
	color: "#94A3B8",
	marginBottom: 6,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
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
				background: isPublished ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.2)",
				color: isPublished ? "#10B981" : "#94A3B8",
			}}
		>
			{isPublished ? "Published" : "Draft"}
		</span>
	);
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, onEdit, onTogglePublish, onDelete }) {
	return (
		<div
			style={{
				background: "rgba(15,23,42,0.6)",
				border: "1px solid rgba(51,65,85,0.5)",
				borderRadius: 14,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				transition: "border-color 0.2s",
			}}
		>
			{service.image ? (
				<div style={{ height: 140, overflow: "hidden", position: "relative" }}>
					<img src={service.image} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				</div>
			) : (
				<div
					style={{
						height: 140,
						background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 32,
					}}
				>
					🛡️
				</div>
			)}

			<div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
					<h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.4, margin: 0 }}>{service.name}</h3>
					<StatusBadge isPublished={service.isPublished} />
				</div>

				<p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, margin: 0 }}>
					{(service.shortDescription || service.description || "").slice(0, 100)}
					{(service.shortDescription || service.description || "").length > 100 ? "…" : ""}
				</p>

				<div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 4 }}>
					<span style={{ fontSize: 12, fontWeight: 700, color: "#818CF8", fontFamily: "var(--font-mono)" }}>
						₹{(service.price ?? 0).toLocaleString()}
					</span>
					<span style={{ fontSize: 11, color: "#64748B" }}>{service.duration}</span>
				</div>

				<div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
					<button
						onClick={() => onEdit(service)}
						style={{
							flex: 1,
							padding: "6px 0",
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
						onClick={() => onTogglePublish(service.id, !service.isPublished)}
						style={{
							flex: 1,
							padding: "6px 0",
							fontSize: 12,
							borderRadius: 8,
							cursor: "pointer",
							background: service.isPublished ? "rgba(100,116,139,0.15)" : "rgba(16,185,129,0.12)",
							border: `1px solid ${service.isPublished ? "rgba(100,116,139,0.3)" : "rgba(16,185,129,0.3)"}`,
							color: service.isPublished ? "#94A3B8" : "#10B981",
						}}
					>
						{service.isPublished ? "Unpublish" : "Publish"}
					</button>
					<button
						onClick={() => onDelete(service.id, service.name)}
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

// ─── Helpers for list inputs ──────────────────────────────────────────────────
function ListInput({ label, value, onChange, placeholder }) {
	// value is an array; we display as newline-joined
	return (
		<div>
			<label style={labelStyle}>{label} <span style={{ color: "#64748B", fontWeight: 400 }}>(one per line)</span></label>
			<textarea
				value={value.join("\n")}
				onChange={(e) => onChange(e.target.value.split("\n"))}
				style={{ ...inputStyle, minHeight: 80, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }}
				placeholder={placeholder}
			/>
		</div>
	);
}

const emptyForm = {
	name: "",
	slug: "",
	description: "",
	shortDescription: "",
	overview: "",
	price: "",
	duration: "2-4 weeks",
	icon: "shield",
	image: "",
	pdfUrl: "",
	methodology: [],
	scope: [],
	deliverables: [],
	standards: [],
	sampleFindings: [],
	faqs: [],
	isPublished: false,
};

// ─── Main ManageServices Component ───────────────────────────────────────────
export default function ManageServices() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("grid"); // "grid" | "add" | "edit"
	const [editingId, setEditingId] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [ConfirmDialog, confirm] = useConfirm();
	const [form, setForm] = useState(emptyForm);

	const fetchServices = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/services?admin=true");
			const data = await res.json();
			setServices(data.services || []);
		} catch {
			toast.error("Failed to load services");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchServices(); }, [fetchServices]);

	function handleNameChange(val) {
		setForm((prev) => ({ ...prev, name: val, slug: prev.slug || slugify(val) }));
	}

	function handleFormChange(key, val) {
		setForm((prev) => ({ ...prev, [key]: val }));
	}

	function openAdd() {
		setForm(emptyForm);
		setEditingId(null);
		setView("add");
	}

	function openEdit(service) {
		setForm({
			name: service.name || "",
			slug: service.slug || "",
			description: service.description || "",
			shortDescription: service.shortDescription || "",
			overview: service.overview || "",
			price: service.price ?? "",
			duration: service.duration || "2-4 weeks",
			icon: service.icon || "shield",
			image: service.image || "",
			pdfUrl: service.pdfUrl || "",
			methodology: service.methodology ?? [],
			scope: service.scope ?? [],
			deliverables: service.deliverables ?? [],
			standards: service.standards ?? [],
			sampleFindings: service.sampleFindings ?? [],
			faqs: service.faqs ?? [],
			isPublished: service.isPublished ?? false,
		});
		setEditingId(service.id);
		setView("edit");
	}

	function buildPayload() {
		return {
			...form,
			price: Number(form.price) || 0,
			methodology: form.methodology.filter(Boolean),
			scope: form.scope.filter(Boolean),
			deliverables: form.deliverables.filter(Boolean),
			standards: form.standards.filter(Boolean),
			sampleFindings: form.sampleFindings.filter(Boolean),
		};
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		try {
			const isEdit = view === "edit";
			const url = isEdit ? `/api/services/${editingId}` : "/api/services";
			const method = isEdit ? "PATCH" : "POST";
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(buildPayload()),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			toast.success(isEdit ? "Service updated!" : "Service created!");
			await fetchServices();
			setView("grid");
		} catch (err) {
			toast.error(err.message || "Failed to save service");
		} finally {
			setSubmitting(false);
		}
	}

	async function handleTogglePublish(id, isPublished) {
		const res = await fetch(`/api/services/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isPublished }),
		});
		if (res.ok) {
			toast.success(`Service ${isPublished ? "published" : "unpublished"}`);
			await fetchServices();
		} else {
			toast.error("Failed to update service");
		}
	}

	async function handleDelete(id, name) {
		const ok = await confirm({
			title: "Delete service?",
			description: `"${name}" will be permanently removed from the platform. This cannot be undone.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (!ok) return;
		const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
		if (res.ok) {
			toast.success("Service deleted");
			await fetchServices();
		} else {
			toast.error("Failed to delete service");
		}
	}

	const isFormView = view === "add" || view === "edit";

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
			{/* ── Header ── */}
			<div className="dash-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
				<h2 className="dash-panel-title" style={{ margin: 0 }}>
					Manage Services{view === "grid" && ` (${services.length})`}
					{view === "edit" && " — Editing"}
				</h2>
				<div style={{ display: "flex", gap: 10 }}>
					{isFormView && (
						<button
							type="button"
							onClick={() => setView("grid")}
							style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9, cursor: "pointer", background: "rgba(51,65,85,0.4)", border: "1px solid rgba(51,65,85,0.6)", color: "#94A3B8" }}
						>
							← Back to Grid
						</button>
					)}
					{view === "grid" && (
						<button type="button" className="dash-btn-primary" onClick={openAdd}>
							+ New Service
						</button>
					)}
				</div>
			</div>

			{ConfirmDialog}

			{/* ── Grid View ── */}
			{view === "grid" && (
				<>
					{loading ? (
						<p style={{ color: "#64748B", fontSize: 14 }}>Loading services…</p>
					) : services.length === 0 ? (
						<div className="dash-panel" style={{ textAlign: "center", padding: "60px 24px", color: "#64748B" }}>
							<div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
							<h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No services yet</h3>
							<p style={{ fontSize: 14, color: "#94A3B8" }}>Click &quot;+ New Service&quot; to add your first offering.</p>
						</div>
					) : (
						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
							{services.map((service) => (
								<ServiceCard
									key={service.id}
									service={service}
									onEdit={openEdit}
									onTogglePublish={handleTogglePublish}
									onDelete={handleDelete}
								/>
							))}
						</div>
					)}
				</>
			)}

			{/* ── Add / Edit Form ── */}
			{isFormView && (
				<form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
					{/* Basic Info */}
					<div className="dash-panel" style={{ display: "grid", gap: 16 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>Basic Information</h3>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div>
								<label style={labelStyle}>Service Name *</label>
								<input
									value={form.name}
									onChange={(e) => handleNameChange(e.target.value)}
									style={inputStyle}
									placeholder="e.g. API Penetration Testing"
									required
								/>
							</div>
							<div>
								<label style={labelStyle}>Slug *</label>
								<input
									value={form.slug}
									onChange={(e) => handleFormChange("slug", e.target.value)}
									style={{ ...inputStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}
									placeholder="api-pt"
									required
								/>
							</div>
						</div>

						<div>
							<label style={labelStyle}>Short Description * <span style={{ color: "#64748B", fontWeight: 400 }}>(card tagline)</span></label>
							<input
								value={form.shortDescription}
								onChange={(e) => handleFormChange("shortDescription", e.target.value)}
								style={inputStyle}
								placeholder="One-liner shown on cards…"
								required
							/>
						</div>

						<div>
							<label style={labelStyle}>Full Description *</label>
							<textarea
								value={form.description}
								onChange={(e) => handleFormChange("description", e.target.value)}
								style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
								placeholder="Detailed description of the service…"
								required
							/>
						</div>

						<div>
							<label style={labelStyle}>Overview * <span style={{ color: "#64748B", fontWeight: 400 }}>(shown on service page)</span></label>
							<textarea
								value={form.overview}
								onChange={(e) => handleFormChange("overview", e.target.value)}
								style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
								placeholder="What this service covers, who it's for…"
								required
							/>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
							<div>
								<label style={labelStyle}>Price (₹)</label>
								<input
									type="number"
									value={form.price}
									onChange={(e) => handleFormChange("price", e.target.value)}
									style={inputStyle}
									placeholder="50000"
									min={0}
								/>
							</div>
							<div>
								<label style={labelStyle}>Duration</label>
								<input
									value={form.duration}
									onChange={(e) => handleFormChange("duration", e.target.value)}
									style={inputStyle}
									placeholder="2-4 weeks"
								/>
							</div>
							<div>
								<label style={labelStyle}>Icon key</label>
								<input
									value={form.icon}
									onChange={(e) => handleFormChange("icon", e.target.value)}
									style={inputStyle}
									placeholder="shield"
								/>
							</div>
						</div>

						<div>
							<label style={labelStyle}>Cover Image URL</label>
							<input
								value={form.image}
								onChange={(e) => handleFormChange("image", e.target.value)}
								style={inputStyle}
								placeholder="https://…"
								type="url"
							/>
							{form.image && (
								<div style={{ marginTop: 8, height: 100, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(51,65,85,0.4)" }}>
									<img src={form.image} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
								</div>
							)}
						</div>

						<div>
							<label style={labelStyle}>PDF URL <span style={{ color: "#64748B", fontWeight: 400 }}>(optional brochure)</span></label>
							<input
								value={form.pdfUrl}
								onChange={(e) => handleFormChange("pdfUrl", e.target.value)}
								style={inputStyle}
								placeholder="https://…"
								type="url"
							/>
						</div>
					</div>

					{/* Detailed Content */}
					<div className="dash-panel" style={{ display: "grid", gap: 16 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>Service Details</h3>

						<ListInput label="Methodology Steps" value={form.methodology} onChange={(v) => handleFormChange("methodology", v)} placeholder="Reconnaissance&#10;Threat Modelling&#10;Exploitation" />
						<ListInput label="Scope Items" value={form.scope} onChange={(v) => handleFormChange("scope", v)} placeholder="REST APIs&#10;GraphQL endpoints" />
						<ListInput label="Deliverables" value={form.deliverables} onChange={(v) => handleFormChange("deliverables", v)} placeholder="Executive Report&#10;Technical Report" />
						<ListInput label="Standards" value={form.standards} onChange={(v) => handleFormChange("standards", v)} placeholder="OWASP Top 10&#10;CERT-In" />
						<ListInput label="Sample Findings" value={form.sampleFindings} onChange={(v) => handleFormChange("sampleFindings", v)} placeholder="SQL Injection&#10;Broken Auth" />
					</div>

					{/* Publish */}
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						<label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#CBD5E1" }}>
							<input
								type="checkbox"
								checked={form.isPublished}
								onChange={(e) => handleFormChange("isPublished", e.target.checked)}
								style={{ accentColor: "#818CF8", width: 16, height: 16 }}
							/>
							{view === "edit" ? "Published" : "Publish immediately"}
						</label>
					</div>

					<button
						type="submit"
						className="dash-btn-primary"
						disabled={submitting}
						style={{ width: "fit-content" }}
					>
						{submitting
							? view === "edit" ? "Saving…" : "Creating…"
							: view === "edit" ? "Save Changes" : form.isPublished ? "Publish Service" : "Save as Draft"}
					</button>
				</form>
			)}
		</div>
	);
}
