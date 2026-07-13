"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { listJobOpportunities } from "@/actions/admin.actions";

const ROLES = [
  {
    id: "api-pentester",
    title: "API Penetration Tester",
    department: "Offensive Security",
    location: "Remote / India",
    type: "Full-Time",
  },
  {
    id: "web-pentester",
    title: "Web Application Pentester",
    department: "Offensive Security",
    location: "Remote / India",
    type: "Full-Time",
  },
  {
    id: "cloud-security",
    title: "Cloud Security Assessment Lead",
    department: "Offensive Security",
    location: "Remote",
    type: "Full-Time",
  },
  {
    id: "ai-llm-security",
    title: "AI/LLM Security Researcher",
    department: "Research & Development",
    location: "Remote",
    type: "Full-Time",
  }
];

const CULTURE_VALUES = [
  {
    title: "Offensive Focus",
    desc: "We dig deep to find logic flaws. Real security requires thinking like an adversary."
  },
  {
    title: "Ownership",
    desc: "You own assessments from scope to final report, making a direct impact on global platforms."
  },
  {
    title: "Remote-First",
    desc: "Work from anywhere, with flexible hours built around asynchronous collaboration and trust."
  },
  {
    title: "Continuous Growth",
    desc: "We sponsor OSCP, OSEP, and cloud certifications, plus dedicated time for security research."
  }
];

export default function CareersPage() {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await listJobOpportunities();
      if (res.success && res.jobs && res.jobs.length > 0) {
        setJobsList(res.jobs.filter(j => j.isPublished));
      } else {
        setJobsList(ROLES);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", position: "relative" }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 80px" }}>
        
        {/* Split Layout Container */}
        <div className="careers-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }}>
          
          {/* LEFT COLUMN: Sticky Info & Hero */}
          <div style={{ position: "sticky", top: 120, display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="section-label" style={{ alignSelf: "flex-start", marginBottom: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
              WE'RE HIRING
            </div>

            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(32px, 4.5vw, 54px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "var(--text-primary)",
              margin: 0
            }}>
              Join the Frontlines of{' '}
              <span style={{
                background: "linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Security
              </span>
            </h1>

            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.65, margin: 0, maxWidth: 440 }}>
              We are building a highly focused, elite offensive security team. Bring your technical depth, challenge the defaults, and help secure modern digital infrastructure.
            </p>

            <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="mailto:careers@aritaro.com?subject=Speculative Application" className="btn-ghost" style={{ padding: "10px 20px", fontSize: 13, textDecoration: "none", border: "1px solid var(--border-subtle)", borderRadius: 6 }}>
                Email Resume &nbsp;→
              </Link>
              <Link href="/contact?subject=Speculative%20Job%20Application&message=Please%20provide%20your%20LinkedIn/Github/Portfolio%20link%20and%20why%20you%20want%20to%20join%20Aritaro." className="btn-primary" style={{ padding: "10px 20px", fontSize: 13, textDecoration: "none", borderRadius: 6 }}>
                Apply via Platform &nbsp;→
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Culture & Open Roles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            
            {/* Why Us / Culture Section */}
            <div>
              <div style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: 11, 
                letterSpacing: "1.5px", 
                color: "var(--accent)", 
                textTransform: "uppercase",
                marginBottom: 20,
                fontWeight: 600
              }}>
                OUR CULTURE
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="culture-grid">
                {CULTURE_VALUES.map((val, i) => (
                  <div key={i} style={{
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 12,
                    padding: "20px",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{val.title}</h3>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Positions Section */}
            <div>
              <div style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: 11, 
                letterSpacing: "1.5px", 
                color: "var(--accent)", 
                textTransform: "uppercase",
                marginBottom: 20,
                fontWeight: 600
              }}>
                OPEN POSITIONS ({jobsList.length})
              </div>

              {loading ? (
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading openings...</div>
              ) : jobsList.length === 0 ? (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  background: "rgba(15, 23, 42, 0.4)",
                  border: "1px dashed var(--border-subtle)",
                  borderRadius: 12,
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>No active openings</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>We are always happy to meet talented researchers. Submit a speculative application using the link on the left.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {jobsList.map((role) => (
                    <div key={role.id || role._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 0",
                        borderBottom: "1px solid var(--border-subtle)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={() => setHoveredRole(role.id || role._id)}
                      onMouseLeave={() => setHoveredRole(null)}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <h3 style={{ 
                          fontSize: 16, 
                          fontWeight: 600, 
                          color: hoveredRole === (role.id || role._id) ? "var(--accent)" : "var(--text-primary)", 
                          margin: 0,
                          transition: "color 0.2s ease"
                        }}>
                          {role.title}
                        </h3>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{role.department}</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-subtle)" }} />
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{role.location}</span>
                          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-subtle)" }} />
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{role.type}</span>
                        </div>
                      </div>

                      <Link href={`/contact?subject=Application%20for%20${encodeURIComponent(role.title)}&message=Hi%20Aritaro%20Team%2C%0A%0AI%20am%20applying%20for%20the%20${encodeURIComponent(role.title)}%20position.%20Please%20find%20my%20details%20below%3A`} className="btn-primary" style={{ padding: "8px 16px", fontSize: 12, borderRadius: 6, textDecoration: "none" }}>
                        Apply
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Speculative footer inside the column */}
            <div style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.2)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap"
            }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>Looking for something else?</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>If your skills don't fit our active listings, reach out anyway.</p>
              </div>
              <a href="mailto:careers@aritaro.com?subject=Speculative Application" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}>
                Get in touch →
              </a>
            </div>

          </div>

        </div>

      </main>

      <WhatsAppWidget />

      <style>{`
        @media (max-width: 900px) {
          .careers-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          .careers-layout > div:first-child { position: static !important; }
        }
        @media (max-width: 500px) {
          .culture-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
