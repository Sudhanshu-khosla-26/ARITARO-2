"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import WhatsAppWidget from "@/components/WhatsAppWidget";

const TEAM = [
	{
		name: "Sudhanshu Khosla",
		role: "Founder & Lead Security Researcher",
		certs: ["OSCP", "CEH", "AWS Security"],
		bio: "Former red team operator with 5+ years in offensive security. Passionate about making enterprise security accessible to growing Indian businesses.",
	},
	{
		name: "Security Team",
		role: "Offensive Security Engineers",
		certs: ["OSEP", "BSCP", "CKS"],
		bio: "A team of certified security professionals specialising in API, Web App, Cloud, and AI penetration testing.",
	},
	{
		name: "Cloud Team",
		role: "Cloud Security Architects",
		certs: ["AWS Security", "SC-200", "PCSAE"],
		bio: "Deep expertise in AWS, Azure, and GCP security assessments, IAM reviews, and infrastructure hardening.",
	},
];

const PROOF_POINTS = [
	{ value: "500+", label: "Vulnerabilities Identified" },
	{ value: "50+", label: "Applications Secured" },
	{ value: "15+", label: "CVEs Disclosed" },
	{ value: "98%", label: "Client Re-engagement" },
	{ value: "4.9/5", label: "Client Satisfaction" },
	{ value: "<72h", label: "Engagement Start Time" },
];

const VALUES = [
	{
		title: "Expertise",
		desc: "Certified, battle-tested security professionals with OSCP, CEH, CISSP, and cloud security certifications.",
	},
	{
		title: "Transparency",
		desc: "Clear methodology, clear deliverables, no black boxes. You know exactly what we test and how we test it.",
	},
	{
		title: "Speed",
		desc: "Actionable findings, fast turnaround. Most engagements start within 72 hours of sign-off.",
	},
	{
		title: "Trust",
		desc: "Enterprise-grade confidentiality and professionalism. NDAs, secure communication, and data handling you can rely on.",
	},
];

export default function AboutPage() {
	return (
		<div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
			{/* Hero */}
			<section
				style={{
					padding: "80px 24px 60px",
					textAlign: "center",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<div
					className="cyber-grid"
					style={{
						position: "absolute",
						inset: 0,
						opacity: 0.15,
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "relative",
						zIndex: 1,
						maxWidth: 700,
						margin: "0 auto",
					}}
				>
					<div
						className="section-label"
						style={{
							display: "inline-flex",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						WHO WE ARE
					</div>
					<h1
						style={{
							fontSize: "clamp(28px, 5vw, 48px)",
							fontWeight: 800,
							color: "var(--text-primary)",
							lineHeight: 1.1,
							marginBottom: 16,
						}}
					>
						Built on{" "}
						<span
							style={{
								background: "linear-gradient(135deg, #818CF8, #22D3EE)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
								color: "transparent",
							}}
						>
							Zero-Trust
						</span>
						. Proven by Results.
					</h1>
					<p
						style={{
							fontSize: 16,
							color: "var(--text-muted)",
							lineHeight: 1.75,
							maxWidth: 580,
							margin: "0 auto",
						}}
					>
						Aritaro helps modern businesses strengthen their digital defense
						through advanced penetration testing, cloud security, and AI
						security assessments.
					</p>
				</div>
			</section>

			{/* Proof Points */}
			{/* <section style={{ padding: '0 24px 64px' }}>
        <div className="proof-grid" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {PROOF_POINTS.map((p, i) => (
            <div key={i} style={{
              padding: '20px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 14, textAlign: 'center', transition: 'all 0.2s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{p.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section> */}

			{/* Brand Values */}
			<section
				style={{
					padding: "64px 24px",
					borderTop: "1px solid var(--border-subtle)",
				}}
			>
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					<h2
						style={{
							fontSize: "clamp(22px, 3vw, 32px)",
							fontWeight: 700,
							color: "var(--text-primary)",
							marginBottom: 32,
							textAlign: "center",
						}}
					>
						Our Pillars
					</h2>
					<div
						className="values-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(4, 1fr)",
							gap: 16,
						}}
					>
						{VALUES.map((v, i) => (
							<div
								key={i}
								style={{
									padding: "28px 20px",
									background: "var(--bg-surface)",
									border: "1px solid var(--border-subtle)",
									borderRadius: 14,
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
									e.currentTarget.style.transform = "translateY(-3px)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "var(--border-subtle)";
									e.currentTarget.style.transform = "translateY(0)";
								}}
							>
								<h3
									style={{
										fontSize: 16,
										fontWeight: 700,
										color: "var(--accent)",
										marginBottom: 10,
									}}
								>
									{v.title}
								</h3>
								<p
									style={{
										fontSize: 13,
										color: "var(--text-muted)",
										lineHeight: 1.65,
									}}
								>
									{v.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team */}
			<section
				style={{
					padding: "64px 24px",
					borderTop: "1px solid var(--border-subtle)",
				}}
			>
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					<h2
						style={{
							fontSize: "clamp(22px, 3vw, 32px)",
							fontWeight: 700,
							color: "var(--text-primary)",
							marginBottom: 32,
							textAlign: "center",
						}}
					>
						The Team
					</h2>
					<div
						className="team-grid"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 16,
						}}
					>
						{TEAM.map((member, i) => (
							<div
								key={i}
								style={{
									padding: "28px 24px",
									background: "var(--bg-surface)",
									border: "1px solid var(--border-subtle)",
									borderRadius: 14,
									transition: "all 0.2s ease",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = "var(--border-subtle)";
								}}
							>
								<div
									style={{
										width: 56,
										height: 56,
										borderRadius: "50%",
										background:
											"linear-gradient(135deg, rgba(59,130,246,0.2), var(--bg-elevated))",
										border: "1px solid rgba(59,130,246,0.25)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: 20,
										fontWeight: 700,
										color: "var(--cta)",
										marginBottom: 16,
									}}
								>
									{member.name.charAt(0)}
								</div>
								<h3
									style={{
										fontSize: 16,
										fontWeight: 700,
										color: "var(--text-primary)",
										marginBottom: 4,
									}}
								>
									{member.name}
								</h3>
								<p
									style={{
										fontSize: 12,
										color: "var(--accent)",
										fontWeight: 600,
										marginBottom: 12,
									}}
								>
									{member.role}
								</p>
								<p
									style={{
										fontSize: 13,
										color: "var(--text-muted)",
										lineHeight: 1.65,
										marginBottom: 14,
									}}
								>
									{member.bio}
								</p>
								<div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
									{member.certs.map((c) => (
										<span
											key={c}
											style={{
												fontSize: 10,
												fontWeight: 600,
												padding: "3px 8px",
												borderRadius: 9999,
												background: "rgba(59,130,246,0.08)",
												border: "1px solid rgba(59,130,246,0.15)",
												color: "var(--accent)",
											}}
										>
											{c}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				style={{
					padding: "64px 24px",
					borderTop: "1px solid var(--border-subtle)",
					textAlign: "center",
				}}
			>
				<div style={{ maxWidth: 600, margin: "0 auto" }}>
					<h2
						style={{
							fontSize: "clamp(22px, 3vw, 32px)",
							fontWeight: 700,
							color: "var(--text-primary)",
							marginBottom: 14,
						}}
					>
						Work with us
					</h2>
					<p
						style={{
							fontSize: 15,
							color: "var(--text-muted)",
							lineHeight: 1.7,
							marginBottom: 28,
						}}
					>
						We are always looking for exceptional security researchers, penetration testers, and software engineers. Explore our open roles and apply to join our mission.
					</p>
					<Link
						href="/careers"
						className="btn-primary"
						style={{
							fontSize: 14,
							padding: "14px 28px",
							textDecoration: "none",
						}}
					>
						View Open Careers
					</Link>
				</div>
			</section>

			<WhatsAppWidget />

			<style>{`
        @media (max-width: 900px) {
          .proof-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .proof-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
		</div>
	);
}
