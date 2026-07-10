import Link from "next/link";

export default function Overview({ stats, loading, setActiveTab }) {
	const statCards = [
		{
			label: "Admins",
			value: stats?.adminCount ?? "—",
			color: "#3B82F6",
			bg: "rgba(59,130,246,0.12)",
		},
		{
			label: "Clients / Companies",
			value: stats?.clientCount ?? "—",
			color: "#10B981",
			bg: "rgba(16,185,129,0.12)",
		},
		{
			label: "Contact Requests",
			value: stats?.contactCount ?? "—",
			color: "#06B6D4",
			bg: "rgba(6,182,212,0.12)",
		},
		{
			label: "Service Requests",
			value: stats?.requestCount ?? "—",
			color: "#F59E0B",
			bg: "rgba(245,158,11,0.12)",
		},
	];

	return (
		<>
			<div className="dash-stats">
				{statCards.map((s, i) => (
					<div
						key={s.label}
						className={`dash-stat-card dash-animate dash-animate-${i + 2}`}
						style={{ background: "#151820", border: "1px solid #1C1F26", borderRadius: 16, padding: 20 }}
					>
						<div className="dash-stat-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
							<div
								className="dash-stat-icon"
								style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: s.bg, color: s.color }}
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								</svg>
							</div>
						</div>
						<div className="dash-stat-value" style={{ fontSize: 28, fontWeight: 800, color: "#F9FAFB", fontFamily: "var(--font-mono)" }}>
							{loading ? "…" : s.value}
						</div>
						<div className="dash-stat-label" style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{s.label}</div>
					</div>
				))}
			</div>

			<div className="dash-panel dash-animate dash-animate-5" style={{ background: "#151820", border: "1px solid #1C1F26", borderRadius: 18, padding: 24, marginTop: 24 }}>
				<div className="dash-panel-header" style={{ marginBottom: 16 }}>
					<h2 className="dash-panel-title" style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB" }}>Quick Actions</h2>
				</div>
				<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
					<button
						type="button"
						className="dash-btn-primary"
						onClick={() => setActiveTab("users")}
						style={{ cursor: "pointer" }}
					>
						User Management Console
					</button>
					<button
						type="button"
						className="dash-btn-primary"
						onClick={() => setActiveTab("requests")}
						style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34D399", cursor: "pointer" }}
					>
						Track Service Requests
					</button>
					<Link href="/" className="dash-btn-outline" style={{ textDecoration: "none", border: "1px solid #1C1F26", padding: "8px 16px", borderRadius: 8, color: "#CBD5E1" }}>
						View Homepage
					</Link>
				</div>
			</div>
		</>
	);
}
