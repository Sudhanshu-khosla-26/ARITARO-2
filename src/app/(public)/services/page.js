"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "@/components/kokonutui/loader";

const icons = {
	"01": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<rect
				x="3"
				y="3"
				width="22"
				height="22"
				rx="4"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M8 14h4l2-4 2 6 2-3h2"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="21"
				cy="7"
				r="3"
				fill="currentColor"
				opacity="0.3"
			/>
		</svg>
	),
	"02": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<path
				d="M4 6a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="10"
				cy="11"
				r="1.2"
				fill="currentColor"
			/>
			<circle
				cx="14"
				cy="11"
				r="1.2"
				fill="currentColor"
			/>
			<circle
				cx="18"
				cy="11"
				r="1.2"
				fill="currentColor"
			/>
		</svg>
	),
	"03": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<circle
				cx="14"
				cy="10"
				r="5"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M14 15v5M10 25a7 7 0 0114 0"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle
				cx="14"
				cy="10"
				r="2"
				fill="currentColor"
				opacity="0.3"
			/>
		</svg>
	),
	"04": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<rect
				x="5"
				y="3"
				width="18"
				height="22"
				rx="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M9 8h10M9 12h7M9 16h10M9 20h5"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
		</svg>
	),
	"05": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<circle
				cx="14"
				cy="14"
				r="10"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="14"
				cy="14"
				r="4"
				stroke="currentColor"
				strokeWidth="1.2"
				fill="currentColor"
				fillOpacity="0.1"
			/>
			<circle
				cx="14"
				cy="14"
				r="1.5"
				fill="currentColor"
			/>
		</svg>
	),
	"06": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<path
				d="M4 7a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M8 10l4 3-4 3M14 16h6"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	"07": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<path
				d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
			<circle
				cx="14"
				cy="13"
				r="3"
				stroke="currentColor"
				strokeWidth="1.2"
			/>
			<circle
				cx="14"
				cy="13"
				r="1"
				fill="currentColor"
			/>
		</svg>
	),
	"08": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 28 28"
			fill="none"
		>
			<rect
				x="2"
				y="5"
				width="24"
				height="18"
				rx="3"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M2 10h24"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.5"
			/>
			<path
				d="M8 17l3-3 3 3 4-5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
};

import BorderGlow from "@/components/BorderGlow";

function ServiceCard({ service, index }) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setVisible(true);
			},
			{ threshold: 0.1 },
		);
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);

	let iconKey = "07";
	const slug = service.slug || "";
	if (slug.includes("api")) iconKey = "01";
	else if (slug.includes("web") || slug.includes("app")) iconKey = "06";
	else if (slug.includes("cloud")) iconKey = "03";
	else if (slug.includes("ai") || slug.includes("llm")) iconKey = "05";

	return (
		<div
			ref={ref}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0)" : "translateY(30px)",
				transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
				transitionDelay: `${(index % 4) * 0.07}s`,
				minHeight: 380,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<BorderGlow
				glowColor="190 80 80"
				backgroundColor="#090E17"
				borderRadius={14}
				glowRadius={30}
				glowIntensity={0.8}
				coneSpread={20}
				colors={["#3B82F6", "#06B6D4", "#141C2C"]}
				className="w-full h-full"
			>
				<div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						{/* Icon */}
						<div
							style={{
								width: 40,
								height: 40,
								borderRadius: 10,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: service.color || "#3B82F6",
								background: "rgba(255, 255, 255, 0.02)",
								border: "1px solid rgba(255, 255, 255, 0.05)",
								marginBottom: 16,
							}}
						>
							{icons[iconKey]}
						</div>

						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: "#F1F5F9",
								marginBottom: 10,
								letterSpacing: "-0.3px",
								lineHeight: 1.25,
							}}
						>
							{service.title}
						</h3>

						<p
							style={{
								fontSize: 13,
								color: "#94A3B8",
								lineHeight: 1.6,
								marginBottom: 16,
								display: "-webkit-box",
								WebkitLineClamp: 3,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							}}
						>
							{service.desc}
						</p>

						<ul
							style={{
								listStyle: "none",
								padding: 0,
								margin: "0 0 20px 0",
								display: "flex",
								flexDirection: "column",
								gap: 6,
								marginTop: "auto",
							}}
						>
							{service.features.slice(0, 3).map((feat, fidx) => (
								<li
									key={fidx}
									style={{
										fontSize: 12,
										color: "#94A3B8",
										display: "flex",
										alignItems: "center",
										gap: 8,
									}}
								>
									<span style={{ color: "#06B6D4", fontWeight: "bold" }}>•</span>
									{feat}
								</li>
							))}
						</ul>
					</div>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderTop: "1px solid rgba(255,255,255,0.06)",
							paddingTop: 16,
							marginTop: "auto",
							position: "relative",
							zIndex: 1,
						}}
					>
						<div>
							<span
								style={{
									fontSize: 10,
									color: "#334155",
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: "0.5px",
									display: "block",
									marginBottom: 2,
								}}
							>
								Duration
							</span>
							<div
								style={{
									fontSize: 12,
									fontWeight: 600,
									color: "#CBD5E1",
									fontFamily: "var(--font-sans)",
								}}
							>
								{service.duration || "2-4 weeks"}
							</div>
						</div>

						<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<Link
								href={`/services/${service.slug}`}
								style={{
									fontSize: 12,
									color: "#94A3B8",
									textDecoration: "none",
									fontWeight: 500,
									transition: "color 0.2s ease",
								}}
								onMouseEnter={(e) => { e.currentTarget.style.color = "#F1F5F9"; }}
								onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
							>
								Read More
							</Link>
							<Link
								href={`/request-assessment?service=${
									service.slug === "api-penetration-testing"
										? "api_pt"
										: service.slug === "web-application-penetration-testing"
										? "wap_pt"
										: service.slug === "cloud-security-assessment"
										? "cloud_security"
										: service.slug === "ai-penetration-testing"
										? "ai_pt"
										: "api_pt"
								}`}
								className="btn-primary"
								style={{
									fontSize: 11,
									padding: "8px 12px",
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									textDecoration: "none",
									borderRadius: 6,
								}}
							>
								Request Quote
							</Link>
						</div>
					</div>
				</div>
			</BorderGlow>
		</div>
	);
}

export default function ServicesPage() {
	const { data: session } = useSession();
	const user = session?.user;
	const [servicesList, setServicesList] = useState([]);
	const [categoriesList, setCategoriesList] = useState(["All"]);
	const [servicesLoading, setServicesLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState("All");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const fetchServices = async () => {
			try {
				const res = await fetch("/api/services");
				const data = await res.json();
				setServicesList(data.services || []);
				setCategoriesList(data.categories || ["All"]);
			} catch (err) {
				console.error("Error fetching services:", err);
			} finally {
				setServicesLoading(false);
			}
		};
		fetchServices();
	}, []);

	if (!mounted || servicesLoading)
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#030508",
				}}
			>
				<Loader
					title="Loading Security Services..."
					subtitle="Retrieving verified vulnerability assessment modules"
				/>
			</div>
		);

	const filtered =
		activeCategory === "All"
			? servicesList
			: servicesList.filter((s) => s.category === activeCategory);
	const isInCart = (n) => cartItems.some((i) => i.number === n);

	const handleAdd = (service) => {
		if (!user) {
			setLoginOpen(true);
			return;
		}
		if (!isInCart(service.number)) addToCart(service);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#000000ff",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* BG orbs */}
			<div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
				<div
					style={{
						position: "absolute",
						top: "-10%",
						left: "-10%",
						width: "50%",
						height: "50%",
						background:
							"radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)",
						animation: "floatOrb 15s ease-in-out infinite",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "-10%",
						right: "-10%",
						width: "50%",
						height: "50%",
						background:
							"radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 60%)",
						animation: "floatOrb 20s ease-in-out infinite 2s",
					}}
				/>
			</div>

			{/* Hero section */}
			<section
				style={{
					maxWidth: 1280,
					margin: "0 auto",
					padding: "80px 24px 48px",
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}
			>
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						background: "rgba(99,102,241,0.08)",
						border: "1px solid rgba(99,102,241,0.2)",
						borderRadius: 100,
						padding: "5px 16px",
						marginBottom: 20,
					}}
				>
					<span
						style={{
							width: 6,
							height: 6,
							borderRadius: "50%",
							background: "#6366F1",
							boxShadow: "0 0 8px #6366F1",
						}}
					/>
					<span
						style={{
							fontFamily: "var(--font-mono)",
							fontSize: 10,
							letterSpacing: "2px",
							color: "#818CF8",
							fontWeight: 600,
						}}
					>
						SERVICES & VAPT
					</span>
				</div>
				<h1
					style={{
						fontSize: "clamp(48px, 6.5vw, 76px)",
						fontWeight: 900,
						color: "#F1F5F9",
						letterSpacing: "-1.5px",
						marginBottom: 18,
						lineHeight: 1.1,
					}}
				>
					ARITARO <span className="grad-indigo">Services</span>
				</h1>
				<p
					style={{
						maxWidth: 520,
						margin: "0 auto",
						color: "#475569",
						fontSize: 16,
						lineHeight: 1.75,
					}}
				>
					Browse, select, and quote any service.{" "}
					{!user && (
						<span style={{ color: "#818CF8" }}>
							Sign in to add services to your quote.
						</span>
					)}
				</p>
			</section>

			{/* Category filter */}
			<div
				style={{
					maxWidth: 1280,
					margin: "0 auto",
					padding: "0 24px 48px",
					display: "flex",
					justifyContent: "center",
					gap: 8,
					flexWrap: "wrap",
					position: "relative",
					zIndex: 1,
				}}
			>
				{categoriesList.map((cat) => (
					<button
						key={cat}
						onClick={() => setActiveCategory(cat)}
						style={{
							padding: "9px 22px",
							borderRadius: 100,
							cursor: "pointer",
							fontFamily: "var(--font-sans)",
							fontSize: 13,
							fontWeight: 600,
							transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
							border:
								activeCategory === cat
									? "1px solid rgba(99,102,241,0.5)"
									: "1px solid rgba(51,65,85,0.6)",
							background:
								activeCategory === cat
									? "rgba(99,102,241,0.15)"
									: "rgba(15,23,42,0.5)",
							color: activeCategory === cat ? "#818CF8" : "#475569",
							boxShadow:
								activeCategory === cat
									? "0 0 20px rgba(99,102,241,0.15)"
									: "none",
						}}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Grid */}
			<div
				style={{
					maxWidth: 1280,
					margin: "0 auto",
					padding: "0 24px 100px",
					position: "relative",
					zIndex: 1,
				}}
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
						gap: 22,
					}}
				>
					{filtered.map((service, i) => (
						<ServiceCard
							key={service.number}
							service={service}
							index={i}
						/>
					))}
				</div>

				{/* Not logged in banner */}
				{!user && (
					<div
						style={{
							marginTop: 60,
							padding: "36px 40px",
							background: "rgba(99,102,241,0.06)",
							border: "1px solid rgba(99,102,241,0.2)",
							borderRadius: 20,
							textAlign: "center",
							backdropFilter: "blur(8px)",
						}}
					>
						<div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
						<h3
							style={{
								fontSize: 18,
								fontWeight: 700,
								color: "#E2E8F0",
								marginBottom: 8,
								fontFamily: "var(--font-sans)",
							}}
						>
							Ready to secure your company?
						</h3>
						<p
							style={{
								fontSize: 14,
								color: "#475569",
								marginBottom: 24,
								lineHeight: 1.6,
							}}
						>
							Log in to request custom penetration testing or compliance audit scoping.
						</p>
						<Link
							href="/login?redirect=/services"
							className="btn-primary"
							style={{ fontSize: 14, padding: "13px 32px", margin: "0 auto", display: "inline-flex", textDecoration: "none", alignItems: "center", gap: 8 }}
						>
							Sign In / Create Account
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</Link>
					</div>
				)}
			</div>

			{/* Back link */}




			<style>{`
        @keyframes floatOrb {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.05); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
		</div>
	);
}
