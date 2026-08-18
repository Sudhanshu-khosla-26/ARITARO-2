"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
	listJobOpportunities,
	createJobOpportunity,
	removeJobOpportunity,
	togglePublishJobOpportunity,
	listJobApplications,
	updateJobApplicationStatus,
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
			{isPublished ? "Open" : "Closed"}
		</span>
	);
}

export default function ManageCareers() {
	const [jobs, setJobs] = useState([]);
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [applicationsLoading, setApplicationsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [ConfirmDialog, confirm] = useConfirm();

	// Form states
	const [title, setTitle] = useState("");
	const [department, setDepartment] = useState("Offensive Security");
	const [location, setLocation] = useState("Remote / India");
	const [type, setType] = useState("Full-Time");

	const loadJobs = useCallback(async () => {
		setLoading(true);
		const result = await listJobOpportunities();
		if (result.success) {
			setJobs(result.jobs);
		} else {
			toast.error(result.error || "Failed to load careers");
		}
		setLoading(false);
	}, []);

	const loadApplications = useCallback(async () => {
		setApplicationsLoading(true);
		const result = await listJobApplications();
		if (result.success) {
			setApplications(result.applications);
		} else {
			toast.error(result.error || "Failed to load job applications");
		}
		setApplicationsLoading(false);
	}, []);

	useEffect(() => {
		loadJobs();
		loadApplications();
	}, [loadJobs, loadApplications]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || !department || !location) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const formData = new FormData();
		formData.set("title", title);
		formData.set("department", department);
		formData.set("location", location);
		formData.set("type", type);

		const res = await createJobOpportunity(formData);
		if (res.success) {
			toast.success(res.message);
			setShowForm(false);
			loadJobs();
			// Reset fields
			setTitle("");
			setDepartment("Offensive Security");
			setLocation("Remote / India");
			setType("Full-Time");
		} else {
			toast.error(res.error || "Failed to create job opportunity");
		}
	};

	const handleDelete = async (jobId, title) => {
		const ok = await confirm({
			title: "Delete Job Opportunity?",
			description: `Are you sure you want to delete the "${title}" position? This action cannot be undone.`,
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (!ok) return;

		const res = await removeJobOpportunity(jobId);
		if (res.success) {
			toast.success(res.message);
			loadJobs();
		} else {
			toast.error(res.error || "Failed to delete position");
		}
	};

	const handleTogglePublish = async (jobId, currentState) => {
		const res = await togglePublishJobOpportunity(jobId, !currentState);
		if (res.success) {
			toast.success(res.message);
			loadJobs();
		} else {
			toast.error(res.error || "Failed to update position state");
		}
	};

	const handleApplicationStatusChange = async (applicationId, status) => {
		const res = await updateJobApplicationStatus(applicationId, status);
		if (res.success) {
			toast.success("Application status updated");
			loadApplications();
		} else {
			toast.error(res.error || "Failed to update application status");
		}
	};

	return (
		<>
			{ConfirmDialog}
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h2 style={{ fontSize: 20, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Career Opportunities</h2>
					<button
						onClick={() => setShowForm(!showForm)}
						className="btn-primary"
						style={{ padding: "8px 16px", fontSize: 13 }}
					>
						{showForm ? "Cancel" : "Add Opportunity"}
					</button>
				</div>

				{showForm && (
					<form onSubmit={handleSubmit} style={{ background: "rgba(17,24,39,0.4)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
						<h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 8px 0" }}>New Position</h3>
						
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div>
								<label style={labelStyle}>Job Title *</label>
								<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Pentester" style={inputStyle} required />
							</div>
							<div>
								<label style={labelStyle}>Department *</label>
								<select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ ...inputStyle, height: 42 }}>
									<option value="Offensive Security">Offensive Security</option>
									<option value="Research & Development">Research & Development</option>
									<option value="Sales & Scoping">Sales & Scoping</option>
									<option value="Operations">Operations</option>
								</select>
							</div>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div>
								<label style={labelStyle}>Location *</label>
								<input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote / India, Hybrid (Mumbai)" style={inputStyle} required />
							</div>
							<div>
								<label style={labelStyle}>Type *</label>
								<select value={type} onChange={(e) => setType(e.target.value)} style={{ ...inputStyle, height: 42 }}>
									<option value="Full-Time">Full-Time</option>
									<option value="Part-Time">Part-Time</option>
									<option value="Contract">Contract</option>
									<option value="Internship">Internship</option>
								</select>
							</div>
						</div>

						<button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
							Save Position
						</button>
					</form>
				)}

				{loading ? (
					<div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>Loading opportunities...</div>
				) : jobs.length === 0 ? (
					<div style={{ textAlign: "center", padding: 40, border: "1px dashed rgba(51,65,85,0.4)", borderRadius: 14, color: "#6B7280" }}>No opportunities found.</div>
				) : (
					<>
						{/* Desktop Table View */}
						<div className="desktop-only-table" style={{ overflowX: "auto" }}>
							<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
								<thead>
									<tr>
										<th style={thStyle}>Job Title</th>
										<th style={thStyle}>Department</th>
										<th style={thStyle}>Location</th>
										<th style={thStyle}>Type</th>
										<th style={thStyle}>Status</th>
										<th style={thStyle}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{jobs.map((job) => (
										<tr key={job.id} style={{ borderBottom: "1px solid rgba(51,65,85,0.2)" }}>
											<td style={{ ...tdStyle, fontWeight: 600, color: "#fff" }}>{job.title}</td>
											<td style={tdStyle}>{job.department}</td>
											<td style={tdStyle}>{job.location}</td>
											<td style={tdStyle}>{job.type}</td>
											<td style={tdStyle}>
												<StatusBadge isPublished={job.isPublished} />
											</td>
											<td style={tdStyle}>
												<div style={{ display: "flex", gap: 8 }}>
													<button
														onClick={() => handleTogglePublish(job.id, job.isPublished)}
														style={{
															padding: "4px 8px",
															fontSize: 11,
															borderRadius: 4,
															cursor: "pointer",
															background: job.isPublished ? "rgba(100,116,139,0.15)" : "rgba(16,185,129,0.12)",
															border: `1px solid ${job.isPublished ? "rgba(100,116,139,0.3)" : "rgba(16,185,129,0.3)"}`,
															color: job.isPublished ? "#94A3B8" : "#10B981",
														}}
													>
														{job.isPublished ? "Close" : "Open"}
													</button>
													<button
														onClick={() => handleDelete(job.id, job.title)}
														style={{
															padding: "4px 8px",
															fontSize: 11,
															borderRadius: 4,
															cursor: "pointer",
															background: "rgba(239,68,68,0.1)",
															border: "1px solid rgba(239,68,68,0.3)",
															color: "#F87171",
														}}
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Mobile Card List View */}
						<div className="mobile-only-list" style={{ display: "none", flexDirection: "column", gap: 14 }}>
							{jobs.map((job) => (
								<div
									key={job.id}
									style={{
										padding: 16,
										background: "rgba(255,255,255,0.02)",
										border: "1px solid #1C1F26",
										borderRadius: 12,
										display: "flex",
										flexDirection: "column",
										gap: 12
									}}
								>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
										<span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{job.title}</span>
										<StatusBadge isPublished={job.isPublished} />
									</div>
									<div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12.5 }}>
										<div style={{ display: "flex", justifyContent: "space-between" }}>
											<span style={{ color: "#6B7280" }}>Department:</span>
											<span style={{ color: "#CBD5E1" }}>{job.department}</span>
										</div>
										<div style={{ display: "flex", justifyContent: "space-between" }}>
											<span style={{ color: "#6B7280" }}>Location:</span>
											<span style={{ color: "#CBD5E1" }}>{job.location}</span>
										</div>
										<div style={{ display: "flex", justifyContent: "space-between" }}>
											<span style={{ color: "#6B7280" }}>Type:</span>
											<span style={{ color: "#CBD5E1" }}>{job.type}</span>
										</div>
									</div>
									<div style={{ display: "flex", gap: 8, marginTop: 4 }}>
										<button
											onClick={() => handleTogglePublish(job.id, job.isPublished)}
											style={{
												flex: 1,
												padding: "8px",
												fontSize: 12,
												borderRadius: 6,
												cursor: "pointer",
												background: job.isPublished ? "rgba(100,116,139,0.15)" : "rgba(16,185,129,0.12)",
												border: `1px solid ${job.isPublished ? "rgba(100,116,139,0.3)" : "rgba(16,185,129,0.3)"}`,
												color: job.isPublished ? "#94A3B8" : "#10B981",
												fontWeight: 600
											}}
										>
											{job.isPublished ? "Close" : "Open"}
										</button>
										<button
											onClick={() => handleDelete(job.id, job.title)}
											style={{
												flex: 1,
												padding: "8px",
												fontSize: 12,
												borderRadius: 6,
												cursor: "pointer",
												background: "rgba(239,68,68,0.1)",
												border: "1px solid rgba(239,68,68,0.3)",
												color: "#F87171",
												fontWeight: 600
											}}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				<div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h3 style={{ fontSize: 18, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Career Applications</h3>
					</div>

					{applicationsLoading ? (
						<div style={{ textAlign: "center", padding: 24, color: "#6B7280" }}>Loading applications...</div>
					) : applications.length === 0 ? (
						<div style={{ textAlign: "center", padding: 24, border: "1px dashed rgba(51,65,85,0.4)", borderRadius: 14, color: "#6B7280" }}>No job applications found yet.</div>
					) : (
						<div style={{ overflowX: "auto" }}>
							<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
								<thead>
									<tr>
										<th style={thStyle}>Applicant</th>
										<th style={thStyle}>Position</th>
										<th style={thStyle}>Contact</th>
										<th style={thStyle}>Experience</th>
										<th style={thStyle}>Resume</th>
										<th style={thStyle}>Status</th>
									</tr>
								</thead>
								<tbody>
									{applications.map((application) => (
										<tr key={application.id} style={{ borderBottom: "1px solid rgba(51,65,85,0.2)" }}>
											<td style={{ ...tdStyle, verticalAlign: "top", maxWidth: 220 }}>
												<div style={{ fontWeight: 700, color: "#fff" }}>{application.name}</div>
												<div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>{new Date(application.createdAt).toLocaleDateString()}</div>
												{application.coverLetter && (
													<div style={{ color: "#CBD5E1", whiteSpace: "pre-wrap", marginTop: 8, fontSize: 12 }}>{application.coverLetter}</div>
												)}
											</td>
											<td style={{ ...tdStyle, verticalAlign: "top" }}>{application.position}</td>
											<td style={{ ...tdStyle, verticalAlign: "top" }}>
												<div>{application.email}</div>
												{application.phone && <div style={{ marginTop: 4 }}>{application.phone}</div>}
												{application.portfolioUrl && (
													<a href={application.portfolioUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 6, color: "#60A5FA" }}>
														Portfolio
													</a>
												)}
											</td>
											<td style={{ ...tdStyle, verticalAlign: "top" }}>{application.experience || "—"}</td>
											<td style={{ ...tdStyle, verticalAlign: "top" }}>
												{application.resumeUrl ? (
													<a href={application.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "#60A5FA" }}>Open Resume</a>
												) : "—"}
											</td>
											<td style={{ ...tdStyle, verticalAlign: "top" }}>
												<select
													value={application.status}
													onChange={(e) => handleApplicationStatusChange(application.id, e.target.value)}
													style={{
														padding: "6px 10px",
														borderRadius: 6,
														background: "rgba(15,23,42,0.8)",
														color: "#F8FAFC",
														border: "1px solid rgba(51,65,85,0.8)",
													}}
												>
													<option value="new">New</option>
													<option value="reviewing">Reviewing</option>
													<option value="shortlisted">Shortlisted</option>
													<option value="rejected">Rejected</option>
													<option value="hired">Hired</option>
												</select>
											</td>
										</tr>
									))}
								</tbody>
								</table>
							</div>
					)}
				</div>

				<style>{`
					@media (max-width: 768px) {
						.desktop-only-table {
							display: none !important;
						}
						.mobile-only-list {
							display: flex !important;
						}
					}
				`}</style>
			</div>
		</>
	);
}

const thStyle = {
	textAlign: "left",
	padding: "12px 14px",
	fontSize: 11,
	fontWeight: 600,
	color: "#6B7280",
	textTransform: "uppercase",
	letterSpacing: "0.5px",
	borderBottom: "1px solid rgba(28,31,38,0.4)",
};

const tdStyle = {
	padding: "14px 14px",
	fontSize: 13,
	color: "#CBD5E1",
};
