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
	// const trustRef = useRef(null);

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
					headingRef.current,
					{ y: 32, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
				)
				.fromTo(
					subRef.current,
					{ y: 20, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
					"-=0.4",
				)
				.fromTo(
					actionsRef.current,
					{ y: 16, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
					"-=0.3",
				)
			// .fromTo(
			// 	".trust-item",
			// 	{ y: 12, opacity: 0 },
			// 	{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 },
			// 	"-=0.25",
			// );
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	/* ── scroll transitions ── */
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	// Exact cubic-bezier(0.16, 1, 0.3, 1) evaluator solver
	const cubicBezier = (x1, y1, x2, y2) => {
		return (x) => {
			if (x <= 0) return 0;
			if (x >= 1) return 1;
			let t = x;
			for (let i = 0; i < 8; i++) {
				const cx = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
				const dx = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
				if (Math.abs(cx - x) < 1e-5) break;
				t -= (cx - x) / (dx || 1);
			}
			return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
		};
	};
	const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);

	// Tie background wrapper opacity to scroll progress using custom easeOutExpo solver
	const backgroundOpacity = useTransform(scrollYProgress, (progress) => {
		if (progress <= 0) return 1;
		if (progress >= 0.85) return 0;
		const normalized = progress / 0.85;
		const eased = easeOutExpo(normalized);
		return 1 - eased;
	});

	// Tie background wrapper y-offset (parallax) to scroll progress
	const backgroundY = useTransform(scrollYProgress, (progress) => {
		if (progress <= 0) return "0%";
		if (progress >= 1) return "15%";
		const eased = easeOutExpo(progress);
		return `${eased * 15}%`;
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
				background: isLight ? "#ffffff" : "var(--bg-base)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* FloatingLines & Radial Gradient Wrapper — fills the full section as a background */}
			<motion.div
				style={{
					position: "absolute",
					inset: 0,
					zIndex: 0,
					pointerEvents: "none",
					background: isLight
						? "#ffffff"
						: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.1) 0%, transparent 60%)",
					WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 250px), transparent 100%)",
					maskImage: "linear-gradient(to bottom, black calc(100% - 250px), transparent 100%)",
					opacity: prefersReducedMotion ? 1 : backgroundOpacity,
					y: prefersReducedMotion ? "0%" : backgroundY,
				}}
			>
				<FloatingLines
					linesGradient={[
						"#1E3A8A", // deep blue
						"#2563EB", // royal blue
						"#3b82f6", // lighter blue
						"#1E3A8A", // deep blue
						"#22d3ee", // cyan accent (sparing)
					]}
					enabledWaves={["top", "middle", "bottom"]}
					lineCount={[4, 6, 4]}
					lineDistance={[5, 4, 5]}
					animationSpeed={0.6}
					interactive={false}
					parallax={false}
					mixBlendMode={isLight ? "normal" : "screen"}
					backgroundColor={isLight ? "#ffffff" : "#000000"}
					opacity={0.6}
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
					marginTop: -55,
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

			</div>

			{/* Scroll Cue Chevron */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
				style={{
					position: "absolute",
					bottom: 32,
					zIndex: 3,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 8,
					color: "var(--text-muted)",
					opacity: 0.7,
				}}
			>
				<span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</motion.div>

		</section>
	);
}
