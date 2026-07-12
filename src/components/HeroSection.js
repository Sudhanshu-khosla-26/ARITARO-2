"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FloatingLines from "./FloatingLines";
import CertificationBadges from "./CertificationBadges";

export default function HeroSection() {
	const sectionRef = useRef(null);
	const labelRef = useRef(null);
	const headingRef = useRef(null);
	const subRef = useRef(null);
	const actionsRef = useRef(null);
	const trustRef = useRef(null);

	const [isLight, setIsLight] = useState(false);

	/* ── theme detection ── */
	useEffect(() => {
		const check = () =>
			setIsLight(
				document.documentElement.getAttribute("data-theme") === "light",
			);
		check();
		const obs = new MutationObserver(check);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => obs.disconnect();
	}, []);

	/* ── entrance animations ── */
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap
				.timeline({ delay: 0.15 })
				.fromTo(
					labelRef.current,
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
				)
				.fromTo(
					headingRef.current,
					{ y: 32, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
					"-=0.3",
				)
				.fromTo(
					subRef.current,
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
					"-=0.4",
				)
				.fromTo(
					actionsRef.current,
					{ y: 16, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
					"-=0.3",
				)
				.fromTo(
					trustRef.current,
					{ y: 12, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
					"-=0.25",
				);
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	/* ── scroll transitions ── */
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	// Ease-out function approximating cubic-bezier(0.16, 1, 0.3, 1)
	const backgroundOpacity = useTransform(scrollYProgress, [0.3, 1], [1, 0], {
		ease: (t) => 1 - Math.pow(1 - t, 4)
	});

	return (
		<section
			id="hero"
			ref={sectionRef}
			style={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				padding: "140px 32px 80px",
				background: isLight
					? "#ffffff"
					: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.1) 0%, transparent 60%), var(--bg-base)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* FloatingLines — fills the full section as a background */}
			<motion.div
				style={{
					position: "absolute",
					inset: 0,
					zIndex: 0,
					pointerEvents: "none",
					WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
					maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
					opacity: prefersReducedMotion ? 1 : backgroundOpacity,
				}}
			>
				<FloatingLines
					linesGradient={[
						"#22d3ee",
						"#3b82f6",
						"#6366f1",
						"#3b82f6",
						"#22d3ee",
					]}
					enabledWaves={["top", "middle", "bottom"]}
					lineCount={[4, 6, 4]}
					lineDistance={[5, 4, 5]}
					animationSpeed={0.6}
					interactive={false}
					parallax={false}
					mixBlendMode={isLight ? "normal" : "screen"}
					backgroundColor={isLight ? "#ffffff" : "#000000"}
				/>
			</motion.div>


			{/* Subtle grid texture above lines and fade overlay */}
			<div
				className="cyber-grid"
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.2,
					pointerEvents: "none",
					zIndex: 1,
				}}
			/>

			{/* Content (above everything) */}
			<div
				style={{
					position: "relative",
					zIndex: 2,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{/* Section label */}
				{/* <div ref={labelRef}>
          <div className="section-label">
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)', flexShrink: 0,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            AI-POWERED CYBERSECURITY
          </div> */}
				{/* </div> */}

				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginBottom: 24,
						borderRadius: 16,
						background: "rgba(255, 255, 255, 0.05)",
						boxShadow:
							"inset 2px 2px 12px rgba(255, 255, 255, 0.2), inset -2px -2px 12px rgba(255, 255, 255, 0.2)",
						backdropFilter: "blur(2px)",
						WebkitBackdropFilter: "blur(2px)",
						padding: "16px 36px",
					}}
				>
					{/* Sharp text on top */}
					<h1
						ref={headingRef}
						style={{
							position: "relative",
							zIndex: 1,
							fontSize: "clamp(40px, 6vw, 68px)",
							fontWeight: 900,
							letterSpacing: "4px",
							lineHeight: 1.1,
							background: "linear-gradient(135deg, #818CF8, #22D3EE)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							color: "transparent",
							margin: 0,
						}}
					>
						ARITARO
					</h1>
					<span
						style={{
							fontSize: "clamp(9px, 1.2vw, 11px)",
							fontWeight: 600,
							letterSpacing: "0.22em",
							color: "rgba(255, 255, 255, 0.55)",
							marginTop: 6,
							textTransform: "uppercase",
						}}
					>
						Advance Security Solutions
					</span>
				</div>

				{/*SUB HEADING*/}
				{/* <h2
					style={{
						fontSize: "clamp(1vx, 2vw, 4vw)",
            fontStyle: "italic",
						fontWeight: 500,
						lineHeight: 1.1,
						color: "var(--text-primary)",
						maxWidth: 800,
						marginBottom: 24,
						textShadow: isLight
							? "none"
							: "0 2px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)",
					}}
				>
					ARITARO
				</h2> */}

				{/* Subtitle */}
				<p
					ref={subRef}
					style={{
						fontSize: 17,
						color: "var(--text-muted)",
						maxWidth: 560,
						lineHeight: 1.75,
						margin: "0 0 40px",
						textShadow: isLight
							? "none"
							: "0 1px 12px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6)",
					}}
				>
					We help businesses secure their digital systems through in-depth
					cybersecurity audits, intelligent threat detection, and targeted risk
					reduction.
				</p>

				{/* CTA row */}
				<div
					ref={actionsRef}
					style={{
						display: "flex",
						gap: 12,
						flexWrap: "wrap",
						justifyContent: "center",
						marginBottom: 34,
					}}
				>
					<button
						className="btn-primary"
						onClick={() => {
							const el = document.querySelector("#contact");
							if (el) el.scrollIntoView({ behavior: "smooth" });
						}}
					>
						Request Assessment
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>

					<button
						className="btn-ghost"
						onClick={() => {
							const el = document.querySelector("#services");
							if (el) el.scrollIntoView({ behavior: "smooth" });
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="1.5"
							/>
							<polygon
								points="10,8 16,12 10,16"
								fill="currentColor"
							/>
						</svg>
						Demo Report
					</button>
				</div>

				{/* Trust bar */}
				<div
					ref={trustRef}
					style={{
						display: "flex",
						gap: "clamp(16px, 4vw, 40px)",
						flexWrap: "wrap",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{["ISO 27001", "Google Certified", "Global Ready"].map((item, i) => (
						<span
							key={i}
							style={{
								fontSize: 12,
								color: "var(--text-muted)",
								letterSpacing: "0.05em",
								textTransform: "uppercase",
								display: "flex",
								alignItems: "center",
								gap: 6,
							}}
						>
							{i > 0 && (
								<span
									style={{
										width: 3,
										height: 3,
										borderRadius: "50%",
										background: "var(--border-subtle)",
										marginRight: 4,
									}}
								/>
							)}
							{item}
						</span>
					))}
				</div>
				{/* <CertificationBadges /> */}
			</div>

		</section>
	);
}
