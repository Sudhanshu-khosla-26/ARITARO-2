"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── SVG Icon Components ── */
const Icons = {
	requests: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	),
	shield: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="M9 12l2 2 4-4" />
		</svg>
	),
	report: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
	),
	alert: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	),
	logout: (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" y1="12" x2="9" y2="12" />
		</svg>
	),
	arrow: (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	),
};

const iconBgs = {
	requests: { bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
	shield: { bg: "rgba(34,211,238,0.12)", color: "#22D3EE" },
	report: { bg: "rgba(74,222,128,0.12)", color: "#4ADE80" },
	alert: { bg: "rgba(251,191,36,0.12)", color: "#FBBF24" },
};

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const user = session?.user || null;

	const [dashboardData, setDashboardData] = useState(null);
	const [loading, setLoading] = useState(true);

	// Redirect Admins
	useEffect(() => {
		if (status === "authenticated" && user?.role === "admin") {
			router.replace("/admin/dashboard");
		}
	}, [status, user, router]);

	// Fetch Real Dashboard Data
	useEffect(() => {
		const loadDashboard = async () => {
			if (!user || user.role === "admin") return;
			try {
				const res = await fetch("/api/client-dashboard");
				const payload = await res.json();
				if (payload.success) {
					setDashboardData(payload);
				}
			} catch (err) {
				console.error("Failed to load client dashboard:", err);
			} finally {
				setLoading(false);
			}
		};
		loadDashboard();
	}, [user]);

	if (status === "loading" || loading || !user) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#020617",
				}}
			>
				<div
					style={{
						width: 36,
						height: 36,
						border: "3px solid rgba(99,102,241,0.2)",
						borderTopColor: "#6366F1",
						borderRadius: "50%",
						animation: "spin 0.7s linear infinite",
					}}
				/>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);
	}

	const statsData = dashboardData?.stats || {
		totalRequests: 0,
		activeRequests: 0,
		reportsDelivered: 0,
		pendingReviews: 0,
		complianceScore: 100,
		uptime: "99.97%",
	};

	const requests = dashboardData?.requests || [];
	const reports = dashboardData?.reports || [];

	const statsCards = [
		{
			label: "Total Requests",
			value: statsData.totalRequests,
			trend: "All submissions",
			icon: "requests",
			color: "#6366F1",
		},
		{
			label: "Active Engagements",
			value: statsData.activeRequests,
			trend: "In progress VAPT",
			icon: "shield",
			color: "#22D3EE",
		},
		{
			label: "Reports Delivered",
			value: statsData.reportsDelivered,
			trend: "Released reports",
			icon: "report",
			color: "#4ADE80",
		},
		{
			label: "Pending Action",
			value: statsData.pendingReviews,
			trend: "Requires review",
			icon: "alert",
			color: "#FBBF24",
		},
	];

	return (
		<main className="dash-main">
			<div className="dash-main-bg" style={{ background: "#090D16" }} />
			<div className="dash-content">
				
				{/* Header */}
				<div className="dash-header dash-animate dash-animate-1" style={{ borderBottom: "1px solid #1E293B", paddingBottom: 20 }}>
					<div className="dash-header-left">
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								background: "rgba(99,102,241,0.08)",
								border: "1px solid rgba(99,102,241,0.2)",
								borderRadius: 100,
								padding: "4px 14px",
								marginBottom: 12,
							}}
							className="dash-operational-badge"
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#4ADE80",
									boxShadow: "0 0 8px rgba(74,222,128,0.7)",
									animation: "pulse-glow 2s ease-in-out infinite",
								}}
							/>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: 10,
									letterSpacing: "2px",
									color: "#4ADE80",
									fontWeight: 600,
								}}
							>
								{statsData.activeRequests > 0 ? "AUDITING ACTIVE" : "SYSTEM SECURED"}
							</span>
						</div>
						<h1 style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC" }}>
							Welcome, <span style={{ color: "#818CF8" }}>{user.name}</span>
						</h1>
						<p style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>
							Client Portal · <strong>{user.company_name || user.company || "Enterprise Account"}</strong> · {user.email}
						</p>
					</div>
					<div className="dash-header-actions" style={{ display: "flex", gap: 12 }}>
						<Link
							href="/request-assessment"
							className="dash-btn-primary"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								textDecoration: "none",
								background: "linear-gradient(135deg, #6366F1, #818CF8)",
								color: "#fff",
								padding: "10px 20px",
								borderRadius: 8,
								fontWeight: 600,
								fontSize: 13,
							}}
						>
							Request Assessment {Icons.arrow}
						</Link>
						<button
							onClick={() => signOut({ callbackUrl: "/" })}
							className="dash-btn-danger"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								border: "1px solid rgba(239, 68, 68, 0.2)",
								background: "rgba(239, 68, 68, 0.05)",
								color: "#EF4444",
								padding: "10px 20px",
								borderRadius: 8,
								fontWeight: 600,
								fontSize: 13,
								cursor: "pointer",
							}}
						>
							{Icons.logout} Logout
						</button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, margin: "24px 0" }}>
					{statsCards.map((s, i) => (
						<div
							key={i}
							className={`dash-stat-card dash-animate dash-animate-${i + 2}`}
							style={{
								background: "#0E1422",
								border: "1px solid #1E293B",
								borderRadius: 16,
								padding: 20,
								transition: "transform 0.2s ease, border-color 0.2s ease",
							}}
						>
							<div className="dash-stat-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
								<div
									className="dash-stat-icon"
									style={{
										width: 38,
										height: 38,
										borderRadius: 10,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										background: iconBgs[s.icon].bg,
										color: iconBgs[s.icon].color,
									}}
								>
									{Icons[s.icon]}
								</div>
								<span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{s.trend}</span>
							</div>
							<div className="dash-stat-value" style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", fontFamily: "var(--font-mono)" }}>{s.value}</div>
							<div className="dash-stat-label" style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>{s.label}</div>
						</div>
					))}
				</div>

				{/* Panels Grid */}
				<div className="dash-panels dash-animate dash-animate-6">
					
					{/* Recent Requests Panel */}
					<div className="dash-panel" style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 18, padding: 24 }}>
						<div className="dash-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #1E293B", paddingBottom: 12 }}>
							<h2 className="dash-panel-title" style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>Recent Service Requests</h2>
							<Link href="/dashboard/services" style={{ fontSize: 12, color: "#818CF8", textDecoration: "none", fontWeight: 600 }}>
								View All Requests →
							</Link>
						</div>

						{requests.length === 0 ? (
							<div style={{ textAlign: "center", padding: "48px 20px", color: "#64748B" }}>
								<div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
								<p style={{ fontSize: 14, marginBottom: 16 }}>No service requests submitted yet.</p>
								<Link href="/request-assessment" className="dash-btn-outline" style={{ display: "inline-flex", textDecoration: "none", border: "1px solid #1E293B", padding: "8px 16px", borderRadius: 8, color: "#CBD5E1", fontSize: 13 }}>
									Request Assessment
								</Link>
							</div>
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
												<th style={{ padding: "12px 8px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>SUBMITTED</th>
											</tr>
										</thead>
										<tbody>
											{requests.slice(0, 5).map((r) => (
												<tr key={r.id} style={{ borderBottom: "1px solid rgba(30,41,59,0.5)", fontSize: 13.5 }}>
													<td style={{ padding: "14px 8px", fontWeight: 700, color: "#F1F5F9" }}>{r.ticket_ref}</td>
													<td style={{ padding: "14px 8px", color: "#CBD5E1" }}>{r.service_type.toUpperCase().replace("_", " ")}</td>
													<td style={{ padding: "14px 8px" }}>
														<span style={{
															fontSize: 10.5,
															fontWeight: 700,
															padding: "3px 8px",
															borderRadius: 4,
															background: r.status === "closed" ? "rgba(74,222,128,0.1)" : r.status === "in_progress" ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)",
															color: r.status === "closed" ? "#4ADE80" : r.status === "in_progress" ? "#818CF8" : "#FBBF24",
															border: `1px solid ${r.status === "closed" ? "rgba(74,222,128,0.2)" : r.status === "in_progress" ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
															textTransform: "uppercase"
														}}>
															{r.status.replace("_", " ")}
														</span>
													</td>
													<td style={{ padding: "14px 8px" }}>
														<span style={{
															fontSize: 11,
															fontWeight: 600,
															color: r.priority === "critical" || r.priority === "high" ? "#EF4444" : "#94A3B8"
														}}>
															{r.priority.toUpperCase()}
														</span>
													</td>
													<td style={{ padding: "14px 8px", color: "#64748B" }}>
														{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Mobile Card List View */}
								<div className="mobile-only-list" style={{ display: "none", flexDirection: "column", gap: 12 }}>
									{requests.slice(0, 5).map((r) => (
										<div
											key={r.id}
											style={{
												padding: 14,
												background: "rgba(255,255,255,0.02)",
												border: "1px solid var(--border-subtle)",
												borderRadius: 12,
												display: "flex",
												flexDirection: "column",
												gap: 10
											}}
										>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
												<span style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13.5 }}>{r.ticket_ref}</span>
												<span style={{
													fontSize: 9.5,
													fontWeight: 700,
													padding: "2px 6px",
													borderRadius: 4,
													background: r.status === "closed" ? "rgba(74,222,128,0.1)" : r.status === "in_progress" ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)",
													color: r.status === "closed" ? "#4ADE80" : r.status === "in_progress" ? "#818CF8" : "#FBBF24",
													border: `1px solid ${r.status === "closed" ? "rgba(74,222,128,0.2)" : r.status === "in_progress" ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
													textTransform: "uppercase"
												}}>
													{r.status.replace("_", " ")}
												</span>
											</div>
											<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
												<span style={{ color: "#CBD5E1" }}>{r.service_type.toUpperCase().replace("_", " ")}</span>
												<span style={{
													fontWeight: 600,
													color: r.priority === "critical" || r.priority === "high" ? "#EF4444" : "#94A3B8"
												}}>
													{r.priority.toUpperCase()}
												</span>
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</div>

					{/* Posture & Reports column */}
					<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
						
						{/* Security Posture Rating Panel */}
						<div className="dash-panel" style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 18, padding: 24 }}>
							<h2 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", marginBottom: 16, textAlign: "center" }}>Security Posture</h2>
							
							<div style={{ textAlign: "center", padding: "12px 0 24px" }}>
								<div style={{ fontSize: 48, fontWeight: 900, color: "#F8FAFC", fontFamily: "var(--font-sans)", lineHeight: 1 }}>
									{statsData.complianceScore}%
								</div>
								<div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 8, fontWeight: 700 }}>
									Current Rating
								</div>
							</div>

							<div style={{ height: 6, background: "#1E293B", borderRadius: 100, overflow: "hidden", width: "100%", marginBottom: 12 }}>
								<div style={{ width: `${statsData.complianceScore}%`, height: "100%", background: "linear-gradient(90deg, #6366F1, #818CF8)", borderRadius: 100 }} />
							</div>
							
							<p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, textAlign: "center" }}>
								Score calculates VAPT resolution coverage across all requested environments.
							</p>
						</div>

						{/* Recent Reports Panel */}
						<div className="dash-panel" style={{ background: "#0E1422", border: "1px solid #1E293B", borderRadius: 18, padding: 24 }}>
							<h2 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", marginBottom: 16 }}>Available Reports</h2>
							
							{reports.length === 0 ? (
								<p style={{ fontSize: 12, color: "#64748B", textAlign: "center", padding: "16px 0" }}>No reports released yet.</p>
							) : (
								<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
									{reports.slice(0, 4).map((rep) => (
										<div
											key={rep.id}
											style={{
												padding: "12px",
												background: "rgba(255,255,255,0.02)",
												border: "1px solid #1E293B",
												borderRadius: 10,
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
												<div style={{ fontSize: 12.5, fontWeight: 700, color: "#CBD5E1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
													{rep.original_filename}
												</div>
												<span style={{ fontSize: 10, color: "#64748B" }}>
													Ticket: {rep.ticket_ref} (v{rep.version})
												</span>
											</div>
											<a
												href={rep.file_url}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													fontSize: 12,
													color: "#818CF8",
													fontWeight: 600,
													textDecoration: "none",
													flexShrink: 0,
												}}
											>
												Download
											</a>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
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
