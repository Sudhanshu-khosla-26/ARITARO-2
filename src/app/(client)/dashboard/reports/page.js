"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ReportsPage() {
	const { data: session } = useSession();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadReports = async () => {
			try {
				const res = await fetch("/api/client-dashboard");
				const payload = await res.json();
				if (payload.success) {
					setReports(payload.reports || []);
				}
			} catch (err) {
				console.error("Failed to load reports:", err);
			} finally {
				setLoading(false);
			}
		};
		loadReports();
	}, []);

	if (loading) {
		return (
			<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
				<div style={{ width: 36, height: 36, border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);
	}

	return (
		<main className="dash-main" style={{ flex: 1, padding: "40px 24px", background: "#090D16" }}>
			<div className="dash-content" style={{ maxWidth: 1000, margin: "0 auto" }}>
				
				<div style={{ marginBottom: 32 }}>
					<h1 style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", marginBottom: 6 }}>Security Reports</h1>
					<p style={{ fontSize: 14, color: "#64748B" }}>Access and download final released penetration testing and compliance audit reports.</p>
				</div>

				<div style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 18, overflow: "hidden" }}>
					<div style={{ padding: "20px 24px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<h2 style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>Report Repository</h2>
						<span style={{ fontSize: 12, color: "#818CF8", background: "rgba(99,102,241,0.1)", padding: "4px 10px", borderRadius: 100, fontWeight: 600 }}>
							{reports.length} Total Reports
						</span>
					</div>

					{reports.length === 0 ? (
						<div style={{ textAlign: "center", padding: "80px 20px", color: "#64748B" }}>
							<div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
							<p style={{ fontSize: 15, marginBottom: 6, color: "#94A3B8", fontWeight: 600 }}>No Reports Available</p>
							<p style={{ fontSize: 13, maxWidth: 360, margin: "0 auto" }}>Reports will appear here once the cybersecurity team uploads and releases their final findings.</p>
						</div>
					) : (
							<>
								{/* Desktop Table View */}
								<div className="desktop-only-table" style={{ overflowX: "auto" }}>
									<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
										<thead>
											<tr style={{ borderBottom: "1px solid #1E293B", color: "#64748B", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
												<th style={{ padding: "16px 24px" }}>Report Title</th>
												<th style={{ padding: "16px 24px" }}>Ticket Reference</th>
												<th style={{ padding: "16px 24px" }}>Assessment Type</th>
												<th style={{ padding: "16px 24px" }}>Released Date</th>
												<th style={{ padding: "16px 24px", textAlign: "right" }}>Download</th>
											</tr>
										</thead>
										<tbody>
											{reports.map((rep) => (
												<tr
													key={rep.id}
													style={{
														borderBottom: "1px solid rgba(255,255,255,0.02)",
														color: "#CBD5E1",
														fontSize: 14,
														transition: "background 0.2s",
													}}
													onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.01)"}
													onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
												>
													<td style={{ padding: "16px 24px", fontWeight: 600, color: "#F1F5F9" }}>{rep.original_filename}</td>
													<td style={{ padding: "16px 24px", fontFamily: "var(--font-mono)", fontSize: 13 }}>{rep.ticket_ref}</td>
													<td style={{ padding: "16px 24px" }}>
														<span style={{ fontSize: 11, background: "rgba(99,102,241,0.08)", color: "#818CF8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
															{(rep.service_type || "").toUpperCase().replace("_", " ")}
														</span>
													</td>
													<td style={{ padding: "16px 24px" }}>{rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "-"}</td>
													<td style={{ padding: "16px 24px", textAlign: "right" }}>
														<a
															href={rep.file_url}
															target="_blank"
															rel="noopener noreferrer"
															style={{
																display: "inline-flex",
																alignItems: "center",
																gap: 6,
																padding: "6px 12px",
																background: "rgba(16,185,129,0.1)",
																border: "1px solid rgba(16,185,129,0.2)",
																borderRadius: 8,
																color: "#10B981",
																fontSize: 12,
																fontWeight: 600,
																textDecoration: "none",
																transition: "all 0.2s",
															}}
															onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.2)" }}
															onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)" }}
														>
															Download PDF
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Mobile Card List View */}
								<div className="mobile-only-list" style={{ display: "none", flexDirection: "column", gap: 16, padding: "16px 20px" }}>
									{reports.map((rep) => (
										<div
											key={rep.id}
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
											<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
												<span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 14 }}>{rep.original_filename}</span>
												<span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#64748B" }}>
													Ref: {rep.ticket_ref}
												</span>
											</div>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
												<span style={{ fontSize: 11, background: "rgba(99,102,241,0.08)", color: "#818CF8", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
													{(rep.service_type || "").toUpperCase().replace("_", " ")}
												</span>
												<span style={{ color: "#64748B" }}>
													{rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "-"}
												</span>
											</div>
											<a
												href={rep.file_url}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													width: "100%",
													textAlign: "center",
													display: "inline-block",
													padding: "10px",
													background: "rgba(16,185,129,0.1)",
													border: "1px solid rgba(16,185,129,0.2)",
													borderRadius: 8,
													color: "#10B981",
													fontSize: 13,
													fontWeight: 600,
													textDecoration: "none",
													boxSizing: "border-box"
												}}
											>
												Download PDF
											</a>
										</div>
									))}
								</div>
							</>
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
