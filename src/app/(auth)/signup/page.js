"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EvilEye from "@/components/EvilEye";

export default function SignupPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const [error, setError] = useState("");
	const [focused, setFocused] = useState(null);
	const router = useRouter();

	const onSubmit = async (data) => {
		setError("");
		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const txt = await res.text();
				setError(txt || "Failed to create account.");
				toast.error(txt || "Failed to create account.");
				return;
			}

			toast.success("Account created successfully! Please log in.");
			router.push("/login");
		} catch (err) {
			setError("Something went wrong. Please try again.");
			toast.error("Registration failed.");
		}
	};

	const inputStyle = (field) => ({
		width: "100%",
		padding: "12px 14px",
		borderRadius: 10,
		border: `1px solid ${focused === field ? "#3B82F6" : "rgba(255,255,255,0.08)"}`,
		background: "rgba(2,6,23,0.7)",
		color: "#F8FAFC",
		fontSize: 14,
		fontFamily: "var(--font-sans)",
		outline: "none",
		transition: "all 0.2s ease-in-out",
		boxShadow: focused === field ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none",
		boxSizing: "border-box",
	});

	return (
		<div
			style={{
				minHeight: "100vh",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "#02040a",
				fontFamily: "var(--font-sans)",
				position: "relative",
				overflowY: "auto",
				padding: "48px 24px",
				boxSizing: "border-box",
			}}
		>
			{/* High-tech grid overlay */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)",
					backgroundSize: "32px 32px",
					pointerEvents: "none",
					zIndex: 0,
				}}
			/>

			{/* Centered WebGL Eye Background (no cropping/cutting, perfectly seamless) */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "min(650px, 95vw)",
					height: "min(650px, 95vw)",
					zIndex: 1,
					pointerEvents: "none",
					opacity: 0.8,
				}}
			>
				<EvilEye
					eyeColor="#3B82F6"
					backgroundColor="#02040a"
					intensity={1.8}
					scale={0.75}
					glowIntensity={0.5}
					flameSpeed={0.8}
				/>
			</div>

			{/* Glassmorphic Auth Form Card */}
			<div
				style={{
					width: "100%",
					maxWidth: 440,
					background: "rgba(10, 12, 18, 0.75)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.06)",
					borderRadius: 24,
					padding: "36px 32px",
					boxShadow: "0 24px 50px rgba(0, 0, 0, 0.6)",
					position: "relative",
					zIndex: 10,
					boxSizing: "border-box",
				}}
			>
				{/* Brand Logo */}
				<div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
					<Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
						<span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, letterSpacing: "1px", color: "#F8FAFC" }}>
							ARITARO
						</span>
					</Link>
				</div>

				<div style={{ textAlign: "center", marginBottom: 20 }}>
					<h2 style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC", marginBottom: 6 }}>
						Create Company Account
					</h2>
					<p style={{ fontSize: 13, color: "#94A3B8" }}>
						Register your business profile to request security assessments
					</p>
				</div>

				{/* Error Alert */}
				{error && (
					<div
						style={{
							background: "rgba(239, 68, 68, 0.08)",
							border: "1px solid rgba(239, 68, 68, 0.2)",
							borderRadius: 8,
							padding: "10px 14px",
							marginBottom: 16,
							fontSize: 12.5,
							color: "#F87171",
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<label style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8" }}>
							Contact Name
						</label>
						<input
							type="text"
							placeholder="John Doe"
							style={inputStyle("name")}
							onFocus={() => setFocused("name")}
							onBlur={() => setFocused(null)}
							{...register("name", { required: "Name is required" })}
						/>
						{errors.name && (
							<span style={{ fontSize: 11, color: "#F87171", marginTop: 2 }}>
								{errors.name.message}
							</span>
						)}
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<label style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8" }}>
							Work Email Address
						</label>
						<input
							type="email"
							placeholder="name@company.com"
							style={inputStyle("email")}
							onFocus={() => setFocused("email")}
							onBlur={() => setFocused(null)}
							{...register("email", { required: "Email is required" })}
						/>
						{errors.email && (
							<span style={{ fontSize: 11, color: "#F87171", marginTop: 2 }}>
								{errors.email.message}
							</span>
						)}
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<label style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8" }}>
							Company Name
						</label>
						<input
							type="text"
							placeholder="Acme Corp"
							style={inputStyle("company")}
							onFocus={() => setFocused("company")}
							onBlur={() => setFocused(null)}
							{...register("company", { required: "Company name is required" })}
						/>
						{errors.company && (
							<span style={{ fontSize: 11, color: "#F87171", marginTop: 2 }}>
								{errors.company.message}
							</span>
						)}
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<label style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8" }}>
							Industry
						</label>
						<input
							type="text"
							placeholder="e.g. Finance, Tech, Healthcare"
							style={inputStyle("industry")}
							onFocus={() => setFocused("industry")}
							onBlur={() => setFocused(null)}
							{...register("industry")}
						/>
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
						<label style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8" }}>
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							style={inputStyle("password")}
							onFocus={() => setFocused("password")}
							onBlur={() => setFocused(null)}
							{...register("password", {
								required: "Password is required",
								minLength: { value: 8, message: "Password must be at least 8 characters" },
							})}
						/>
						{errors.password && (
							<span style={{ fontSize: 11, color: "#F87171", marginTop: 2 }}>
								{errors.password.message}
							</span>
						)}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						style={{
							marginTop: 8,
							padding: "13px",
							background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
							border: "none",
							borderRadius: 10,
							color: "#FFFFFF",
							fontSize: 14,
							fontWeight: 700,
							cursor: isSubmitting ? "not-allowed" : "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							transition: "all 0.2s",
						}}
					>
						{isSubmitting ? "Creating account..." : "Register Account"}
					</button>
				</form>

				<div style={{ textAlign: "center", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14, fontSize: 13, color: "#64748B" }}>
					Already have an account?{" "}
					<Link href="/login" style={{ color: "#818CF8", textDecoration: "none", fontWeight: 600 }}>
						Log In
					</Link>
				</div>
			</div>
		</div>
	);
}
