"use client";

import { ContactForm } from "@/components/forms/contact-form";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Mail, MapPin, Phone } from "lucide-react";

const contactMethods = [
	{
		icon: <Mail />,
		label: "Email",
		value: "info@aritaro.in",
		sub: "Response within 2 hours",
	},
	{
		icon: <Phone />,
		label: "Call Us",
		value: "+91 99999 99999",
		sub: "Mon–Sat, 9AM–7PM IST",
	},
	{
		icon: <MapPin />,
		label: "Office",
		value: "New Delhi, India",
		sub: "By appointment only",
	},
];

export default function ContactClient() {
	return (
		<div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
			<section
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					padding: "120px 32px 80px",
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"radial-gradient(ellipse 80% 50% at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)",
						pointerEvents: "none",
					}}
				/>
				<div
					className="cyber-grid"
					style={{
						position: "absolute",
						inset: 0,
						opacity: 0.1,
						pointerEvents: "none",
					}}
				/>

				<div
					className="contact-page-grid"
					style={{
						position: "relative",
						zIndex: 1,
						width: "100%",
						maxWidth: 1400,
						margin: "0 auto",
						display: "grid",
						gridTemplateColumns: "1fr 1.4fr",
						gap: 128,
						alignItems: "center",
					}}
				>
					{/* Left — heading & info */}
					<div>
						<div
							className="section-label"
							style={{ marginBottom: 24 }}
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "var(--accent)",
									boxShadow: "0 0 8px rgba(34,211,238,0.5)",
									animation: "pulse-glow 2s ease-in-out infinite",
								}}
							/>
							GET IN TOUCH
						</div>

						<h1
							style={{
								fontSize: "clamp(32px, 4vw, 52px)",
								fontWeight: 800,
								color: "var(--text-primary)",
								lineHeight: 1.1,
								marginBottom: 20,
							}}
						>
							Secure Your Business With{" "}
							<span style={{ color: "var(--accent)" }}>
								Expert Cybersecurity
							</span>
						</h1>

						<p
							style={{
								fontSize: 16,
								color: "var(--text-muted)",
								lineHeight: 1.75,
								marginBottom: 40,
								maxWidth: 440,
							}}
						>
							Whether you need penetration testing, security consulting,
							vulnerability assessments, or incident response support, our
							security experts are ready to help.
						</p>

						<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
							{contactMethods.map((method) => (
								<div
									key={method.label}
									style={{
										display: "flex",
										alignItems: "center",
										gap: 14,
										padding: "14px 16px",
										border: "1px solid var(--border-subtle)",
										borderRadius: 10,
										transition: "all 0.2s ease",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
										e.currentTarget.style.background =
											"rgba(59, 130, 246, 0.08)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = "var(--border-subtle)";
										e.currentTarget.style.background = "";
									}}
								>
									<div
										style={{
											width: 38,
											height: 38,
											borderRadius: 8,
											flexShrink: 0,
											background: "rgba(59,130,246,0.1)",
											border: "1px solid rgba(59,130,246,0.2)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "var(--cta)",
										}}
									>
										{method.icon}
									</div>
									<div>
										<div
											style={{
												fontSize: 11,
												fontWeight: 500,
												color: "var(--text-muted)",
												marginBottom: 1,
												textTransform: "uppercase",
												letterSpacing: "0.06em",
											}}
										>
											{method.label}
										</div>
										<div
											style={{
												fontSize: 14,
												fontWeight: 500,
												color: "var(--text-primary)",
											}}
										>
											{method.value}
										</div>
										<div style={{ fontSize: 12, color: "var(--text-muted)" }}>
											{method.sub}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Right — form */}
					<div
						style={{
							padding: "36px",
							background: "var(--bg-surface)",
							border: "1px solid var(--border-subtle)",
							borderRadius: 16,
						}}
					>
						<ContactForm />
					</div>
				</div>
			</section>

			<WhatsAppWidget />

			<style>{`
        @media (max-width: 900px) {
          .contact-page-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 600px) {
          .contact-page-grid {
            gap: 40px !important;
          }
        }
      `}</style>
		</div>
	);
}
