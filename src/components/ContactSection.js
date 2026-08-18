'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: 'Call Us',
    value: '+91 96258 94393',
    href: 'tel:+919625894393',
    sub: 'Mon–Sat, 9AM–7PM IST',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'info@aritaro.in',
    href: 'mailto:info@aritaro.in',
    sub: 'Response within 2 hours',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Office',
    value: 'New Delhi, India',
    href: 'https://maps.google.com/?q=New+Delhi+India',
    sub: 'A-14, Sector 63, Noida • By appointment only',
  },
];

const services = [
  'Vulnerability Assessment & Pen Testing',
  'AI Business Process Automation',
  'Managed Security Services (24/7 SOC)',
  'Cybersecurity Awareness Training',
  'Compliance & Audit (CERT-In, GDPR)',
  'Red Team / Blue Team Exercises',
  'Chatbot & AI Agent Development',
  'Cloud Security Architecture',
  'Other / Not Sure',
];

export default function ContactSection() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    // Pre-populate fields from session if available
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    [headingRef, formRef].forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateY(32px)';
        ref.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company,
          service: formData.service || undefined,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit request');

      toast.success('Request submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit contact request');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-base)',
    border: `1px solid ${focused === fieldName ? 'rgba(59,130,246,0.6)' : 'var(--border-subtle)'}`,
    borderRadius: '7px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    boxShadow: focused === fieldName ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
  });

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-muted)',
    marginBottom: '6px',
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: '72px 0',
        background: 'var(--bg-base)',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'var(--border-subtle)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            GET IN TOUCH
          </div>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            marginBottom: 14,
          }}>
            Ready to secure your organization?
          </h2>
          <p style={{
            maxWidth: 480,
            margin: '0 auto',
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--text-muted)',
          }}>
            Book a free 30-minute security assessment. No sales pressure —
            just expert insights on your security posture.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: 32,
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left: contact info */}
          <div>
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Start a conversation
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Our security experts are ready to help. Reach us through any channel.
              </p>
            </div>

            {/* Contact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    transition: 'all 0.2s ease',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = '';
                  }}
                >
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cta)',
                  }}>
                    {method.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      marginBottom: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {method.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {method.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {method.sub}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Certs */}
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                COMPLIANCE & CERTIFICATIONS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['ISO 27001', 'SOC 2 Type II', 'CERT-In', 'GDPR', 'PCI-DSS'].map((cert) => (
                  <span key={cert} style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    background: 'rgba(59,130,246,0.07)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: 9999,
                    color: 'var(--accent)',
                  }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} style={{
            background: '',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: '36px',
            position: 'relative',
          }}>
            {!isLoggedIn ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#818CF8'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Authentication Required
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 28px' }}>
                  To schedule your scoping assessment and protect against spam, please log in to your account.
                </p>
                <Link
                  href="/login?callbackUrl=%2F%23contact"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    fontSize: 14,
                    padding: '12px 24px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  Log In to Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                  </svg>
                </Link>
              </div>
            ) : submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(74,222,128,0.12)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                  Message sent!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 24px' }}>
                  Our security team will get back to you within 2 business hours with a tailored response.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: session?.user?.name || '', email: session?.user?.email || '', phone: '', company: '', service: '', message: '' }); }}
                  className="btn-ghost"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="form-row">
                  <div>
                    <label htmlFor="name" style={labelStyle}>Full Name *</label>
                    <input id="name" name="name" type="text" placeholder="John Smith"
                      value={formData.name} onChange={handleChange}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      required style={inputStyle('name')} />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Work Email *</label>
                    <input id="email" name="email" type="email" placeholder="john@company.com"
                      value={formData.email} onChange={handleChange}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                      required style={inputStyle('email')} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="form-row">
                  <div>
                    <label htmlFor="phone" style={labelStyle}>Phone</label>
                    <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210"
                      value={formData.phone} onChange={handleChange}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      style={inputStyle('phone')} />
                  </div>
                  <div>
                    <label htmlFor="company" style={labelStyle}>Company *</label>
                    <input id="company" name="company" type="text" placeholder="Acme Corp"
                      value={formData.company} onChange={handleChange}
                      onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                      required style={inputStyle('company')} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label htmlFor="service" style={labelStyle}>Service Interested In</label>
                  <select id="service" name="service"
                    value={formData.service} onChange={handleChange}
                    onFocus={() => setFocused('service')} onBlur={() => setFocused('')}
                    style={{ ...inputStyle('service'), cursor: 'pointer' }}
                  >
                    <option value="">Select a service…</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label htmlFor="message" style={labelStyle}>Tell Us About Your Needs *</label>
                  <textarea id="message" name="message" rows={4}
                    placeholder="Describe your security challenges, infrastructure size, and timeline…"
                    value={formData.message} onChange={handleChange}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                    required style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 100 }}
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.75 : 1, cursor: submitting ? 'wait' : 'pointer' }}
                >
                  {submitting ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'rotate-slow 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Book Free Security Assessment
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                  🔒 Your data is encrypted and never shared. No spam, ever.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
        select option { background: var(--bg-surface); color: var(--text-primary); }
      `}</style>
    </section>
  );
}
