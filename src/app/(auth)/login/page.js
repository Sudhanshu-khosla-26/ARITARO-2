"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import EvilEye from "@/components/EvilEye";

function LoginContent() {
	const { data: session, status } = useSession();
	const user = session?.user;
	
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [focused, setFocused] = useState(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get("redirect") || "/";

	// Role-Based Redirection on authentication
	useEffect(() => {
		if (status === "authenticated" && user) {
			if (user.role === "admin") {
				router.replace("/admin/dashboard");
			} else {
				router.replace(redirect === "/" ? "/dashboard" : redirect);
			}
		}
	}, [status, user, router, redirect]);

	const onSubmit = async (data) => {
		setError("");
		try {
			const res = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (res?.error) {
				setError(res.error || "Incorrect email or password.");
			} else {
				reset();
				router.refresh();
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
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

	if (status === "loading") {
		return (
			<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
				<div style={{ width: 32, height: 32, border: "3px solid rgba(99,102,241,0.1)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);
	}

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
					maxWidth: 420,
					background: "rgba(10, 12, 18, 0.75)",
					backdropFilter: "blur(20px)",
					WebkitBackdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.06)",
					borderRadius: 24,
					padding: "40px 32px",
					boxShadow: "0 24px 50px rgba(0, 0, 0, 0.6)",
					position: "relative",
					zIndex: 10,
					boxSizing: "border-box",
				}}
			>
				{/* Brand Logo */}
				<div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
					<Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
						<div style={{ width: 36, height: 36, position: "relative" }}>
							<Image
								src="/aritaro-logo.png"
								alt="Aritaro"
								fill
								sizes="36px"
								style={{ objectFit: "contain" }}
								priority
							/>
						</div>
						<span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, letterSpacing: "1px", color: "#F8FAFC" }}>
							ARITARO
						</span>
					</Link>
				</div>

				<div style={{ textAlign: "center", marginBottom: 24 }}>
					<h2 style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC", marginBottom: 6 }}>
						Security Portal Login
					</h2>
					<p style={{ fontSize: 13.5, color: "#94A3B8" }}>
						Enter credentials to access client or auditor workspaces
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
							marginBottom: 20,
							fontSize: 13,
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

				<form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
						<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
							Email Address
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

					<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
						<label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
							Password
						</label>
						<div style={{ position: "relative" }}>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								style={{ ...inputStyle("password"), paddingRight: 40 }}
								onFocus={() => setFocused("password")}
								onBlur={() => setFocused(null)}
								{...register("password", { required: "Password is required" })}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								style={{
									position: "absolute",
									right: 12,
									top: "50%",
									transform: "translateY(-50%)",
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#64748B",
									padding: 0,
									display: "flex",
								}}
							>
								{showPassword ? (
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
									</svg>
								) : (
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
								)}
							</button>
						</div>
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
						{isSubmitting ? "Signing in..." : "Login Portal"}
					</button>
				</form>

				<div style={{ textAlign: "center", marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 18, fontSize: 13, color: "#64748B" }}>
					Don't have a company account?{" "}
					<Link href="/signup" style={{ color: "#818CF8", textDecoration: "none", fontWeight: 600 }}>
						Register Company
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
				<div style={{ width: 32, height: 32, border: "3px solid rgba(99,102,241,0.1)", borderTopColor: "#6366F1", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
			</div>
		}>
			<LoginContent />
		</Suspense>
	);
}

