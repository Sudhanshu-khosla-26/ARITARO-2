"use client";

import { useState, useEffect } from "react";

const PAGE_SIZE = 15;

export default function ManageAuditLogs() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	useEffect(() => {
		const loadLogs = async () => {
			try {
				const res = await fetch("/api/audit-logs");
				const payload = await res.json();
				if (payload.success) {
					setLogs(payload.logs);
				}
			} catch (err) {
				console.error("Failed to load audit logs:", err);
			} finally {
				setLoading(false);
			}
		};
		loadLogs();
	}, []);

	if (loading) {
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
				<div style={{ width: 30, height: 30, border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
			</div>
		);
	}

	return (
		<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
			<h2 style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>System Security Audit Trail</h2>
			{logs.length === 0 ? (
				<p style={{ color: "#6B7280", fontSize: 13 }}>No audit logs recorded.</p>
			) : (
				<div style={{ overflowX: "auto" }}>
					<table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
						<thead>
							<tr style={{ borderBottom: "1px solid #1C1F26" }}>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Timestamp</th>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Actor</th>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Action</th>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Target</th>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Metadata</th>
								<th style={{ padding: "12px 10px", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>IP Address</th>
							</tr>
						</thead>
						<tbody>
							{logs.slice(0, visibleCount).map((l) => (
								<tr key={l.id} style={{ borderBottom: "1px solid rgba(51,65,85,0.2)", fontSize: 13, color: "#CBD5E1" }}>
									<td style={{ padding: "14px 10px", color: "#6B7280" }}>{l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}</td>
									<td style={{ padding: "14px 10px", fontWeight: 600 }}>{l.actor_name} ({l.actor_role})</td>
									<td style={{ padding: "14px 10px", color: "#3B82F6", fontWeight: 700 }}>{l.action.toUpperCase()}</td>
									<td style={{ padding: "14px 10px" }}>{l.target_type} ({l.target_id.slice(-6)})</td>
									<td style={{ padding: "14px 10px", fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#94A3B8" }}>
										{JSON.stringify(l.metadata)}
									</td>
									<td style={{ padding: "14px 10px", color: "#6B7280" }}>{l.ip_address || "internal"}</td>
								</tr>
							))}
						</tbody>
					</table>
					{visibleCount < logs.length && (
						<div style={{ textAlign: "center", marginTop: 20 }}>
							<span style={{ fontSize: 12, color: "#6B7280", marginRight: 12 }}>
								Showing {Math.min(visibleCount, logs.length)} of {logs.length}
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
				</div>
			)}
		</div>
	);
}
