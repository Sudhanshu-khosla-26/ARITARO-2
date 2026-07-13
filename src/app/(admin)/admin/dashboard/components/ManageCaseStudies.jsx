"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
	listCaseStudies,
	createCaseStudy,
	removeCaseStudy,
	togglePublishCaseStudy,
} from "@/actions/admin.actions";

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

export default function ManageCaseStudies() {
	const [cases, setCases] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [ConfirmDialog, confirm] = useConfirm();

	// Form states
	const [industry, setIndustry] = useState("");
	const [type, setType] = useState("");
	const [challenge, setChallenge] = useState("");
	const [findings, setFindings] = useState("");
	const [impact, setImpact] = useState("");
	const [vulns, setVulns] = useState("");
	const [critical, setCritical] = useState("");
	const [remediation, setRemediation] = useState("");
	const [color, setColor] = useState("#3B82F6");

	const loadCases = useCallback(async () => {
		setLoading(true);
		const result = await listCaseStudies();
		if (result.success) {
			setCases(result.cases);
		} else {
			toast.error(result.error || "Failed to load case studies");
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		loadCases();
	}, [loadCases]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!industry || !type || !challenge || !impact) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const formData = new FormData();
		formData.set("industry", industry);
		formData.set("type", type);
		formData.set("challenge", challenge);
		formData.set("findings", findings);
		formData.set("impact", impact);
		formData.set("vulns", vulns);
		formData.set("critical", critical);
		formData.set("remediation", remediation);
		formData.set("color", color);

		const res = await createCaseStudy(formData);
		if (res.success) {
			toast.success(res.message);
			setShowForm(false);
			loadCases();
			// Reset fields
			setIndustry("");
			setType("");
			setChallenge("");
			setFindings("");
			setImpact("");
			setVulns("");
			setCritical("");
			setRemediation("");
			setColor("#3B82F6");
		} else {
			toast.error(res.error || "Failed to create case study");
		}
	};

	const handleDelete = async (caseId, title) => {
		const ok = await confirm({
			title: "Delete Case Study?",
			description: `Are you sure you want to delete the case study for "${title}"? This action cannot be undone.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (!ok) return;

		const res = await removeCaseStudy(caseId);
		if (res.success) {
			toast.success(res.message);
			loadCases();
		} else {
			toast.error(res.error || "Failed to delete case study");
		}
	};

	const handleTogglePublish = async (caseId, currentState) => {
		const res = await togglePublishCaseStudy(caseId, !currentState);
		if (res.success) {
			toast.success(res.message);
			loadCases();
		} else {
			toast.error(res.error || "Failed to update publish state");
		}
	};

	return (
		<>
			{ConfirmDialog}
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h2 style={{ fontSize: 20, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Case Studies</h2>
					<button
						onClick={() => setShowForm(!showForm)}
						className="btn-primary"
						style={{ padding: "8px 16px", fontSize: 13 }}
					>
						{showForm ? "Cancel" : "Add Case Study"}
					</button>
				</div>

				{showForm && (
					<form onSubmit={handleSubmit} style={{ background: "rgba(17,24,39,0.4)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
						<h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 8px 0" }}>New Case Study</h3>
						
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div>
								<label style={labelStyle}>Industry *</label>
								<input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. FinTech, HealthTech" style={inputStyle} required />
							</div>
							<div>
								<label style={labelStyle}>Engagement Type / Title *</label>
								<input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. API Penetration Testing" style={inputStyle} required />
							</div>
						</div>

						<div>
							<label style={labelStyle}>Challenge Description *</label>
							<textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="A Series-B funded FinTech needed API security assessment..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} required />
						</div>

						<div>
							<label style={labelStyle}>Key Findings (One per line)</label>
							<textarea value={findings} onChange={(e) => setFindings(e.target.value)} placeholder="4 Critical IDOR vulnerabilities exposing data&#10;2 High severity auth bypass via JWT confusion" style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
						</div>

						<div>
							<label style={labelStyle}>Business Impact *</label>
							<textarea value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="All critical findings remediated. Passed RBI compliance audit." style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} required />
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
							<div>
								<label style={labelStyle}>Total Vulns Count</label>
								<input type="text" value={vulns} onChange={(e) => setVulns(e.target.value)} placeholder="e.g. 14" style={inputStyle} />
							</div>
							<div>
								<label style={labelStyle}>Critical Vulns Count</label>
								<input type="text" value={critical} onChange={(e) => setCritical(e.target.value)} placeholder="e.g. 4" style={inputStyle} />
							</div>
							<div>
								<label style={labelStyle}>Remediation Time</label>
								<input type="text" value={remediation} onChange={(e) => setRemediation(e.target.value)} placeholder="e.g. 5 days" style={inputStyle} />
							</div>
							<div>
								<label style={labelStyle}>Accent Color</label>
								<select value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inputStyle, height: 42 }}>
									<option value="#3B82F6">Blue (#3B82F6)</option>
									<option value="#6366F1">Indigo (#6366F1)</option>
									<option value="#818CF8">Lavender (#818CF8)</option>
									<option value="#A855F7">Purple (#A855F7)</option>
									<option value="#10B981">Green (#10B981)</option>
									<option value="#22D3EE">Cyan (#22D3EE)</option>
								</select>
							</div>
						</div>

						<button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
							Save Case Study
						</button>
					</form>
				)}

				{loading ? (
					<div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>Loading case studies...</div>
				) : cases.length === 0 ? (
					<div style={{ textAlign: "center", padding: 40, border: "1px dashed rgba(51,65,85,0.4)", borderRadius: 14, color: "#6B7280" }}>No case studies found.</div>
				) : (
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
						{cases.map((c) => (
							<div key={c.id} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.5)", borderLeft: `4px solid ${c.color}`, borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
									<span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${c.color}15`, color: c.color }}>{c.industry}</span>
									<StatusBadge isPublished={c.isPublished} />
								</div>
								<h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{c.type}</h4>
								<p style={{ fontSize: 12, color: "#94A3B8", margin: 0, lineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>{c.challenge}</p>
								
								<div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 10 }}>
									<button
										onClick={() => handleTogglePublish(c.id, c.isPublished)}
										style={{
											flex: 1,
											padding: "6px 0",
											fontSize: 12,
											borderRadius: 6,
											cursor: "pointer",
											background: c.isPublished ? "rgba(100,116,139,0.15)" : "rgba(16,185,129,0.12)",
											border: `1px solid ${c.isPublished ? "rgba(100,116,139,0.3)" : "rgba(16,185,129,0.3)"}`,
											color: c.isPublished ? "#94A3B8" : "#10B981",
										}}
									>
										{c.isPublished ? "Draft" : "Publish"}
									</button>
									<button
										onClick={() => handleDelete(c.id, `${c.industry} - ${c.type}`)}
										style={{
											padding: "6px 12px",
											fontSize: 12,
											borderRadius: 6,
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
						))}
					</div>
				)}
			</div>
		</>
	);
}
