"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  { end: 500, suffix: "+", label: "Security Assessments" },
  { end: 98,  suffix: "%", label: "Client Satisfaction" },
  { end: 50,  suffix: "+", label: "Enterprise Clients" },
  { end: 15,  suffix: "+", label: "Years Experience" },
];

function StatItem({ end, suffix, label }) {
  const numRef  = useRef(null);
  const wrapRef = useRef(null);

  useGSAP(
    () => {
      if (!numRef.current) return;

      // Number count-up driven by ScrollTrigger progress
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 88%",
          once: true,
        },
        onUpdate() {
          if (numRef.current) {
            numRef.current.textContent = Math.round(obj.val).toLocaleString() + suffix;
          }
        },
        onComplete() {
          if (numRef.current) {
            numRef.current.textContent = end.toLocaleString() + suffix;
          }
        },
      });

      // Fade + rise entrance
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="text-center" style={{ willChange: "transform, opacity" }}>
      <div
        ref={numRef}
        style={{
          fontFamily: "var(--font-sans), monospace",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 700,
          color: "#F1F5F9",
          letterSpacing: "-1px",
          lineHeight: 1.1,
          background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        0{suffix}
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: "#64748B", letterSpacing: "0.4px" }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Subtle shimmer line across the section on enter
      gsap.fromTo(
        ".stats-divider-line",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1, ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "64px 32px",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient shimmer line */}
      <div
        className="stats-divider-line"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), rgba(59,130,246,0.5), transparent)",
          transformOrigin: "left center",
        }}
      />

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
          className="stats-grid"
        >
          {stats.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
