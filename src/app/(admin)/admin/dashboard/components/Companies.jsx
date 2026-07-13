"use client";

import { useState, useEffect } from "react";
import { getCompanyDetail } from "@/actions/admin.actions";
import { toast } from "sonner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FileUpload from "@/components/kokonutui/file-upload";

const STAGES = [
	"submitted",
	"under_review",
	"scoped",
	"quoted",
	"assigned",
	"in_progress",
	"internal_qa",
	"report_delivered",
	"client_review",
	"closed",
];

const PAGE_SIZE = 10;

export default function Companies({ clients, onSelectRequest }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const selectedCompanyId = searchParams.get("companyId") || null;
	const selectedRequestId = searchParams.get("requestId") || null;

	const [companyData, setCompanyData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	// Local request workspace states (allows managing one request at a time inside company registry)
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [requestReports, setRequestReports] = useState([]);
	const [loadingReports, setLoadingReports] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [file, setFile] = useState(null);
	const [adminNotes, setAdminNotes] = useState("");
	const [visibleReportsCount, setVisibleReportsCount] = useState(2);

	useEffect(() => {
		if (selectedCompanyId) {
			const loadInitData = async () => {
				setLoading(true);
				try {
					const res = await getCompanyDetail(selectedCompanyId);
					if (res.success) {
						setCompanyData(res);
					} else {
						toast.error(res.error || "Failed to load company details");
					}
				} catch (err) {
					console.error("Error loading company detail:", err);
					toast.error("Failed to load company details");
				} finally {
					setLoading(false);
				}
			};
			loadInitData();
		} else {
			setCompanyData(null);
		}
	}, [selectedCompanyId]);

	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [searchQuery]);

	useEffect(() => {
		if (selectedRequestId) {
			loadRequestDetailsAndReports(selectedRequestId);
		} else {
			setSelectedRequest(null);
			setRequestReports([]);
		}
	}, [selectedRequestId]);

	const handleViewCompany = (companyId) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("companyId", companyId);
		params.delete("requestId");
		router.replace(`${pathname}?${params.toString()}`);
	};

	const loadRequestDetailsAndReports = async (reqId) => {
		setLoadingReports(true);
		try {
			const resDetail = await fetch(`/api/service-requests/${reqId}`);
			const payloadDetail = await resDetail.json();
			if (payloadDetail.success) {
				setSelectedRequest(payloadDetail.request);
			}

			const resReports = await fetch(`/api/service-requests/${reqId}/reports`);
			const payloadReports = await resReports.json();
			if (payloadReports.success) {
				setRequestReports(payloadReports.reports);
			}
		} catch (err) {
			console.error("Failed to load request details/reports:", err);
			toast.error("Failed to load reports");
		} finally {
			setLoadingReports(false);
		}
	};

	const handleSelectRequestLocal = (reqId) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("requestId", reqId);
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleUpdateStatusLocal = async (reqId, newStatus) => {
		try {
			const res = await fetch(`/api/service-requests/${reqId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success(`Status updated to ${newStatus.toUpperCase()}`);
				loadRequestDetailsAndReports(reqId);
				if (selectedCompanyId) {
					// Refresh company data to update status badges in engagements list
					const resCompany = await getCompanyDetail(selectedCompanyId);
					if (resCompany.success) {
						setCompanyData(resCompany);
					}
				}
			} else {
				toast.error(payload.message || "Failed to update status");
			}
		} catch (err) {
			console.error("Error updating status:", err);
			toast.error("Failed to update status");
		}
	};

	const handleUploadReportLocal = async (e) => {
		e.preventDefault();
		if (!file || !selectedRequest) {
			toast.error("Please select a file to upload");
			return;
		}

		setUploading(true);
		const formData = new FormData();
		formData.set("file", file);
		formData.set("admin_notes", adminNotes);

		try {
			const res = await fetch(`/api/service-requests/${selectedRequest.id}/reports`, {
				method: "POST",
				body: formData,
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success("Report draft uploaded successfully!");
				setFile(null);
				setAdminNotes("");
				loadRequestDetailsAndReports(selectedRequest.id);
				if (selectedCompanyId) {
					const resCompany = await getCompanyDetail(selectedCompanyId);
					if (resCompany.success) {
						setCompanyData(resCompany);
					}
				}
			} else {
				toast.error(payload.message || "Failed to upload report");
			}
		} catch (err) {
			console.error("Report upload error:", err);
			toast.error("Report upload failed");
		} finally {
			setUploading(false);
		}
	};

	const handleReportStatusChangeLocal = async (repId, newReportStatus) => {
		try {
			const res = await fetch(`/api/service-requests/${selectedRequest.id}/reports/${repId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newReportStatus }),
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success(`Report status updated to ${newReportStatus}`);
				loadRequestDetailsAndReports(selectedRequest.id);
				if (selectedCompanyId) {
					const resCompany = await getCompanyDetail(selectedCompanyId);
					if (resCompany.success) {
						setCompanyData(resCompany);
					}
				}
			} else {
				toast.error(payload.message || "Failed to update report status");
			}
		} catch (err) {
			console.error("Error updating report status:", err);
			toast.error("Failed to update report status");
		}
	};

	if (loading) {
		return (
			<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<div style={{ width: 30, height: 30, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
			</div>
		);
	}

	if (selectedCompanyId && companyData) {
		const { company, requests, reports, logs } = companyData;

		// RENDER LOCAL SERVICE ENGAGEMENT WORKSPACE
		if (selectedRequestId && selectedRequest) {
			return (
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1C1F26", paddingBottom: 12 }}>
						<div>
							<h2 style={{ fontSize: 20, fontWeight: 800, color: "#F9FAFB" }}>{selectedRequest.ticket_ref}</h2>
							<p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
								Workspace: {company.company_name} · Service: {selectedRequest.service_type.toUpperCase().replace("_", " ")}
							</p>
						</div>
						<button
							onClick={() => {
								const params = new URLSearchParams(searchParams.toString());
								params.delete("requestId");
								router.replace(`${pathname}?${params.toString()}`);
							}}
							style={{
								background: "rgba(255,255,255,0.05)",
								border: "1px solid #1C1F26",
								color: "#CBD5E1",
								padding: "8px 16px",
								borderRadius: 8,
								cursor: "pointer",
								fontWeight: 600,
								fontSize: 13,
							}}
						>
							← Back to {company.company_name} Profile
						</button>
					</div>

					<div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
						{/* Left Column: Scope & Status details */}
						<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", borderBottom: "1px solid #1C1F26", paddingBottom: 10, margin: 0 }}>Engagement Scope</h3>
							
							<div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13.5, color: "#CBD5E1" }}>
								<div>
									<strong style={{ color: "#6B7280", display: "block", fontSize: 11 }}>TARGET ENVIRONMENT:</strong>
									<span style={{ fontFamily: "var(--font-mono)", color: "#22D3EE" }}>{selectedRequest.target_environment}</span>
								</div>
								<div>
									<strong style={{ color: "#6B7280", display: "block", fontSize: 11 }}>SCOPE DESCRIPTION:</strong>
									<p style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{selectedRequest.scope_description}</p>
								</div>
								{selectedRequest.business_justification && (
									<div>
										<strong style={{ color: "#6B7280", display: "block", fontSize: 11 }}>BUSINESS JUSTIFICATION:</strong>
										<p style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{selectedRequest.business_justification}</p>
									</div>
								)}
								<div>
									<strong style={{ color: "#6B7280", display: "block", fontSize: 11 }}>CONTACT DETAILS:</strong>
									<span style={{ display: "block" }}>POC Name: {selectedRequest.contact_name}</span>
									<span style={{ display: "block" }}>POC Email: {selectedRequest.contact_email}</span>
									{selectedRequest.contact_phone && (
										<div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
											<span>POC Phone: {selectedRequest.contact_phone}</span>
											<a
												href={`https://wa.me/${selectedRequest.contact_phone.replace(/\D/g, "")}`}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: 4,
													fontSize: 10,
													color: "#22C55E",
													background: "rgba(34,197,94,0.08)",
													border: "1px solid rgba(34,197,94,0.2)",
													borderRadius: 6,
													padding: "2px 6px",
													fontWeight: 700,
													textDecoration: "none",
												}}
											>
												💬 WhatsApp
											</a>
										</div>
									)}
								</div>
							</div>

							{/* Workflow dropdown */}
							<div style={{ borderTop: "1px solid #1C1F26", paddingTop: 16, marginTop: 8 }}>
								<strong style={{ color: "#F9FAFB", display: "block", fontSize: 13, marginBottom: 12 }}>Workflow Status Action</strong>
								
								<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
									<select
										value={selectedRequest.status}
										onChange={(e) => handleUpdateStatusLocal(selectedRequest.id, e.target.value)}
										style={{
											flex: 1,
											padding: "10px 14px",
											background: "#020617",
											border: "1px solid #1C1F26",
											borderRadius: 8,
											color: "#F9FAFB",
											fontSize: 13.5,
											outline: "none",
											cursor: "pointer",
											textTransform: "uppercase",
											fontWeight: 600,
										}}
									>
										{STAGES.map((stage) => (
											<option key={stage} value={stage}>
												{stage.toUpperCase().replace("_", " ")}
											</option>
										))}
									</select>

									<button
										onClick={() => handleUpdateStatusLocal(selectedRequest.id, "closed")}
										style={{
											background: "rgba(74,222,128,0.1)",
											border: "1px solid rgba(74,222,128,0.2)",
											color: "#4ADE80",
											fontSize: 12.5,
											padding: "10px 16px",
											borderRadius: 8,
											cursor: "pointer",
											fontWeight: 700,
										}}
									>
										Close Ticket
									</button>
								</div>
							</div>
						</div>

						{/* Right Column: Reports upload & versions list */}
						<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
							{/* Report upload form */}
							<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
								<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16, borderBottom: "1px solid #1C1F26", paddingBottom: 10 }}>Report Deliverables</h3>
								
								<form onSubmit={handleUploadReportLocal} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
									<div>
										<label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>Select Report Findings Draft (PDF, Word, or PPT)</label>
										<FileUpload
											acceptedFileTypes={[
												"application/pdf",
												"application/msword",
												"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
												"application/vnd.ms-powerpoint",
												"application/vnd.openxmlformats-officedocument.presentationml.presentation"
											]}
											currentFile={file}
											onUploadSuccess={(uploadedFile) => setFile(uploadedFile)}
											onFileRemove={() => setFile(null)}
										/>
									</div>

									<div>
										<label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>Admin Notes (Internal)</label>
										<textarea
											rows={3}
											value={adminNotes}
											onChange={(e) => setAdminNotes(e.target.value)}
											placeholder="Draft v1 security assessment findings summary"
											style={{
												width: "100%",
												background: "#020617",
												border: "1px solid #1C1F26",
												borderRadius: 8,
												padding: 10,
												color: "#F9FAFB",
												fontSize: 13,
												outline: "none",
												resize: "vertical",
												boxSizing: "border-box",
											}}
										/>
									</div>

									<button
										type="submit"
										disabled={uploading || !file}
										style={{
											width: "100%",
											padding: 11,
											background: uploading || !file ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4F46E5, #6366F1)",
											color: uploading || !file ? "#6B7280" : "#FFF",
											border: "none",
											borderRadius: 8,
											fontSize: 13.5,
											fontWeight: 700,
											cursor: uploading || !file ? "not-allowed" : "pointer",
											transition: "all 0.2s",
										}}
									>
										{uploading ? "Uploading Draft..." : "Upload Report Version"}
									</button>
								</form>
							</div>

							{/* Report versions list */}
							<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
								<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Report Version History</h3>
								{loadingReports ? (
									<p style={{ color: "#6B7280", fontSize: 12 }}>Loading reports...</p>
								) : requestReports.length === 0 ? (
									<p style={{ color: "#6B7280", fontSize: 12 }}>No reports uploaded for this request yet.</p>
								) : (
									<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
										<div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
											{requestReports.slice(0, visibleReportsCount).map((rep) => (
												<div
													key={rep.id}
													style={{
														padding: 14,
														background: "#151820",
														border: "1px solid #1C1F26",
														borderRadius: 12,
														display: "flex",
														flexDirection: "column",
														gap: 10,
													}}
												>
													<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
														<div>
															<strong style={{ fontSize: 13, color: "#F9FAFB", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{rep.original_filename}</strong>
															<span style={{ fontSize: 11, color: "#6B7280" }}>
																v{rep.version} · Uploaded by {rep.uploaded_by?.name || "Admin"}
															</span>
														</div>
														<a
															href={rep.file_url}
															target="_blank"
															rel="noopener noreferrer"
															style={{
																fontSize: 12,
																color: "#3B82F6",
																fontWeight: 600,
																textDecoration: "none",
															}}
														>
															Open PDF
														</a>
													</div>

													{rep.admin_notes && (
														<p style={{ margin: 0, fontSize: 12, color: "#94A3B8", background: "rgba(255,255,255,0.01)", padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.02)" }}>
															Note: {rep.admin_notes}
														</p>
													)}

													<div style={{ display: "flex", justifySelf: "flex-end", gap: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
														{rep.status === "draft" && (
															<button
																onClick={() => handleReportStatusChangeLocal(rep.id, "internal_review")}
																style={{
																	fontSize: 10.5,
																	background: "rgba(99,102,241,0.1)",
																	border: "1px solid rgba(99,102,241,0.2)",
																	color: "#3B82F6",
																	padding: "4px 8px",
																	borderRadius: 4,
																	cursor: "pointer",
																	fontWeight: 600,
																}}
															>
																Send to Internal QA
															</button>
														)}

														{rep.status === "internal_review" && (
															<button
																onClick={() => handleReportStatusChangeLocal(rep.id, "approved")}
																style={{
																	fontSize: 10.5,
																	background: "rgba(245,158,11,0.1)",
																	border: "1px solid rgba(245,158,11,0.2)",
																	color: "#F59E0B",
																	padding: "4px 8px",
																	borderRadius: 4,
																	cursor: "pointer",
																	fontWeight: 600,
																}}
															>
																Approve Report
															</button>
														)}

														{rep.status === "approved" && (
															<button
																onClick={() => handleReportStatusChangeLocal(rep.id, "released")}
																style={{
																	fontSize: 10.5,
																	background: "rgba(16,185,129,0.1)",
																	border: "1px solid rgba(16,185,129,0.2)",
																	color: "#10B981",
																	padding: "4px 8px",
																	borderRadius: 4,
																	cursor: "pointer",
																	fontWeight: 700,
																}}
															>
																Release findings to Client
															</button>
														)}

														{rep.status === "released" && (
															<span style={{ fontSize: 10.5, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 4 }}>
																✓ RELEASED TO CLIENT
															</span>
														)}
													</div>
												</div>
											))}
										</div>
										{requestReports.length > 2 && (
											<button
												type="button"
												onClick={() => setVisibleReportsCount(prev => prev === 2 ? requestReports.length : 2)}
												style={{
													alignSelf: "center",
													background: "transparent",
													border: "none",
													color: "#3B82F6",
													fontSize: 12,
													fontWeight: 600,
													cursor: "pointer",
													padding: "4px 8px",
													marginTop: 8,
													width: "fit-content"
												}}
											>
												{visibleReportsCount === 2 ? `Show All Versions (${requestReports.length})` : "Show Less"}
											</button>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1C1F26", paddingBottom: 12 }}>
					<div>
						<h2 style={{ fontSize: 20, fontWeight: 800, color: "#F9FAFB" }}>{company.company_name}</h2>
						<p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
							Contact: {company.name} · {company.email} · Industry: {company.industry}
						</p>
					</div>
					<button
						onClick={() => {
							const params = new URLSearchParams(searchParams.toString());
							params.delete("companyId");
							params.delete("requestId");
							router.replace(`${pathname}?${params.toString()}`);
						}}
						style={{
							background: "rgba(255,255,255,0.05)",
							border: "1px solid #1C1F26",
							color: "#CBD5E1",
							padding: "8px 16px",
							borderRadius: 8,
							cursor: "pointer",
							fontWeight: 600,
							fontSize: 13,
						}}
					>
						← Back to Registry
					</button>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
					{/* Left: Requests */}
					<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Service Engagements</h3>
						{requests.length === 0 ? (
							<p style={{ color: "#6B7280", fontSize: 13 }}>No service engagements found for this company.</p>
						) : (
							<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
								{requests.map((r) => (
									<div
										key={r.id}
										style={{
											background: "#151820",
											border: "1px solid #1C1F26",
											borderRadius: 12,
											padding: 16,
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<div>
											<span style={{ fontWeight: 700, color: "#F1F5F9", display: "block" }}>{r.ticket_ref}</span>
											<span style={{ fontSize: 12, color: "#94A3B8" }}>
												{r.service_type.toUpperCase().replace("_", " ")} ({r.engagement_type.replace("_", " ")})
											</span>
										</div>
										<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
											<span style={{
												fontSize: 10,
												fontWeight: 700,
												padding: "3px 8px",
												borderRadius: 4,
												background: r.status === "closed" ? "rgba(74,222,128,0.1)" : "rgba(245,158,11,0.1)",
												color: r.status === "closed" ? "#4ADE80" : "#FBBF24",
												border: `1px solid ${r.status === "closed" ? "rgba(74,222,128,0.2)" : "rgba(245,158,11,0.2)"}`,
												textTransform: "uppercase"
											}}>
												{r.status}
											</span>
											<button
												onClick={() => handleSelectRequestLocal(r.id)}
												style={{
													background: "rgba(99,102,241,0.1)",
													border: "1px solid rgba(99,102,241,0.2)",
													color: "#3B82F6",
													fontSize: 11,
													padding: "6px 12px",
													borderRadius: 6,
													cursor: "pointer",
													fontWeight: 600,
												}}
											>
												Manage Request
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Right: Reports & Activity Logs */}
					<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
						
						{/* Reports */}
						<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Available Reports</h3>
							{reports.length === 0 ? (
								<p style={{ color: "#6B7280", fontSize: 12 }}>No reports uploaded for this company yet.</p>
							) : (
								<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
									{reports.map((rep) => (
										<div
											key={rep.id}
											style={{
												padding: "10px 12px",
												background: "#151820",
												border: "1px solid #1C1F26",
												borderRadius: 8,
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
												<div style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
													{rep.original_filename}
												</div>
												<span style={{ fontSize: 10, color: "#6B7280" }}>
													Ref: {rep.ticket_ref} (v{rep.version}) · Status: {rep.status}
												</span>
											</div>
											<a href={rep.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: "#3B82F6", fontWeight: 600, textDecoration: "none" }}>Open</a>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Activity Timeline */}
						<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Activity Timeline</h3>
							{logs.length === 0 ? (
								<p style={{ color: "#6B7280", fontSize: 12 }}>No activity logged.</p>
							) : (
								<div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 220, overflowY: "auto" }}>
									{logs.map((l) => (
										<div key={l.id} style={{ fontSize: 12, borderLeft: "2px solid #1C1F26", paddingLeft: 12, marginLeft: 4 }}>
											<span style={{ color: "#3B82F6", fontWeight: 600, display: "block" }}>{l.action.toUpperCase().replace(/_/g, " ")}</span>
											<span style={{ color: "#94A3B8" }}>
												Target: {l.target_type} ({l.metadata?.ticket_ref || ""})
											</span>
											<span style={{ color: "#475569", display: "block", fontSize: 10.5, marginTop: 2 }}>
												{new Date(l.createdAt).toLocaleString()}
											</span>
										</div>
									))}
								</div>
							)}
						</div>

					</div>
				</div>
			</div>
		);
	}

	const filteredClients = clients.filter((c) => {
		const nameMatch = (c.company || "").toLowerCase().includes(searchQuery.toLowerCase());
		const contactMatch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase());
		const industryMatch = (c.industry || "").toLowerCase().includes(searchQuery.toLowerCase());
		const emailMatch = (c.email || "").toLowerCase().includes(searchQuery.toLowerCase());
		return nameMatch || contactMatch || industryMatch || emailMatch;
	});

	return (
		<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
				<h2 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", margin: 0 }}>Companies Registry</h2>
				<input
					type="text"
					placeholder="Search companies by name, contact, industry..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{
						padding: "8px 14px",
						background: "rgba(17,19,24,0.5)",
						border: "1px solid #1C1F26",
						borderRadius: 8,
						color: "#F9FAFB",
						fontSize: 13,
						width: 280,
						outline: "none",
						boxSizing: "border-box",
					}}
				/>
			</div>
			{clients.length === 0 ? (
				<p style={{ color: "#6B7280", fontSize: 13 }}>No registered client companies.</p>
			) : filteredClients.length === 0 ? (
				<p style={{ color: "#6B7280", fontSize: 13 }}>No companies match your search query.</p>
			) : (
				<>
					<div style={{ overflowX: "auto" }}>
						<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
							<thead>
								<tr style={{ borderBottom: "1px solid #1C1F26" }}>
									<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Company Name</th>
									<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Industry</th>
									<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Primary Contact</th>
									<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Email</th>
									<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredClients.slice(0, visibleCount).map((c) => (
									<tr key={c.id} style={{ borderBottom: "1px solid rgba(28,31,38,0.4)", fontSize: 13.5 }}>
										<td style={{ padding: "14px 10px", fontWeight: 700, color: "#F9FAFB" }}>{c.company}</td>
										<td style={{ padding: "14px 10px", color: "#CBD5E1" }}>{c.industry}</td>
										<td style={{ padding: "14px 10px", color: "#CBD5E1" }}>{c.name}</td>
										<td style={{ padding: "14px 10px", color: "#6B7280" }}>{c.email}</td>
										<td style={{ padding: "14px 10px", textAlign: "right" }}>
											<button
												onClick={() => handleViewCompany(c.id)}
												style={{
													background: "rgba(59,130,246,0.06)",
													border: "1px solid rgba(59,130,246,0.2)",
													color: "#60A5FA",
													fontSize: 12,
													padding: "6px 12px",
													borderRadius: 6,
													cursor: "pointer",
													fontWeight: 600,
												}}
											>
												View Workspace
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{visibleCount < filteredClients.length && (
						<div style={{ textAlign: "center", marginTop: 20 }}>
							<span style={{ fontSize: 12, color: "#6B7280", marginRight: 12 }}>
								Showing {Math.min(visibleCount, filteredClients.length)} of {filteredClients.length}
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
		</div>
	);
}
