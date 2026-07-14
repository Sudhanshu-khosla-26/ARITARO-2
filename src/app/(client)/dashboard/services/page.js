"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyRequestsPage() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [selectedReports, setSelectedReports] = useState([]);
	const [loadingReports, setLoadingReports] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(5);

	// Fetch requests
	const loadRequests = async () => {
		try {
			const res = await fetch("/api/service-requests");
			const payload = await res.json();
			if (payload.success) {
				setRequests(payload.requests);
			}
		} catch (err) {
			console.error("Failed to load requests:", err);
			toast.error("Error loading service requests");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadRequests();
	}, []);

	// Fetch reports for selected request
	const loadReports = async (reqId) => {
		setLoadingReports(true);
		try {
			const res = await fetch(`/api/service-requests/${reqId}/reports`);
			const payload = await res.json();
			if (payload.success) {
				setSelectedReports(payload.reports);
			}
		} catch (err) {
			console.error("Failed to load reports:", err);
		} finally {
			setLoadingReports(false);
		}
	};

	const handleSelectRequest = (req) => {
		setSelectedRequest(req);
		loadReports(req.id);
	};

	const handleAcknowledgeAndClose = async (reqId) => {
		try {
			const res = await fetch(`/api/service-requests/${reqId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "closed" }),
			});
			const payload = await res.json();
			if (payload.success) {
				toast.success("Request acknowledged and successfully closed!");
				setSelectedRequest(null);
				loadRequests();
			} else {
				toast.error(payload.message || "Failed to update status");
			}
		} catch (err) {
			console.error("Error closing request:", err);
			toast.error("Failed to close request");
		}
	};

	if (loading) {
		return (
			<div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<div style={{ width: 30, height: 30, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
			</div>
		);
	}

	const filteredRequests = requests.filter(r => {
		const query = searchQuery.toLowerCase();
		return (
			(r.ticket_ref || "").toLowerCase().includes(query) ||
			(r.service_type || "").toLowerCase().includes(query) ||
			(r.status || "").toLowerCase().includes(query) ||
			(r.priority || "").toLowerCase().includes(query)
		);
	});

	const visibleRequests = filteredRequests.slice(0, visibleCount);

	return (
		<main className="dash-main" style={{ background: "#090D16" }}>
			<div className="dash-content">
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E293B", paddingBottom: 16, marginBottom: 24 }}>
					<div>
						<h1 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC" }}>My Service Requests</h1>
						<p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>Manage and track offensive security assessments for your company</p>
					</div>
					<Link
						href="/request-assessment"
						style={{
							background: "linear-gradient(135deg, #6366F1, #818CF8)",
							color: "#fff",
							padding: "10px 20px",
							borderRadius: 8,
							fontWeight: 600,
							fontSize: 13,
							textDecoration: "none",
						}}
					>
						+ Request Assessment
					</Link>
				</div>

				<div className={selectedRequest ? "client-service-details-grid" : ""} style={{ display: "grid", gridTemplateColumns: selectedRequest ? undefined : "1fr", gap: 24 }}>
					
					{/* Left: Requests Table */}
					<div style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 16, padding: 24 }}>
						<h2 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", marginBottom: 16 }}>All Requests</h2>
						
						{/* Search Input Box */}
						<div style={{ marginBottom: 20, position: "relative" }}>
							<input
								type="text"
								placeholder="Search requests by ticket ref, service, status..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setVisibleCount(5);
								}}
								style={{
									width: "100%",
									padding: "12px 16px 12px 42px",
									background: "rgba(255,255,255,0.02)",
									border: "1px solid var(--border-subtle)",
									borderRadius: 10,
									color: "#F1F5F9",
									fontSize: 14,
									outline: "none",
									boxSizing: "border-box"
								}}
							/>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#64748B"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
							>
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
						</div>

						{filteredRequests.length === 0 ? (
							<p style={{ color: "#64748B", textAlign: "center", padding: "32px 0", fontSize: 14 }}>No requests found.</p>
						) : (
							<>
								{/* Desktop Table View */}
								<div className="desktop-only-table" style={{ overflowX: "auto" }}>
									<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
										<thead>
											<tr style={{ borderBottom: "1px solid #1E293B" }}>
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>TICKET REF</th>
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>SERVICE TYPE</th>
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>STATUS</th>
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>PRIORITY</th>
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>ACTIONS</th>
											</tr>
										</thead>
										<tbody>
											{visibleRequests.map((r) => (
												<tr key={r.id} style={{ borderBottom: "1px solid rgba(30,41,59,0.5)", fontSize: 13.5 }}>
													<td style={{ padding: "14px 8px", fontWeight: 700, color: "#F1F5F9" }}>{r.ticket_ref || ""}</td>
													<td style={{ padding: "14px 8px", color: "#CBD5E1" }}>{(r.service_type || "").toUpperCase().replace("_", " ")}</td>
													<td style={{ padding: "14px 8px" }}>
														<span style={{
															fontSize: 10,
															fontWeight: 700,
															padding: "3px 8px",
															borderRadius: 4,
															background: (r.status || "") === "closed" ? "rgba(74,222,128,0.1)" : (r.status || "") === "in_progress" ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)",
															color: (r.status || "") === "closed" ? "#4ADE80" : (r.status || "") === "in_progress" ? "#818CF8" : "#FBBF24",
															border: `1px solid ${(r.status || "") === "closed" ? "rgba(74,222,128,0.2)" : (r.status || "") === "in_progress" ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
															textTransform: "uppercase"
														}}>
															{(r.status || "").replace("_", " ")}
														</span>
													</td>
													<td style={{ padding: "14px 8px" }}>
														<span style={{
															fontSize: 11,
															fontWeight: 600,
															color: (r.priority || "") === "critical" || (r.priority || "") === "high" ? "#EF4444" : "#94A3B8"
														}}>
															{(r.priority || "").toUpperCase()}
														</span>
													</td>
													<td style={{ padding: "14px 8px" }}>
														<button
															onClick={() => handleSelectRequest(r)}
															style={{
																background: "rgba(99,102,241,0.1)",
																border: "1px solid rgba(99,102,241,0.2)",
																color: "#818CF8",
																fontSize: 11.5,
																padding: "6px 12px",
																borderRadius: 6,
																cursor: "pointer",
																fontWeight: 600
															}}
														>
															Track Request
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Mobile Card List View */}
								<div className="mobile-only-list" style={{ display: "none", flexDirection: "column", gap: 16 }}>
									{visibleRequests.map((r) => (
										<div
											key={r.id}
											style={{
												padding: 16,
												background: "rgba(255,255,255,0.02)",
												border: "1px solid var(--border-subtle)",
												borderRadius: 12,
												display: "flex",
												flexDirection: "column",
												gap: 12
											}}
										>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
												<span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 14 }}>{r.ticket_ref || ""}</span>
												<span style={{
													fontSize: 10,
													fontWeight: 700,
													padding: "2px 8px",
													borderRadius: 4,
													background: (r.status || "") === "closed" ? "rgba(74,222,128,0.1)" : (r.status || "") === "in_progress" ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)",
													color: (r.status || "") === "closed" ? "#4ADE80" : (r.status || "") === "in_progress" ? "#818CF8" : "#FBBF24",
													border: `1px solid ${(r.status || "") === "closed" ? "rgba(74,222,128,0.2)" : (r.status || "") === "in_progress" ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
													textTransform: "uppercase"
												}}>
													{(r.status || "").replace("_", " ")}
												</span>
											</div>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
												<span style={{ color: "#CBD5E1" }}>{(r.service_type || "").toUpperCase().replace("_", " ")}</span>
												<span style={{
													fontWeight: 600,
													color: (r.priority || "") === "critical" || (r.priority || "") === "high" ? "#EF4444" : "#94A3B8"
												}}>
													{(r.priority || "").toUpperCase()}
												</span>
											</div>
											<button
												onClick={() => handleSelectRequest(r)}
												style={{
													width: "100%",
													background: "rgba(99,102,241,0.1)",
													border: "1px solid rgba(99,102,241,0.2)",
													color: "#818CF8",
													fontSize: 13,
													padding: "10px",
													borderRadius: 8,
													cursor: "pointer",
													fontWeight: 600
												}}
											>
												Track Request
											</button>
										</div>
									))}
								</div>

								{/* Load More Pagination */}
								{filteredRequests.length > visibleCount && (
									<div style={{ marginTop: 20, textAlign: "center" }}>
										<span style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 8 }}>
											Showing {Math.min(visibleCount, filteredRequests.length)} of {filteredRequests.length} requests
										</span>
										<button
											onClick={() => setVisibleCount(prev => prev + 5)}
											style={{
												background: "rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border-subtle)",
												color: "#E2E8F0",
												fontSize: 13,
												padding: "8px 24px",
												borderRadius: 8,
												cursor: "pointer",
												fontWeight: 600,
												transition: "all 0.2s"
											}}
											onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
											onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
										>
											Load More
										</button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Right: Expandable Details & Reports */}
					{selectedRequest && (
						<div style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 16, padding: 24 }}>
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1E293B", paddingBottom: 12, marginBottom: 16 }}>
								<h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{selectedRequest.ticket_ref}</h3>
								<button
									onClick={() => setSelectedRequest(null)}
									style={{ background: "none", border: "none", color: "#64748B", fontSize: 18, cursor: "pointer" }}
								>
									&times;
								</button>
							</div>

							<div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13.5, color: "#CBD5E1" }}>
								<div style={{ background: "rgba(34, 197, 94, 0.04)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<div>
										<span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>Need to discuss scoping?</span>
										<span style={{ fontSize: 11, color: "#64748B" }}>Chat with our audit team on WhatsApp</span>
									</div>
									<a
										href="https://wa.me/919625894393"
										target="_blank"
										rel="noopener noreferrer"
										style={{
											fontSize: 11,
											padding: "6px 12px",
											background: "#22C55E",
											color: "#FFF",
											borderRadius: 6,
											textDecoration: "none",
											fontWeight: 700,
											display: "inline-flex",
											alignItems: "center",
										}}
									>
										💬 Chat
									</a>
								</div>
								
								<div>
									<strong style={{ color: "#64748B", display: "block", fontSize: 11.5, textTransform: "uppercase" }}>Target Environment:</strong>
									<span style={{ fontFamily: "var(--font-mono)", color: "#22D3EE" }}>{selectedRequest.target_environment}</span>
								</div>
								<div>
									<strong style={{ color: "#64748B", display: "block", fontSize: 11.5, textTransform: "uppercase" }}>Scope Details:</strong>
									<p style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{selectedRequest.scope_description}</p>
								</div>
								{selectedRequest.business_justification && (
									<div>
										<strong style={{ color: "#64748B", display: "block", fontSize: 11.5, textTransform: "uppercase" }}>Business Justification:</strong>
										<p style={{ margin: "4px 0 0", lineHeight: 1.5 }}>{selectedRequest.business_justification}</p>
									</div>
								)}
								
								<div style={{ borderTop: "1px solid #1E293B", paddingTop: 14, marginTop: 4 }}>
									<strong style={{ color: "#F8FAFC", display: "block", fontSize: 13, marginBottom: 10 }}>Released Reports</strong>
									{loadingReports ? (
										<p style={{ fontSize: 12, color: "#64748B" }}>Loading reports...</p>
									) : selectedReports.length === 0 ? (
										<p style={{ fontSize: 12, color: "#64748B" }}>No reports have been released to you yet.</p>
									) : (
										<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
											{selectedReports.map((rep) => (
												<div key={rep.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid #1E293B", padding: 10, borderRadius: 8 }}>
													<div>
														<div style={{ fontSize: 12, fontWeight: 700, color: "#F8FAFC" }}>{rep.original_filename}</div>
														<span style={{ fontSize: 10, color: "#64748B" }}>Version {rep.version}</span>
													</div>
													<a href={rep.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#818CF8", fontWeight: 600, textDecoration: "none" }}>Download</a>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Acknowledge Action */}
								{selectedRequest.status === "report_delivered" && (
									<div style={{ borderTop: "1px solid #1E293B", paddingTop: 16, marginTop: 12 }}>
										<p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 12 }}>
											Please review the uploaded report. If you are satisfied, confirm acknowledgement to close this service request.
										</p>
										<button
											onClick={() => handleAcknowledgeAndClose(selectedRequest.id)}
											style={{
												width: "100%",
												background: "linear-gradient(135deg, #10B981, #059669)",
												color: "#fff",
												border: "none",
												padding: "10px",
												borderRadius: 8,
												fontWeight: 700,
												fontSize: 13,
												cursor: "pointer",
											}}
										>
											Acknowledge & Close Request
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
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
		</main>
	);
}
