"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function SettingsPage() {
	const { data: session } = useSession();
	const user = session?.user || {};

	const [form, setForm] = useState({
		name: user.name || "",
		email: user.email || "",
		company: user.company || "",
		phone: user.phone || "",
	});
	const [saving, setSaving] = useState(false);

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		
		// Simulate database save
		setTimeout(() => {
			setSaving(false);
			toast.success("Profile preferences updated successfully.");
		}, 1000);
	};

	return (
		<main className="dash-main" style={{ flex: 1, padding: "40px 24px" }}>
			<div className="dash-content" style={{ maxWidth: 700, margin: "0 auto" }}>
				
				<div style={{ marginBottom: 32 }}>
					<h1 style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", marginBottom: 6 }}>Settings</h1>
					<p style={{ fontSize: 14, color: "#64748B" }}>Manage your client company profile and security contacts.</p>
				</div>

				<div style={{ background: "rgba(15,23,42,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 18, padding: 28 }}>
					<h2 style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
						Company Profile Details
					</h2>

					<form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>Contact Name</label>
								<input
									type="text"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									style={{
										padding: "10px 14px",
										fontSize: 14,
										background: "rgba(2,6,23,0.5)",
										border: "1px solid rgba(255,255,255,0.08)",
										borderRadius: 10,
										color: "#E2E8F0",
										outline: "none",
										fontFamily: "var(--font-sans)",
									}}
								/>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>Business Email</label>
								<input
									type="email"
									disabled
									value={form.email}
									style={{
										padding: "10px 14px",
										fontSize: 14,
										background: "rgba(2,6,23,0.3)",
										border: "1px solid rgba(255,255,255,0.04)",
										borderRadius: 10,
										color: "#64748B",
										cursor: "not-allowed",
										outline: "none",
										fontFamily: "var(--font-sans)",
									}}
								/>
							</div>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
							<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>Company Name</label>
								<input
									type="text"
									disabled
									value={form.company}
									style={{
										padding: "10px 14px",
										fontSize: 14,
										background: "rgba(2,6,23,0.3)",
										border: "1px solid rgba(255,255,255,0.04)",
										borderRadius: 10,
										color: "#64748B",
										cursor: "not-allowed",
										outline: "none",
										fontFamily: "var(--font-sans)",
									}}
								/>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>Phone Number</label>
								<input
									type="text"
									placeholder="+1 (555) 000-0000"
									value={form.phone}
									onChange={(e) => setForm({ ...form, phone: e.target.value })}
									style={{
										padding: "10px 14px",
										fontSize: 14,
										background: "rgba(2,6,23,0.5)",
										border: "1px solid rgba(255,255,255,0.08)",
										borderRadius: 10,
										color: "#E2E8F0",
										outline: "none",
										fontFamily: "var(--font-sans)",
									}}
								/>
							</div>
						</div>

						<div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 18, display: "flex", justifyContent: "flex-end" }}>
							<button
								type="submit"
								disabled={saving}
								className="dash-btn-primary"
								style={{ padding: "10px 20px" }}
							>
								{saving ? "Saving Changes..." : "Save Preferences"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
}
