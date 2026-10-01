"use client";

// Real client company logos — proper institutional wordmarks.
// Pure SVG, monochrome white, consistent 44px height.

const LOGOS = [
  {
    name: "IISPPR",
    fullName: "International Institute of SDGs and Public Policy Research",
    svg: (
      <svg viewBox="0 0 220 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 34, width: "auto" }}>
        {/* Globe/SDG icon */}
        <circle cx="22" cy="22" r="14" stroke="white" strokeWidth="1.6" opacity="0.85" fill="none"/>
        <ellipse cx="22" cy="22" rx="7" ry="14" stroke="white" strokeWidth="1.2" opacity="0.5" fill="none"/>
        <line x1="8" y1="22" x2="36" y2="22" stroke="white" strokeWidth="1.2" opacity="0.5"/>
        <line x1="10" y1="15" x2="34" y2="15" stroke="white" strokeWidth="1" opacity="0.35"/>
        <line x1="10" y1="29" x2="34" y2="29" stroke="white" strokeWidth="1" opacity="0.35"/>
        {/* Wordmark */}
        <text x="46" y="19" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="13" fill="white" letterSpacing="2" opacity="0.9">IISPPR</text>
        <text x="46" y="34" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="400" fontSize="9" fill="white" letterSpacing="0.3" opacity="0.45">PUBLIC POLICY RESEARCH</text>
      </svg>
    ),
  },
  {
    name: "Anej Technology",
    fullName: "Anej Technology Pvt. Ltd",
    svg: (
      <svg viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 34, width: "auto" }}>
        {/* Circuit / tech icon */}
        <rect x="8" y="14" width="10" height="10" rx="2" stroke="white" strokeWidth="1.6" fill="none" opacity="0.85"/>
        <rect x="18" y="20" width="8" height="8" rx="1.5" stroke="white" strokeWidth="1.4" fill="none" opacity="0.6"/>
        <rect x="26" y="12" width="10" height="10" rx="2" stroke="white" strokeWidth="1.6" fill="none" opacity="0.85"/>
        <line x1="18" y1="19" x2="22" y2="16" stroke="white" strokeWidth="1.2" opacity="0.5"/>
        <line x1="26" y1="24" x2="22" y2="24" stroke="white" strokeWidth="1.2" opacity="0.5"/>
        <line x1="8" y1="30" x2="8" y2="34" stroke="white" strokeWidth="1.2" opacity="0.4"/>
        <line x1="31" y1="22" x2="31" y2="34" stroke="white" strokeWidth="1.2" opacity="0.4"/>
        {/* Wordmark */}
        <text x="48" y="20" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="14" fill="white" letterSpacing="-0.3" opacity="0.9">ANEJ</text>
        <text x="48" y="34" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="500" fontSize="10.5" fill="white" letterSpacing="0.5" opacity="0.55">TECHNOLOGY PVT. LTD</text>
      </svg>
    ),
  },
  {
    name: "AAI",
    fullName: "Airports Authority of India",
    svg: (
      <svg viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 34, width: "auto" }}>
        {/* Airplane / airport icon */}
        <path
          d="M22 8 C22 8 16 18 8 22 L12 24 L18 22 L18 36 L22 34 L26 36 L26 22 L32 24 L36 22 C28 18 22 8 22 8Z"
          stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(255,255,255,0.08)" opacity="0.9"
        />
        {/* Ground line */}
        <line x1="4" y1="38" x2="40" y2="38" stroke="white" strokeWidth="1.2" opacity="0.35"/>
        {/* Wordmark */}
        <text x="52" y="20" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="15" fill="white" letterSpacing="1.5" opacity="0.9">AAI</text>
        <text x="52" y="34" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="400" fontSize="9" fill="white" letterSpacing="0.25" opacity="0.45">AIRPORTS AUTHORITY OF INDIA</text>
      </svg>
    ),
  },
];

function LogoItem({ logo }) {
  return (
    <div
      title={logo.fullName}
      style={{
        flexShrink: 0,
        padding: "0 56px",
        opacity: 0.35,
        transition: "opacity 0.35s ease",
        display: "flex",
        alignItems: "center",
        cursor: "default",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.92"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.35"; }}
    >
      {logo.svg}
    </div>
  );
}

export default function CompanyLogosSection() {
  // Triple the array for seamless infinite loop
  const items = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section
      style={{
        position: "relative",
        padding: "52px 0",
        background: "var(--bg-base)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <p
        style={{
          textAlign: "center",
          fontSize: 10,
          fontFamily: "var(--font-mono), monospace",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          marginBottom: 36,
        }}
      >
        Trusted by security teams &amp; fast-scaling enterprises
      </p>

      {/* Marquee */}
      <div style={{ position: "relative" }}>
        {/* Fade masks */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 200,
            background: "linear-gradient(90deg, var(--bg-base) 0%, transparent 100%)",
            zIndex: 10, pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 200,
            background: "linear-gradient(-90deg, var(--bg-base) 0%, transparent 100%)",
            zIndex: 10, pointerEvents: "none",
          }}
        />

        <div style={{ overflow: "hidden" }}>
          <div
            className="logos-marquee"
            style={{ display: "flex", alignItems: "center", width: "max-content" }}
          >
            {items.map((logo, i) => (
              <LogoItem key={i} logo={logo} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logos-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 4)); }
        }
        .logos-marquee {
          animation: logos-scroll 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
