"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	getAdminStats,
	listAdmins,
	createAdmin,
	removeAdmin,
	listClients,
	createClient,
	removeClient,
} from "@/actions/admin.actions";

// Import modular components
import Overview from "./components/Overview";
import UserManagement from "./components/UserManagement";
import ManageBlogs from "./components/ManageBlogs";
import ManageServices from "./components/ManageServices";
import Companies from "./components/Companies";
import ManageServiceRequests from "./components/ManageServiceRequests";
import ManageAuditLogs from "./components/ManageAuditLogs";

export default function AdminClient() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const user = session?.user;

	const [userDetails, setUserDetails] = useState(undefined);
	const [stats, setStats] = useState(null);
	const [admins, setAdmins] = useState([]);
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [ConfirmDialog, confirm] = useConfirm();
	
	const activeTab = searchParams.get("tab") || "overview";
	const selectedRequestId = searchParams.get("requestId") || null;

	const handleTabChange = (newTab) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", newTab);
		if (newTab !== "requests") {
			params.delete("requestId");
		}
		params.delete("companyId");
		router.replace(`${pathname}?${params.toString()}`);
		setSidebarOpen(false);
	};

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/admin/login");
		} else if (status === "authenticated" && user?.role !== "admin") {
			router.replace("/dashboard");
		}
	}, [status, user, router]);

	useEffect(() => {
		if (user?.role !== "admin") return;
		setUserDetails(user);
		loadData();
	}, [user]);

	async function loadData() {
		setLoading(true);
		const [statsRes, adminsRes, clientsRes] = await Promise.all([
			getAdminStats(),
			listAdmins(),
			listClients(),
		]);
		if (statsRes.success) setStats(statsRes.stats);
		if (adminsRes.success) setAdmins(adminsRes.admins);
		if (clientsRes.success) setClients(clientsRes.clients);
		setLoading(false);
	}

	async function onAddAdmin(data) {
		const formData = new FormData();
		formData.set("name", data.name);
		formData.set("email", data.email);
		formData.set("password", data.password);

		const result = await createAdmin(formData);
		if (result.success) {
			toast.success(result.message);
			await loadData();
		} else {
			toast.error(result.error);
		}
	}

	async function onRemoveAdmin(adminId) {
		const ok = await confirm({
			title: "Remove admin access?",
			description:
				"This user will lose all admin privileges. You can re-add them later.",
			confirmLabel: "Remove",
			variant: "danger",
		});
		if (!ok) return;
		const result = await removeAdmin(adminId);
		if (result.success) {
			toast.success(result.message);
			await loadData();
		} else {
			toast.error(result.error);
		}
	}

	async function onAddClient(data) {
		const formData = new FormData();
		formData.set("name", data.clientName);
		formData.set("email", data.clientEmail);
		formData.set("password", data.clientPassword);
		formData.set("company", data.company || "");
		formData.set("industry", data.industry || "");

		const result = await createClient(formData);
		if (result.success) {
			toast.success(result.message);
			await loadData();
		} else {
			toast.error(result.error);
		}
	}

	async function onRemoveClient(clientId) {
		const ok = await confirm({
			title: "Delete client account?",
			description:
				"This action is permanent and cannot be undone. All data for this client will be removed.",
			confirmLabel: "Delete",
			variant: "danger",
		});
		if (!ok) return;
		const result = await removeClient(clientId);
		if (result.success) {
			toast.success(result.message);
			await loadData();
		} else {
			toast.error(result.error);
		}
	}

	const handleCompanyViewRequest = (reqId) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", "requests");
		params.set("requestId", reqId);
		router.replace(`${pathname}?${params.toString()}`);
	};

	if (status === "loading" || !user || user.role !== "admin") {
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

	return (
		<>
			{ConfirmDialog}
			<div className="dash-layout">
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
						<div className="dash-nav-label">Admin</div>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "overview" ? "active" : ""}`}
							onClick={() => handleTabChange("overview")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							Overview
						</button>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "companies" ? "active" : ""}`}
							onClick={() => handleTabChange("companies")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							B2B Companies
						</button>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "requests" ? "active" : ""}`}
							onClick={() => handleTabChange("requests")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							Service Requests
						</button>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "users" ? "active" : ""}`}
							onClick={() => handleTabChange("users")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							User Management
						</button>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "auditLogs" ? "active" : ""}`}
							onClick={() => handleTabChange("auditLogs")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							Security Audit Trail
						</button>
						
						<div className="dash-nav-label" style={{ marginTop: 14 }}>Content</div>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "blogs" ? "active" : ""}`}
							onClick={() => handleTabChange("blogs")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							Manage Blogs
						</button>
						<button
							type="button"
							className={`dash-nav-item ${activeTab === "services" ? "active" : ""}`}
							onClick={() => handleTabChange("services")}
							style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
						>
							Manage Services
						</button>

						<div className="dash-nav-label" style={{ marginTop: 14 }}>System</div>
						<button
							type="button"
							className="dash-nav-item"
							onClick={() => signOut({ callbackUrl: "/login" })}
							style={{
								width: "100%",
								background: "none",
								border: "none",
								cursor: "pointer",
								textAlign: "left",
								color: "#F87171",
								display: "flex",
								alignItems: "center",
								gap: 12,
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
								{userDetails?.name?.charAt(0)?.toUpperCase() || "A"}
							</div>
							<div className="dash-user-info">
								<div className="dash-user-name">
									{userDetails?.name || "Admin"}
								</div>
								<div className="dash-user-email">{userDetails?.email}</div>
							</div>
						</div>
					</div>
				</aside>

				<main className="dash-main">
					<div className="dash-main-bg" />
					<div className="dash-content">
						<div className="dash-header dash-animate dash-animate-1" style={{ borderBottom: "1px solid #1C1F26", paddingBottom: 20 }}>
							<div className="dash-header-left">
								<h1 style={{ fontSize: 26, fontWeight: 700, color: "#F9FAFB", letterSpacing: "-0.02em" }}>
									Command Center
								</h1>
								<p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Manage platform clients, audit scoping, reports, and administrative logs</p>
							</div>
						</div>

						<div style={{ marginTop: 24 }}>
							{activeTab === "overview" && (
								<Overview
									stats={stats}
									loading={loading}
									setActiveTab={handleTabChange}
								/>
							)}

							{activeTab === "companies" && (
								<Companies
									clients={clients}
									onSelectRequest={handleCompanyViewRequest}
								/>
							)}

							{activeTab === "requests" && (
								<ManageServiceRequests
									initialSelectedId={selectedRequestId}
								/>
							)}

							{activeTab === "users" && (
								<UserManagement
									admins={admins}
									clients={clients}
									loading={loading}
									onAddAdmin={onAddAdmin}
									onRemoveAdmin={onRemoveAdmin}
									onAddClient={onAddClient}
									onRemoveClient={onRemoveClient}
									currentUserId={user.id}
									labelStyle={labelStyle}
									inputStyle={inputStyle}
									errorStyle={errorStyle}
									thStyle={thStyle}
									tdStyle={tdStyle}
								/>
							)}

							{activeTab === "auditLogs" && (
								<ManageAuditLogs />
							)}

							{activeTab === "blogs" && <ManageBlogs />}

							{activeTab === "services" && <ManageServices />}
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

const labelStyle = {
	display: "block",
	fontSize: 13,
	color: "#94A3B8",
	marginBottom: 6,
};

const inputStyle = {
	width: "100%",
	padding: "12px 14px",
	borderRadius: 10,
	border: "1px solid #1C1F26",
	background: "rgba(17,19,24,0.5)",
	color: "#E2E8F0",
	fontSize: 14,
	outline: "none",
	boxSizing: "border-box",
};

const errorStyle = {
	color: "#F87171",
	fontSize: 12,
	marginTop: 4,
};

const thStyle = {
	textAlign: "left",
	padding: "10px 12px",
	fontSize: 11,
	fontWeight: 600,
	color: "#6B7280",
	textTransform: "uppercase",
	letterSpacing: "0.5px",
	borderBottom: "1px solid rgba(28,31,38,0.4)",
};

const tdStyle = {
	padding: "14px 12px",
	fontSize: 14,
	color: "#CBD5E1",
	borderBottom: "1px solid rgba(28,31,38,0.2)",
};
