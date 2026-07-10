import { useState } from "react";
import { useForm } from "react-hook-form";

function formatDate(iso) {
	if (!iso) return "Never";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function UserManagement({
	admins,
	clients,
	loading,
	onAddAdmin,
	onRemoveAdmin,
	onAddClient,
	onRemoveClient,
	currentUserId,
	labelStyle,
	inputStyle,
	errorStyle,
	thStyle,
	tdStyle,
}) {
	const [subTab, setSubTab] = useState("clients");

	const {
		register: registerAdmin,
		handleSubmit: handleSubmitAdmin,
		reset: resetAdmin,
		formState: { errors: errorsAdmin, isSubmitting: isSubmittingAdmin },
	} = useForm();

	const {
		register: registerClient,
		handleSubmit: handleSubmitClient,
		reset: resetClient,
		formState: { errors: errorsClient, isSubmitting: isSubmittingClient },
	} = useForm();

	const handleCreateAdmin = async (data) => {
		await onAddAdmin(data);
		resetAdmin();
	};

	const handleCreateClient = async (data) => {
		await onAddClient(data);
		resetClient();
	};

	return (
		<div style={{ display: "grid", gap: 20 }}>
			
			{/* Sub tabs navigation */}
			<div style={{
				display: "flex",
				gap: 8,
				borderBottom: "1px solid #1C1F26",
				paddingBottom: 10,
				marginBottom: 10
			}}>
				<button
					onClick={() => setSubTab("clients")}
					style={{
						padding: "10px 20px",
						background: subTab === "clients" ? "rgba(59,130,246,0.08)" : "transparent",
						border: subTab === "clients" ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent",
						borderRadius: 8,
						color: subTab === "clients" ? "#60A5FA" : "#6B7280",
						fontSize: 13.5,
						fontWeight: 700,
						cursor: "pointer",
						transition: "all 0.2s"
					}}
				>
					👥 Client Accounts ({clients.length})
				</button>
				<button
					onClick={() => setSubTab("admins")}
					style={{
						padding: "10px 20px",
						background: subTab === "admins" ? "rgba(59,130,246,0.08)" : "transparent",
						border: subTab === "admins" ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent",
						borderRadius: 8,
						color: subTab === "admins" ? "#60A5FA" : "#6B7280",
						fontSize: 13.5,
						fontWeight: 700,
						cursor: "pointer",
						transition: "all 0.2s"
					}}
				>
					🛡️ Administrator Accounts ({admins.length})
				</button>
			</div>

			{subTab === "clients" ? (
				<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
					
					{/* Add Client Form */}
					<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>Add Client Account</h3>
						<form onSubmit={handleSubmitClient(handleCreateClient)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							<div>
								<label style={labelStyle}>Full Name</label>
								<input
									{...registerClient("clientName", { required: "Name is required" })}
									style={inputStyle}
									placeholder="John Representative"
								/>
								{errorsClient.clientName && (
									<p style={errorStyle}>{errorsClient.clientName.message}</p>
								)}
							</div>
							<div>
								<label style={labelStyle}>Email Address</label>
								<input
									type="email"
									{...registerClient("clientEmail", {
										required: "Email is required",
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "Invalid email address",
										},
									})}
									style={inputStyle}
									placeholder="client@clientcompany.com"
								/>
								{errorsClient.clientEmail && (
									<p style={errorStyle}>{errorsClient.clientEmail.message}</p>
								)}
							</div>
							<div>
								<label style={labelStyle}>Password</label>
								<input
									type="password"
									{...registerClient("clientPassword", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Minimum 8 characters",
										},
									})}
									style={inputStyle}
									placeholder="Min. 8 characters"
								/>
								{errorsClient.clientPassword && (
									<p style={errorStyle}>{errorsClient.clientPassword.message}</p>
								)}
							</div>
							<div>
								<label style={labelStyle}>Company Name</label>
								<input
									{...registerClient("company")}
									style={inputStyle}
									placeholder="Acme Corp"
								/>
							</div>
							<div>
								<label style={labelStyle}>Industry</label>
								<input
									{...registerClient("industry")}
									style={inputStyle}
									placeholder="Healthcare, SaaS, Finance"
								/>
							</div>
							<button
								type="submit"
								disabled={isSubmittingClient}
								style={{
									padding: "10px 18px",
									background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
									border: "none",
									borderRadius: 10,
									color: "white",
									fontWeight: 700,
									cursor: "pointer",
									fontSize: 13,
								}}
							>
								{isSubmittingClient ? "Creating..." : "Create Client"}
							</button>
						</form>
					</div>

					{/* Clients List */}
					<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>Client Accounts Registry</h3>
						{loading ? (
							<p style={{ color: "#6B7280", fontSize: 13 }}>Fetching records...</p>
						) : clients.length === 0 ? (
							<p style={{ color: "#6B7280", fontSize: 13 }}>No client accounts registered.</p>
						) : (
							<div style={{ overflowX: "auto" }}>
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<thead>
										<tr>
											{["Name", "Email", "Joined", "Last Login", ""].map((h) => (
												<th key={h} style={thStyle}>{h}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{clients.map((client) => (
											<tr key={client.id}>
												<td style={tdStyle}>{client.name}</td>
												<td style={tdStyle}>{client.email}</td>
												<td style={tdStyle}>{formatDate(client.createdAt)}</td>
												<td style={tdStyle}>{formatDate(client.lastLogin)}</td>
												<td style={tdStyle}>
													<button
														type="button"
														onClick={() => onRemoveClient(client.id)}
														style={{
															background: "rgba(239,68,68,0.08)",
															border: "1px solid rgba(239,68,68,0.25)",
															color: "#F87171",
															borderRadius: 8,
															padding: "6px 12px",
															fontSize: 12,
															cursor: "pointer",
															fontWeight: 600,
															transition: "all 0.2s"
														}}
													>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

				</div>
			) : (
				<div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
					
					{/* Add Admin Form */}
					<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>Add Administrator</h3>
						<form onSubmit={handleSubmitAdmin(handleCreateAdmin)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							<div>
								<label style={labelStyle}>Full Name</label>
								<input
									{...registerAdmin("name", { required: "Name is required" })}
									style={inputStyle}
									placeholder="Jane Doe"
								/>
								{errorsAdmin.name && (
									<p style={errorStyle}>{errorsAdmin.name.message}</p>
								)}
							</div>
							<div>
								<label style={labelStyle}>Email Address</label>
								<input
									type="email"
									{...registerAdmin("email", {
										required: "Email is required",
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "Invalid email address",
										},
									})}
									style={inputStyle}
									placeholder="admin@company.com"
								/>
								{errorsAdmin.email && (
									<p style={errorStyle}>{errorsAdmin.email.message}</p>
								)}
							</div>
							<div>
								<label style={labelStyle}>Password</label>
								<input
									type="password"
									{...registerAdmin("password", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Minimum 8 characters",
										},
									})}
									style={inputStyle}
									placeholder="Min. 8 characters"
								/>
								{errorsAdmin.password && (
									<p style={errorStyle}>{errorsAdmin.password.message}</p>
								)}
							</div>
							<button
								type="submit"
								disabled={isSubmittingAdmin}
								style={{
									padding: "10px 18px",
									background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
									border: "none",
									borderRadius: 10,
									color: "white",
									fontWeight: 700,
									cursor: "pointer",
									fontSize: 13,
								}}
							>
								{isSubmittingAdmin ? "Creating..." : "Create Admin"}
							</button>
						</form>
					</div>

					{/* Admin List */}
					<div style={{ background: "#111318", border: "1px solid #1C1F26", borderRadius: 16, padding: 24 }}>
						<h3 style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB", marginBottom: 18 }}>Administrators Registry</h3>
						{loading ? (
							<p style={{ color: "#6B7280", fontSize: 13 }}>Fetching records...</p>
						) : admins.length === 0 ? (
							<p style={{ color: "#6B7280", fontSize: 13 }}>No admins found.</p>
						) : (
							<div style={{ overflowX: "auto" }}>
								<table style={{ width: "100%", borderCollapse: "collapse" }}>
									<thead>
										<tr>
											{["Name", "Email", "Joined", "Last Login", ""].map((h) => (
												<th key={h} style={thStyle}>{h}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{admins.map((admin) => (
											<tr key={admin.id}>
												<td style={tdStyle}>{admin.name}</td>
												<td style={tdStyle}>{admin.email}</td>
												<td style={tdStyle}>{formatDate(admin.createdAt)}</td>
												<td style={tdStyle}>{formatDate(admin.lastLogin)}</td>
												<td style={tdStyle}>
													{admin.id !== currentUserId ? (
														<button
															type="button"
															onClick={() => onRemoveAdmin(admin.id)}
															style={{
																background: "rgba(239,68,68,0.08)",
																border: "1px solid rgba(239,68,68,0.25)",
																color: "#F87171",
																borderRadius: 8,
																padding: "6px 12px",
																fontSize: 12,
																cursor: "pointer",
																fontWeight: 600,
																transition: "all 0.2s"
															}}
														>
															Remove
														</button>
													) : (
														<span style={{ fontSize: 12.5, color: "#6B7280" }}>You</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

				</div>
			)}
		</div>
	);
}
