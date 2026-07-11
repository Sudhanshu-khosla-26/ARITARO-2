'use client';

import { useCart } from './CartContext';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const serviceSlugMap = {
  '01': 'api_pt',
  '02': 'wap_pt',
  '03': 'cloud_security',
  '04': 'ai_pt',
};

export default function CartPanel() {
  const { cartItems, removeFromCart, isCartOpen, closeCart } = useCart();
  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  // Build the query param: ?services=api_pt,wap_pt
  const serviceKeys = cartItems.map((item) => serviceSlugMap[item.number] || 'api_pt');
  const requestUrl = `/request-assessment?services=${serviceKeys.join(',')}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 7, 13, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease-out forwards',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: 'min(420px, 100vw)',
          height: '100%',
          background: 'rgba(17, 19, 24, 0.95)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.02em',
              }}
            >
              Selected Services
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 20,
              }}
            >
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#64748B',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', marginBottom: 4 }}>No services selected</p>
                <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
                  Add security audit services to scope and request multiple assessments simultaneously.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-outline"
                style={{ fontSize: 12, padding: '10px 20px', marginTop: 8 }}
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cartItems.map((item) => (
                <div
                  key={item.number}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: item.color || '#3B82F6',
                      borderRadius: '3px 0 0 3px',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 6 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: item.color || '#3B82F6', fontWeight: 700, letterSpacing: '0.1em' }}>
                      SERVICE {item.number}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>
                      {item.title}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.number)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: 6,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(10, 11, 15, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Total Selected</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>
                {cartItems.length} {cartItems.length === 1 ? 'Service' : 'Services'}
              </span>
            </div>

            <Link
              href={requestUrl}
              onClick={closeCart}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Request Assessment for All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <button
              onClick={closeCart}
              className="btn-outline"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 12.5,
              }}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
