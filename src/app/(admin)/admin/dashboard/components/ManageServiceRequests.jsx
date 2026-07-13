"use client";

import { useState, useEffect } from "react";
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

export default function ManageServiceRequests({ initialSelectedId }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [reports, setReports] = useState([]);
	const [loadingReports, setLoadingReports] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [file, setFile] = useState(null);
	const [adminNotes, setAdminNotes] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [visibleReportsCount, setVisibleReportsCount] = useState(2);

	const loadRequests = async () => {
		try {
			const res = await fetch("/api/service-requests");
			const payload = await res.json();
			if (payload.success) {
				setRequests(payload.requests);
				setVisibleCount(PAGE_SIZE);
				
				// Handle selected request from parent company click
				if (initialSelectedId) {
					const req = payload.requests.find((r) => r.id === initialSelectedId);
					if (req) {
						setSelectedRequest(req);
						loadReports(req.id);
					} else {
						setSelectedRequest(null);
					}
				} else {
					setSelectedRequest(null);
				}
			}
		} catch (err) {
			console.error("Error loading requests:", err);
			toast.error("Failed to load service requests");
		} finally {
			setLoading(false);
		}
	};

	const loadReports = async (reqId) => {
		setLoadingReports(true);
		try {
			const res = await fetch(`/api/service-requests/${reqId}/reports`);
			const payload = await res.json();
			if (payload.success) {
				setReports(payload.reports);
			}
		} catch (err) {
			console.error("Failed to load reports:", err);
		} finally {
			setLoadingReports(false);
		}
	};

	useEffect(() => {
		loadRequests();
	}, [initialSelectedId]);

	const handleSelectRequest = (req) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("requestId", req.id);
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleUpdateStatus = async (reqId, newStatus) => {
		try {
			const res = await fetch(`/api/service-requests/${reqId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success(`Status updated to ${newStatus.toUpperCase()}`);
				loadRequests();
				
				// Keep detail view updated
				setSelectedRequest((prev) => prev ? { ...prev, status: newStatus } : null);
			} else {
				toast.error(payload.message || "Failed to update status");
			}
		} catch (err) {
			console.error("Error updating status:", err);
			toast.error("Failed to update status");
		}
	};

	const handleUploadReport = async (e) => {
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
				loadReports(selectedRequest.id);
				loadRequests(); // Refresh requests as parent status may change
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

	const handleReportStatusChange = async (repId, newReportStatus) => {
		try {
			const res = await fetch(`/api/service-requests/${selectedRequest.id}/reports/${repId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newReportStatus }),
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success(`Report status updated to ${newReportStatus}`);
				loadReports(selectedRequest.id);
				loadRequests();
				
				// Sync parent status details
				if (newReportStatus === "released") {
					setSelectedRequest((prev) => prev ? { ...prev, status: "report_delivered" } : null);
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
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
				<div style={{ width: 30, height: 30, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
			</div>
		);
	}

	if (selectedRequest) {
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1C1F26", paddingBottom: 12 }}>
					<div>
						<h2 style={{ fontSize: 20, fontWeight: 800, color: "#F9FAFB" }}>{selectedRequest.ticket_ref}</h2>
						<p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
							Workspace: {selectedRequest.company_name} · Service: {selectedRequest.service_type.toUpperCase().replace("_", " ")}
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
						← Back to Global Service Requests
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

						{/* Workflow Status Controls */}
						<div style={{ borderTop: "1px solid #1C1F26", paddingTop: 16, marginTop: 8 }}>
							<strong style={{ color: "#F9FAFB", display: "block", fontSize: 13, marginBottom: 12 }}>Workflow Status Action</strong>
							
							<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
								<select
									value={selectedRequest.status}
									onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
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
									onClick={() => handleUpdateStatus(selectedRequest.id, "closed")}
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

					{/* Right Column: Report Upload & Deliverables */}
					<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
						{/* Report Upload Form */}
						<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16, borderBottom: "1px solid #1C1F26", paddingBottom: 10 }}>Report Deliverables</h3>
							
							<form onSubmit={handleUploadReport} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

						{/* Report Version History */}
						<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 16 }}>Report Version History</h3>
							{loadingReports ? (
								<p style={{ color: "#6B7280", fontSize: 12 }}>Loading reports...</p>
							) : reports.length === 0 ? (
								<p style={{ color: "#6B7280", fontSize: 12 }}>No reports uploaded for this request yet.</p>
							) : (
								<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
									<div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
										{reports.slice(0, visibleReportsCount).map((rep) => (
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
															v{rep.version} · Uploaded by {rep.uploaded_by_name || "Admin"}
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
															onClick={() => handleReportStatusChange(rep.id, "internal_review")}
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
															onClick={() => handleReportStatusChange(rep.id, "approved")}
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
															onClick={() => handleReportStatusChange(rep.id, "released")}
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
									{reports.length > 2 && (
										<button
											type="button"
											onClick={() => setVisibleReportsCount(prev => prev === 2 ? reports.length : 2)}
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
											{visibleReportsCount === 2 ? `Show All Versions (${reports.length})` : "Show Less"}
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
		<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24, overflowX: "auto" }}>
			<h2 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>Global Service Requests</h2>
			{requests.length === 0 ? (
				<p style={{ color: "#6B7280", fontSize: 13 }}>No requests received yet.</p>
			) : (
				<>
					<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
						<thead>
							<tr style={{ borderBottom: "1px solid #1C1F26" }}>
								<th style={{ padding: "12px 8px", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>TICKET</th>
								<th style={{ padding: "12px 8px", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>COMPANY</th>
								<th style={{ padding: "12px 8px", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>SERVICE</th>
								<th style={{ padding: "12px 8px", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>STATUS</th>
								<th style={{ padding: "12px 8px", fontSize: 11, color: "#6B7280", fontWeight: 600, textAlign: "right" }}>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{requests.slice(0, visibleCount).map((r) => (
								<tr key={r.id} style={{ borderBottom: "1px solid rgba(51,65,85,0.2)", fontSize: 13.5 }}>
									<td style={{ padding: "14px 8px", fontWeight: 700, color: "#F9FAFB" }}>{r.ticket_ref}</td>
									<td style={{ padding: "14px 8px", color: "#CBD5E1" }}>{r.company_name}</td>
									<td style={{ padding: "14px 8px", color: "#CBD5E1" }}>{r.service_type.toUpperCase().replace("_", " ")}</td>
									<td style={{ padding: "14px 8px" }}>
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
									</td>
									<td style={{ padding: "14px 8px", textAlign: "right" }}>
										<button
											onClick={() => handleSelectRequest(r)}
											style={{
												background: "rgba(99,102,241,0.1)",
												border: "1px solid rgba(99,102,241,0.2)",
												color: "#3B82F6",
												fontSize: 11.5,
												padding: "6px 12px",
												borderRadius: 6,
												cursor: "pointer",
												fontWeight: 600,
											}}
										>
											Track Details
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{visibleCount < requests.length && (
						<div style={{ textAlign: "center", marginTop: 20 }}>
							<span style={{ fontSize: 12, color: "#6B7280", marginRight: 12 }}>
								Showing {Math.min(visibleCount, requests.length)} of {requests.length}
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
