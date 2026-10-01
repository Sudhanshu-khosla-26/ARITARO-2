'use client';

import Link from 'next/link';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { useCart } from './CartContext';

const services = [
  {
    number: '01',
    slug: 'api-pt',
    title: 'API Penetration Testing',
    short: 'API SECURITY',
    tag: 'OWASP API TOP 10',
    desc: 'Deep manual and automated testing of modern APIs to uncover authorization flaws, broken authentication, exposed data and business-logic vulnerabilities.',
    features: [
      'REST / GraphQL / gRPC / SOAP',
      'JWT & OAuth authentication',
      'BOLA / IDOR testing',
      'Business logic analysis',
    ],
    duration: '1–2 WEEKS',
    href: '/services/api-pt',
    color: '#3B82F6',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="7" rx="1.5" />
        <rect x="3" y="14" width="18" height="7" rx="1.5" />
        <circle cx="7" cy="6.5" r="0.7" fill="currentColor" />
        <circle cx="7" cy="17.5" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: '02',
    slug: 'wap-pt',
    title: 'Web Application Pentest',
    short: 'WEB SECURITY',
    tag: 'WEB APPLICATIONS',
    desc: 'Logic-aware security testing for enterprise web applications, focusing on vulnerabilities that automated scanners frequently miss.',
    features: [
      'OWASP Top 10 assessment',
      'Privilege escalation',
      'Authentication bypass',
      'Injection & client-side attacks',
    ],
    duration: '2–3 WEEKS',
    href: '/services/wap-pt',
    color: '#06B6D4',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="13" rx="1.5" />
        <path d="M8 20h8" />
        <path d="M12 17v3" />
      </svg>
    ),
  },
  {
    number: '03',
    slug: 'cloud',
    title: 'Cloud Security Assessment',
    short: 'CLOUD SECURITY',
    tag: 'AWS · AZURE · GCP',
    desc: 'Security review of cloud architecture, identity controls, public assets and infrastructure configurations to identify attack paths before they become incidents.',
    features: [
      'IAM & role analysis',
      'CIS configuration review',
      'Kubernetes & container security',
      'Public exposure analysis',
    ],
    duration: '1–3 WEEKS',
    href: '/services/cloud',
    color: '#818CF8',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7.5 18h9a4 4 0 0 0 .5-7.97A6 6 0 0 0 5.2 11.2 3.5 3.5 0 0 0 7.5 18Z" />
      </svg>
    ),
  },
  {
    number: '04',
    slug: 'ai-pt',
    title: 'AI & LLM Penetration Testing',
    short: 'AI SECURITY',
    tag: 'NEXT-GEN AI SYSTEMS',
    desc: 'Adversarial testing for LLM applications, RAG pipelines and agentic systems, covering prompt injection, jailbreaks and unsafe tool access.',
    features: [
      'OWASP LLM Top 10',
      'Prompt injection testing',
      'RAG poisoning analysis',
      'Agent & tool-call security',
    ],
    duration: '2–4 WEEKS',
    href: '/services/ai-pt',
    color: '#A855F7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const { cartItems, addToCart } = useCart();

  return (
    <section id="services" className="services-section">

      {/* Background */}
      <div className="services-grid" />
      <div className="services-glow" />

      {/* Header */}
      <header className="services-header">
        <div className="services-kicker">
          <span />
          SECURITY SERVICES
          <span />
        </div>
        <h2>
          Security built around
          <br />
          <span>real attack surfaces.</span>
        </h2>
        <p>
          Focused offensive security assessments for APIs, applications, cloud
          infrastructure and AI systems.
        </p>
      </header>

      {/* ─── SCROLL STACK ─── */}
      <div className="services-stack-wrap">
        <ScrollStack
          itemDistance={90}
          itemStackDistance={28}
          stackPosition={110}
          scaleEndPosition="90px"
          baseScale={0.92}
          itemScale={0.018}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll={true}
        >
          {services.map((service, index) => {
            const isAdded = cartItems.some(
              (item) => item.number === service.slug || item.title === service.title
            );

            return (
              <ScrollStackItem key={service.slug} itemClassName="service-stack-item">
                <article className="service-card">

                  {/* Colored top-edge accent */}
                  <div
                    className="card-accent"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${service.color} 40%, transparent 100%)`,
                    }}
                  />

                  {/* Top bar */}
                  <div className="service-topbar">
                    <div className="service-number">
                      <span className="active-number">{service.number}</span>
                      <span className="number-divider">/</span>
                      <span>04</span>
                    </div>

                    <div className="service-type" style={{ color: service.color }}>
                      {service.short}
                    </div>

                    <div className="service-status">
                      <i />
                      AVAILABLE
                    </div>
                  </div>

                  {/* Main grid */}
                  <div className="service-content">

                    {/* LEFT */}
                    <div className="service-left">
                      <div
                        className="service-icon"
                        style={{
                          color: service.color,
                          background: `${service.color}14`,
                          borderColor: `${service.color}35`,
                        }}
                      >
                        {service.icon}
                      </div>

                      <div className="service-tag">{service.tag}</div>
                      <h3>{service.title}</h3>
                      <p>{service.desc}</p>

                      <div className="service-actions">
                        <Link href={service.href} className="service-primary">
                          <span>Explore Service</span>
                          <span className="service-arrow">↗</span>
                        </Link>

                        <button
                          type="button"
                          className={`service-scope${isAdded ? ' active' : ''}`}
                          onClick={() =>
                            addToCart({
                              number: service.slug,
                              title: service.title,
                              desc: service.desc,
                              color: service.color,
                            })
                          }
                        >
                          {isAdded ? '✓ In Scope' : '+ Add to Scope'}
                        </button>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="service-right">
                      <div className="scope-header">
                        <span>ASSESSMENT SCOPE</span>
                        <strong style={{ color: service.color }}>{service.duration}</strong>
                      </div>

                      <div className="scope-list">
                        {service.features.map((feature, fi) => (
                          <div className="scope-item" key={feature}>
                            <span className="scope-index">
                              {String(fi + 1).padStart(2, '0')}
                            </span>
                            <span className="scope-text">{feature}</span>
                            <span className="scope-icon">↗</span>
                          </div>
                        ))}
                      </div>

                      <div className="scope-footer">
                        <span>ARITARO / OFFENSIVE SECURITY</span>
                        <span>ENCRYPTED</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="service-bottombar">
                    <span>SECURITY ASSESSMENT</span>
                    <span>20{index + 1} / 2026</span>
                  </div>

                </article>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>

      {/* CTA — sits AFTER the stack container so it only scrolls in after the stack has fully released */}
      <div className="services-cta-wrap">
        <div className="services-cta-line" />

        <div className="services-cta">
          <div className="cta-copy">
            <div className="cta-label">
              <span />
              ARITARO // SECURITY ARSENAL
            </div>
            <h3>
              Need something
              <br />
              <span>beyond the core?</span>
            </h3>
            <p>
              Custom red-team operations, threat simulations, compliance
              assessments and security engineering.
            </p>
          </div>

          <Link href="/services" className="cta-button">
            <span>View all services</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      {/* ─── CSS ─── */}
      <style jsx>{`
        /* ===================================================
           SECTION
        =================================================== */
        .services-section {
          position: relative;
          background: var(--bg-base, #030712);
          color: var(--text-primary, #fff);
          /* Extra bottom padding so the CTA has breathing room */
          padding-bottom: 140px;
          overflow: visible;
        }

        /* ===================================================
           BACKGROUND DECORATIONS
        =================================================== */
        .services-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.055;
          background-image:
            linear-gradient(rgba(59, 130, 246, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.18) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 10%,
            black 84%,
            transparent 100%
          );
        }

        .services-glow {
          position: absolute;
          top: 250px;
          left: 50%;
          transform: translateX(-50%);
          width: 820px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(35, 105, 245, 0.07), transparent 70%);
          pointer-events: none;
        }

        /* ===================================================
           HEADER
        =================================================== */
        .services-header {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 100px 24px 56px;
        }

        .services-kicker {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          color: rgba(105, 145, 220, 0.6);
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.2em;
        }

        .services-kicker span {
          width: 25px;
          height: 1px;
          background: rgba(75, 125, 240, 0.35);
        }

        .services-header h2 {
          margin: 0;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 750;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: var(--text-primary, #fff);
        }

        .services-header h2 span {
          color: rgba(255, 255, 255, 0.34);
        }

        .services-header p {
          width: min(570px, 100%);
          margin: 22px auto 0;
          color: var(--text-muted, #94a3b8);
          font-size: 15px;
          line-height: 1.8;
        }

        /* ===================================================
           STACK WRAPPER
           • width + centering only — no overflow constraints
             so the translateY transform can move cards freely
        =================================================== */
        .services-stack-wrap {
          position: relative;
          z-index: 2;
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding-top: 28px;
          padding-bottom: 500px;
          overflow: visible;
        }

        /* The ScrollStackItem wrapper itself — no extra styling */
        .service-stack-item {
          /* no padding / margin here — ScrollStack.jsx manages margin-bottom */
        }

        /* ===================================================
           CARD  (fully opaque → zero bleed-through)
        =================================================== */
        .service-card {
          position: relative;
          min-height: 440px;
          box-sizing: border-box;
          overflow: hidden;
          /* 100 % opaque — nothing behind it can show through */
          background: #090e18;
          border: 1px solid rgba(75, 125, 220, 0.2);
          border-radius: 20px;
          box-shadow:
            0 28px 70px rgba(0, 0, 0, 0.8),
            0 2px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .service-card:hover {
          border-color: rgba(90, 150, 255, 0.38);
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.85),
            0 0 40px rgba(59, 130, 246, 0.08);
        }

        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          pointer-events: none;
        }

        /* ===================================================
           TOP BAR
        =================================================== */
        .service-topbar {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          height: 52px;
          padding: 0 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          background: rgba(255, 255, 255, 0.015);
        }

        .service-number {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255, 255, 255, 0.35);
        }

        .active-number {
          color: #fff;
          font-weight: 700;
        }

        .number-divider {
          color: rgba(255, 255, 255, 0.2);
        }

        .service-type {
          font-weight: 700;
        }

        .service-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #10b981;
          font-size: 10px;
        }

        .service-status i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        /* ===================================================
           CONTENT GRID
        =================================================== */
        .service-content {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 40px;
          padding: 38px 36px 32px;
          align-items: center;
        }

        .service-left {
          display: flex;
          flex-direction: column;
        }

        .service-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .service-tag {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(148, 163, 184, 0.8);
          margin-bottom: 6px;
        }

        .service-left h3 {
          margin: 0 0 12px;
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fff;
          line-height: 1.15;
        }

        .service-left p {
          margin: 0 0 28px;
          font-size: 14.5px;
          line-height: 1.7;
          color: #94a3b8;
          max-width: 460px;
        }

        .service-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .service-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #2563eb;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .service-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .service-arrow {
          font-size: 15px;
        }

        .service-scope {
          padding: 10px 18px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .service-scope:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .service-scope.active {
          background: rgba(16, 185, 129, 0.12);
          border-color: #10b981;
          color: #34d399;
        }

        /* ===================================================
           SCOPE PANEL (RIGHT)
        =================================================== */
        .service-right {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 24px;
        }

        .scope-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #64748b;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .scope-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .scope-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          color: #cbd5e1;
        }

        .scope-index {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
        }

        .scope-text {
          flex: 1;
        }

        .scope-icon {
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
        }

        .scope-footer {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.28);
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* ===================================================
           BOTTOM BAR
        =================================================== */
        .service-bottombar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 42px;
          padding: 0 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.35);
          background: rgba(0, 0, 0, 0.2);
        }

        /* ===================================================
           CTA SECTION
           • negative margin-top pulls it up so it meets the
             tail of the stack-wrap padding cleanly.
           • z-index 3 ensures it sits above the stack when
             the user scrolls past the release point.
        =================================================== */
        .services-cta-wrap {
          position: relative;
          z-index: 3;
          margin-top: -400px;
          width: min(1120px, calc(100% - 40px));
          margin-left: auto;
          margin-right: auto;
        }

        .services-cta-line {
          width: 1px;
          height: 48px;
          margin: 0 auto 30px;
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), transparent);
        }

        .services-cta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 36px;
          background: linear-gradient(135deg, #091222 0%, #050a14 100%);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 20px;
          padding: 44px 48px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
        }

        .cta-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: #3b82f6;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .cta-label span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 10px #3b82f6;
        }

        .services-cta h3 {
          margin: 0;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 750;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: #fff;
        }

        .services-cta h3 span {
          color: rgba(255, 255, 255, 0.34);
        }

        .services-cta p {
          max-width: 520px;
          margin: 14px 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: #94a3b8;
        }

        .cta-button {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 26px;
          background: #2563eb;
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .cta-button:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* ===================================================
           RESPONSIVE
        =================================================== */
        @media (max-width: 860px) {
          .service-content {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 30px 24px;
          }

          .services-cta {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 28px;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .service-card {
            min-height: auto;
          }

          .service-topbar {
            padding: 0 18px;
          }

          .service-bottombar {
            padding: 0 18px;
          }

          .services-cta-wrap {
            margin-top: -340px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .service-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}