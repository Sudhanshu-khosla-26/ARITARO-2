'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GooeyNav from './GooeyNav';
import { useSession } from 'next-auth/react';
import { useCart } from './CartContext';
import ProfileDropdown from './kokonutui/profile-dropdown';

const megaServices = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M8 10l4 4 4-4" />
      </svg>
    ),
    title: 'API Pen Testing',
    desc: 'REST, GraphQL, gRPC & SOAP',
    color: '#3B82F6',
    href: '/services/api-pt',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Web App PT',
    desc: 'OWASP Top 10 Coverage',
    color: '#06B6D4',
    href: '/services/wap-pt',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    title: 'Cloud Security',
    desc: 'AWS · Azure · GCP Assessment',
    color: '#3B82F6',
    href: '/services/cloud',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: 'AI Pen Testing',
    desc: 'LLM & ML Security Testing',
    color: '#06B6D4',
    href: '/services/ai-pt',
  },
];

const navLinks = [
  { label: 'About', href: '/about', isRoute: true },
  { label: 'Case Studies', href: '/case-studies', isRoute: true },
  { label: 'Careers', href: '/careers', isRoute: true },
  { label: 'Blog', href: '/blog', isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const { cartItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href, requiresAuth = false) => {
    setMenuOpen(false);

    // If requires auth and not logged in, redirect to login
    if (requiresAuth && !user) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    router.push('/services');
  };

  const gooeyItems = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          Services
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="nav-chevron">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      ),
      href: '/services',
      className: 'nav-services',
      dropdown: (
        <div className="mega-menu">
          <div className="mega-header">
            <span className="mega-header-title">Our Services</span>
          </div>
          <div className="mega-grid">
            {megaServices.slice(0, 3).map((s) => (
              <Link key={s.title} href={s.href} className="mega-item" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div className="mega-icon" style={{ color: s.color }}>{s.icon}</div>
                <div>
                  <div className="mega-item-title">{s.title}</div>
                  <div className="mega-item-desc">{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mega-footer" style={{ borderTop: '1px solid var(--border-subtle)', padding: '8px 14px', textAlign: 'right' }}>
            <Link href="/services" onClick={handleServicesClick} style={{ fontSize: 11, fontWeight: 600, color: '#06B6D4', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3B82F6'} onMouseLeave={(e) => e.currentTarget.style.color = '#06B6D4'}>
              <span>View all services</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )
    },
    ...navLinks.map((link) => ({
      label: link.label,
      href: link.href,
      onClick: (e) => {
        if (!link.isRoute) {
          e.preventDefault();
          handleNavClick(link.href, link.requiresAuth);
        }
      }
    }))
  ];

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0',
          background: scrolled ? 'rgba(15, 23, 42, 0.4)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
          transition: 'background 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}>
          {/* Logo */}
          <Link href="/">
            <button
              onClick={() => handleNavClick('#top')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ width: 46, height: 46, position: 'relative', flexShrink: 0 }}>
                <Image
                  src="/aritaro-logo.png"
                  alt="Aritaro"
                  fill
                  sizes="46px"
                  priority
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#E2E8F0',
                  lineHeight: 1.1,
                  textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.3)',
                }}>
                  ARITARO
                </span>
              </div>
            </button>
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center' }}>
            <GooeyNav items={gooeyItems} />
          </div>

          {/* Right: Cart + Auth + CTA + toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cart Button */}
            <button
              onClick={openCart}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                color: '#94A3B8',
                transition: 'all 0.2s',
                marginRight: 6,
              }}
              title="View Selected Services"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItems.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#3B82F6',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #000',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    paddingLeft: 1,
                  }}
                >
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Auth — Login / Dashboard / CTA */}
            {user ? (
              <ProfileDropdown
                data={{
                  name: user.name,
                  email: user.email || 'user@aritaro.com',
                  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
                  subscription: user.role === 'admin' ? 'ADMIN' : 'CLIENT',
                  model: 'Default'
                }}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: 13, fontWeight: 600,
                    color: '#94A3B8',
                    padding: '8px 16px',
                    border: '1px solid rgba(51,65,85,0.6)',
                    borderRadius: 10,
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    fontFamily: 'var(--font-sans)',
                    background: 'rgba(15,23,42,0.4)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(15,23,42,0.4)'; }}
                >
                  Login
                </Link>
                <button
                  onClick={() => router.push('/request-assessment')}
                  className="btn-primary nav-cta-desktop"
                  style={{
                    fontSize: 13,
                    padding: '9px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Get Protected
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="nav-hamburger"
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: 8,
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <path d="M18 6L6 18M6 6l12 12" />
                  : <path d="M3 12h18M3 6h18M3 18h18" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            background: 'var(--mobile-menu-bg)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 24px 24px',
          }}>
            {[{ label: 'Services', href: '/services', isRoute: true }, ...navLinks].map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.requiresAuth)}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {link.label}
                </button>
              )
            )}

            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ marginTop: 16, width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'var(--cta)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Login
                </Link>
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-primary"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                >
                  Get Protected
                </button>
              </>
            )}
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .nav-desktop { display: none !important; }
            .nav-hamburger { display: flex !important; }
            .nav-cta-desktop { display: none !important; }
          }
          @media (max-width: 500px) {
            .mega-menu { width: calc(100vw - 32px) !important; left: -100px !important; }
            .mega-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
