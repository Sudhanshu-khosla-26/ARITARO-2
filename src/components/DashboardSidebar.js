"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── SVG Icon Components ── */
const Icons = {
	services: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
		</svg>
	),
	overview: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M3 9h18" />
			<path d="M9 21V9" />
		</svg>
	),
	reports: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
		</svg>
	),
	settings: (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	),
	menu: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	),
};

const DashboardSidebar = () => {
	const { data: session } = useSession();
	const user = session?.user || null;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();

	return (
		<>
			{/* Mobile menu toggle */}
			<button
				className="dash-mobile-toggle"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{Icons.menu}
			</button>

			{/* Sidebar layout */}
			<aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
				<Link
					href="/"
					className="dash-sidebar-logo"
				>
					<div style={{ width: 32, height: 32, position: "relative" }}>
						<Image
							src="/aritaro-logo.png"
							alt="Aritaro"
							fill
							sizes="32px"
							style={{ objectFit: "contain" }}
							priority
						/>
					</div>
					<span>ARITARO</span>
				</Link>

				<div className="dash-nav-section">
					<div className="dash-nav-label">Main</div>
					<Link
						href="/dashboard"
						className={`dash-nav-item ${pathname === "/dashboard" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.overview}</span>
						Overview
					</Link>
					<Link
						href="/dashboard/services"
						className={`dash-nav-item ${pathname === "/dashboard/services" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.services}</span>
						My Requests
					</Link>
					<Link
						href="/dashboard/reports"
						className={`dash-nav-item ${pathname === "/dashboard/reports" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.reports}</span>
						Reports
					</Link>
				</div>

				<div className="dash-nav-section">
					<div className="dash-nav-label">Account</div>
					<Link
						href="/dashboard/settings"
						className={`dash-nav-item ${pathname === "/dashboard/settings" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.settings}</span>
						Settings
					</Link>
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/login" })}
						className="dash-nav-item"
						style={{
							width: "100%",
							background: "none",
							border: "none",
							cursor: "pointer",
							textAlign: "left",
							display: "flex",
							alignItems: "center",
							gap: 12,
							color: "#F87171",
							marginTop: 4,
						}}
					>
						<span className="dash-nav-icon" style={{ color: "#EF4444" }}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
								<polyline points="16 17 21 12 16 7" />
								<line x1="21" y1="12" x2="9" y2="12" />
							</svg>
						</span>
						Logout
					</button>
				</div>

				<div className="dash-sidebar-footer">
					<div className="dash-user-card">
						<div className="dash-avatar">
							{user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						<div className="dash-user-info">
							<div className="dash-user-name">{user?.name}</div>
							<div className="dash-user-email">{user?.email}</div>
						</div>
					</div>
				</div>
			</aside>

			{/* Sidebar backdrop overlay */}
			{sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.5)",
						zIndex: 99,
					}}
				/>
			)}
		</>
	);
};

export default DashboardSidebar;
