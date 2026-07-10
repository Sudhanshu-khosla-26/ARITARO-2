'use client';

import { useState, useEffect, useCallback } from 'react';

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('popup-dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => setVisible(true), 10);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 320);
    sessionStorage.setItem('popup-dismissed', '1');
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => handleClose(), 2800);
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-base)',
    border: `1px solid ${focused === field ? 'rgba(59,130,246,0.6)' : 'var(--border-subtle)'}`,
    borderRadius: 7,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    boxShadow: focused === field ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(2,6,23,0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 9000,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: visible
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.96)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 9001,
          width: '90%',
          maxWidth: 460,
        }}
      >
        <div style={{
          position: 'relative',
          background: 'rgba(10, 15, 35, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          {/* Blue top stripe */}
          <div style={{
            height: 3,
            background: 'var(--cta)',
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 30, height: 30, borderRadius: 6,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div style={{ padding: '32px 36px 36px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(74,222,128,0.12)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 18px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  You&apos;re in!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Check your inbox — your free security checklist is on its way.
                </p>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  color: 'var(--cta)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                    <path d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z"
                      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M10 14l2.5 2.5L18 11" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <h2 id="popup-title" style={{
                  fontSize: 20, fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.25, marginBottom: 8,
                }}>
                  Get your free{' '}
                  <span style={{ color: 'var(--accent)' }}>Security Audit Checklist</span>
                </h2>

                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>
                  Our expert-crafted 47-point checklist used by Fortune 500 security
                  teams to identify critical vulnerabilities completely free.
                </p>

                {/* Value points */}
                <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    '47-point vulnerability assessment framework',
                    'Network & endpoint security checklist',
                    'Compliance readiness guide',
                  ].map((point, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{point}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 10 }}>
                    <input
                      type="text" placeholder="Your name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      required style={inputStyle('name')}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <input
                      type="email" placeholder="Work email address"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                      required style={inputStyle('email')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
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
                        Get Free Checklist
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10, opacity: 0.6 }}>
                    🔒 Zero spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: var(--text-muted); opacity: 0.5; }
      `}</style>
    </>
  );
}
