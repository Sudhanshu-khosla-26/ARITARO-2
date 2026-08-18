'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useCart } from './CartContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SECTION_ID = 'services-stack-wrapper';

const services = [
  {
    number: '01',
    slug: 'api-pt',
    title: 'API Penetration Testing',
    tag: 'OWASP API Top 10',
    desc: 'Deep, manual and automated security testing of REST, GraphQL, gRPC & SOAP APIs. Discover BOLA/IDOR, broken authentication, and business logic flaws before attackers do.',
    features: [
      'REST, GraphQL, gRPC & SOAP',
      'JWT & OAuth Authentication Audits',
      'BOLA / IDOR Deep Exploits',
      'Zero-Day Business Logic Review',
    ],
    color: '#3B82F6',
    href: '/services/api-pt',
    duration: '1-2 Weeks',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    number: '02',
    slug: 'wap-pt',
    title: 'Web Application Pentest',
    tag: 'Web & Cloud Portals',
    desc: 'Comprehensive manual and automated assessment of enterprise web platforms. Logic-aware vulnerability research that identifies critical flaws scanners miss.',
    features: [
      'OWASP Top 10 Comprehensive',
      'Privilege Escalation & Auth Bypass',
      'Client-Side & Server-Side Injections',
      'Code-Level Developer Fix Guides',
    ],
    color: '#06B6D4',
    href: '/services/wap-pt',
    duration: '2-3 Weeks',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    number: '03',
    slug: 'cloud',
    title: 'Cloud Security Assessment',
    tag: 'AWS · Azure · GCP',
    desc: 'Adversarial configuration and architecture review across multi-cloud environments. Identify over-privileged IAM, public assets, and lateral movement paths.',
    features: [
      'Multi-Cloud IAM & Role Audits',
      'CIS Benchmark Compliance Scans',
      'Kubernetes & Container Hardening',
      'Data Perimeter Leak Detection',
    ],
    color: '#818CF8',
    href: '/services/cloud',
    duration: '1-3 Weeks',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    number: '04',
    slug: 'ai-pt',
    title: 'AI & LLM Penetration Testing',
    tag: 'Next-Gen AI Security',
    desc: 'Specialized adversarial red-teaming for LLM architectures, RAG pipelines, and agentic AI systems. Jailbreak prevention and prompt injection protection.',
    features: [
      'OWASP Top 10 for LLMs',
      'Prompt Injection & Jailbreak Defense',
      'RAG Vector Poisoning Defense',
      'Tool Calling & Agent Scoping',
    ],
    color: '#A855F7',
    href: '/services/ai-pt',
    duration: '2-4 Weeks',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const { cartItems, addToCart } = useCart();

  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const arrowRef = useRef(null);

  useGSAP(
    () => {
      const wrappers = gsap.utils.toArray('.svc-card-wrapper');
      const cards = gsap.utils.toArray('.svc-card');

      if (!wrappers.length || !cards.length) {
        return;
      }

      /*
       * Keep the original card design untouched.
       */
      gsap.set(cards, {
        scale: 1,
        rotationX: 0,
        transformOrigin: 'top center',
        force3D: true,
      });

      /*
       * Official GSAP-style stacking cards:
       *
       * one tween
       * one ScrollTrigger
       * one pin
       *
       * per card.
       */
      wrappers.forEach((wrapper, index) => {
        const card = cards[index];

        if (!wrapper || !card) return;

        let scale = 1;
        let rotation = 0;

        /*
         * Earlier cards shrink behind the next card.
         * Last card stays full size.
         */
        if (index !== cards.length - 1) {
          scale = 0.90 + 0.025 * index;
          rotation = -6;
        }

        gsap.to(card, {
          scale,
          rotationX: rotation,
          transformOrigin: 'top center',
          ease: 'none',

          scrollTrigger: {
            trigger: wrapper,

            /*
             * Stay safely below navbar.
             */
            start: `top ${90 + index * 8}`,

            /*
             * Same pattern used by GSAP's stacking demo.
             */
            end: 'bottom 550px',

            /*
             * The whole service stack determines when
             * the pinning sequence ends.
             */
            endTrigger: `#${SECTION_ID}`,

            /*
             * Smooth catch-up.
             */
            scrub: 0.7,

            /*
             * Pin the wrapper, animate the card inside it.
             */
            pin: wrapper,

            /*
             * Next card moves naturally underneath.
             */
            pinSpacing: false,

            anticipatePin: 1,

            invalidateOnRefresh: true,

            id: `service-stack-${index}`,
          },
        });
      });

      /*
       * CTA entrance.
       */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',

            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      /*
       * CTA arrow.
       */
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 5,
          opacity: 0.5,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }

      /*
       * Recalculate all pin positions.
       */
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    {
      scope: sectionRef,
      revertOnUpdate: true,
    }
  );
  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        position: 'relative',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      {/* =======================================================
          BACKGROUND
      ======================================================= */}

      <div
        className="cyber-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 900,
          height: 700,
          background:
            'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* =======================================================
          HEADER
      ======================================================= */}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '100px 24px 64px',
        }}
      >
        <div
          className="section-label"
          style={{
            display: 'inline-flex',
            marginBottom: 18,
          }}
        >
          CORE CAPABILITIES
        </div>

        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px',
            marginBottom: 16,
            lineHeight: 1.08,
          }}
        >
          Our{' '}
          <span
            style={{
              background:
                'linear-gradient(135deg,#3B82F6,#06B6D4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Security Services
          </span>
        </h2>

        <p
          style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            lineHeight: 1.75,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          Precision-targeted attack simulations across every threat
          surface — APIs, web apps, cloud infrastructure, and AI systems.
        </p>
      </div>

      {/* =======================================================
          SERVICES STACK
      ======================================================= */}

      <div
        id={SECTION_ID}
        style={{
          paddingTop: 40,

          /*
           * Reduced from the previous huge bottom spacing.
           * The CTA now visually connects to the stack.
           */
          paddingBottom: 80,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: 1060,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {services.map((service, index) => {
            const isAdded = cartItems.some(
              (item) =>
                item.number === service.slug ||
                item.title === service.title
            );

            return (
              <div
                key={service.slug}
                className="svc-card-wrapper"
                style={{
                  width: '100%',
                  perspective: '500px',

                  /*
                   * KEEP ORIGINAL CARD SPACING.
                   */
                  marginBottom:
                    index === services.length - 1
                      ? 0
                      : 50,

                  position: 'relative',
                }}
              >
                {/* =================================================
                    CARD
                ================================================= */}

                <div
                  className="svc-card"
                  style={{
                    width: '100%',
                    minHeight: 300,
                    background: 'rgba(9,14,23,0.97)',
                    border: `1px solid ${service.color}22`,
                    borderRadius: 20,
                    padding: '40px 36px',
                    boxShadow:
                      '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    willChange: 'auto',
                    transformStyle: 'flat',
                  }}
                >
                  {/* Number */}

                  <div
                    style={{
                      position: 'absolute',
                      top: 24,
                      right: 28,
                      fontFamily:
                        'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        `${service.color}45`,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {service.number} / 04
                  </div>

                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}

                  <div
                    className="svc-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1.3fr 1fr',
                      gap: 40,
                      alignItems: 'center',
                    }}
                  >
                    {/* LEFT */}

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          marginBottom: 18,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background:
                              `${service.color}15`,
                            border:
                              `1px solid ${service.color}35`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color:
                              service.color,
                            flexShrink: 0,
                          }}
                        >
                          {service.icon}
                        </div>

                        <div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing:
                                '0.09em',
                              textTransform:
                                'uppercase',
                              color:
                                service.color,
                              display: 'block',
                              marginBottom: 3,
                            }}
                          >
                            {service.tag}
                          </span>

                          <h3
                            style={{
                              fontSize:
                                'clamp(18px, 2.2vw, 24px)',
                              fontWeight: 800,
                              color:
                                'var(--text-primary)',
                              margin: 0,
                              letterSpacing:
                                '-0.4px',
                              lineHeight: 1.2,
                            }}
                          >
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: 14.5,
                          color:
                            'var(--text-muted)',
                          lineHeight: 1.75,
                          marginBottom: 28,
                          maxWidth: 440,
                        }}
                      >
                        {service.desc}
                      </p>

                      {/* Buttons */}

                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems:
                            'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Link
                          href={service.href}
                          className="btn-primary"
                          style={{
                            fontSize: 13,
                            padding:
                              '10px 20px',
                            borderRadius: 8,
                            textDecoration:
                              'none',
                          }}
                        >
                          Explore Methodology →
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              number:
                                service.slug,
                              title:
                                service.title,
                              desc:
                                service.desc,
                              color:
                                service.color,
                            })
                          }
                          className="btn-ghost"
                          style={{
                            fontSize: 13,
                            padding:
                              '10px 18px',
                            borderRadius: 8,
                            cursor:
                              'pointer',
                            borderColor:
                              isAdded
                                ? service.color
                                : 'var(--border-subtle)',
                            color: isAdded
                              ? service.color
                              : 'var(--text-primary)',
                            background:
                              isAdded
                                ? `${service.color}12`
                                : 'transparent',
                          }}
                        >
                          {isAdded
                            ? '✓ Added to Scope'
                            : '+ Add to Scope'}
                        </button>
                      </div>
                    </div>

                    {/* =================================================
                        RIGHT — SCOPE
                    ================================================= */}

                    <div
                      style={{
                        background:
                          'rgba(15,23,42,0.7)',
                        border:
                          `1px solid ${service.color}14`,
                        borderRadius: 14,
                        padding:
                          '22px 20px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing:
                            '0.09em',
                          textTransform:
                            'uppercase',
                          color:
                            'var(--text-muted)',
                          marginBottom: 14,
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center',
                        }}
                      >
                        <span>
                          Assessment Scope
                        </span>

                        <span
                          style={{
                            color:
                              service.color,
                            fontFamily:
                              'var(--font-mono)',
                            fontSize: 12,
                          }}
                        >
                          {service.duration}
                        </span>
                      </div>

                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection:
                            'column',
                          gap: 10,
                        }}
                      >
                        {service.features.map(
                          (feature, fi) => (
                            <li
                              key={fi}
                              style={{
                                fontSize: 13.5,
                                color:
                                  'var(--text-primary)',
                                display:
                                  'flex',
                                alignItems:
                                  'flex-start',
                                gap: 10,
                                lineHeight:
                                  1.4,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius:
                                    '50%',
                                  background:
                                    service.color,
                                  flexShrink: 0,
                                  marginTop: 5,
                                  boxShadow:
                                    `0 0 6px ${service.color}80`,
                                }}
                              />

                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Invisible end marker used by ScrollTrigger */}

          {/* <div
            className="services-stack-end"
            aria-hidden="true"
            style={{
              width: '100%',
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          /> */}
        </div>
      </div>

      {/* =======================================================
          FULL CATALOG CTA
      ======================================================= */}

      <div
        ref={ctaRef}
        style={{
          position: 'relative',
          zIndex: 2,
          padding:
            '30px 24px 100px',
        }}
      >
        <div
          style={{
            maxWidth: 1060,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Connector */}

          <div
            style={{
              width: 1,
              height: 60,
              margin: '0 auto',
              background:
                'linear-gradient(to bottom, rgba(59,130,246,0.7), transparent)',
            }}
          />

          {/* CTA */}

          <div
            className="services-cta"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 20,
              border:
                '1px solid rgba(59,130,246,0.22)',
              background:
                'linear-gradient(135deg, rgba(10,18,32,0.98), rgba(5,10,18,0.98))',
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
              padding:
                '46px 50px',
            }}
          >
            {/* Grid */}

            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.12,
                backgroundImage:
                  'linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)',
                backgroundSize:
                  '40px 40px',
                maskImage:
                  'linear-gradient(to right, transparent, black, transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Glow */}

            <div
              style={{
                position: 'absolute',
                width: 350,
                height: 350,
                right: -120,
                top: -180,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              className="services-cta-content"
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                gap: 40,
              }}
            >
              {/* LEFT */}

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius:
                        '50%',
                      background:
                        '#3B82F6',
                      boxShadow:
                        '0 0 12px #3B82F6',
                    }}
                  />

                  <span
                    style={{
                      fontFamily:
                        'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing:
                        '0.16em',
                      color: '#3B82F6',
                      fontWeight: 700,
                    }}
                  >
                    ARITARO // SECURITY ARSENAL
                  </span>
                </div>

                <h3
                  style={{
                    fontSize:
                      'clamp(24px, 3vw, 36px)',
                    fontWeight: 800,
                    color:
                      'var(--text-primary)',
                    margin: 0,
                    letterSpacing:
                      '-0.8px',
                    lineHeight: 1.15,
                  }}
                >
                  12+ security modules.
                  <br />

                  <span
                    style={{
                      color:
                        'var(--text-muted)',
                    }}
                  >
                    One complete defense surface.
                  </span>
                </h3>

                <p
                  style={{
                    maxWidth: 540,
                    margin:
                      '16px 0 0',
                    color:
                      'var(--text-muted)',
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Go beyond our core
                  assessments with
                  specialized red-team
                  operations, compliance
                  audits, cloud hardening,
                  threat simulation, and
                  more.
                </p>
              </div>

              {/* RIGHT */}

              <div
                className="services-cta-action"
                style={{
                  flexShrink: 0,
                  textAlign: 'center',
                }}
              >
                <Link
                  href="/services"
                  className="services-arsenal-button"
                  style={{
                    position:
                      'relative',
                    display:
                      'inline-flex',
                    alignItems:
                      'center',
                    gap: 14,
                    padding:
                      '15px 22px',
                    borderRadius: 10,
                    background:
                      '#3B82F6',
                    color: '#fff',
                    textDecoration:
                      'none',
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow:
                      '0 10px 35px rgba(59,130,246,0.25)',
                    overflow: 'hidden',
                  }}
                >
                  <span>
                    View All Services
                  </span>

                  <span
                    style={{
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    →
                  </span>
                </Link>

                <div
                  style={{
                    marginTop: 14,
                    fontFamily:
                      'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing:
                      '0.14em',
                    color:
                      'rgba(255,255,255,0.28)',
                  }}
                >
                  EXPLORE FULL CATALOG
                </div>
              </div>
            </div>

            {/* Bottom status */}

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                marginTop: 34,
                paddingTop: 18,
                borderTop:
                  '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                color:
                  'rgba(255,255,255,0.25)',
                fontFamily:
                  'var(--font-mono)',
                fontSize: 9,
                letterSpacing:
                  '0.12em',
              }}
            >
              <span>
                ALL SYSTEMS PROTECTED
              </span>

              <span>
                SECURITY LEVEL: ENTERPRISE
              </span>
            </div>
          </div>

          {/* Scroll continuation */}

          <div
            className="services-scroll-hint"
            style={{
              display: 'flex',
              justifyContent:
                'center',
              alignItems: 'center',
              gap: 12,
              marginTop: 30,
              color:
                'rgba(255,255,255,0.3)',
              fontFamily:
                'var(--font-mono)',
              fontSize: 9,
              letterSpacing:
                '0.16em',
              textTransform:
                'uppercase',
            }}
          >
            <span>
              Scroll to continue
            </span>

            <span
              ref={arrowRef}
              style={{
                display:
                  'inline-block',
                fontSize: 15,
              }}
            >
              ↓
            </span>
          </div>
        </div>
      </div>

      {/* =======================================================
          RESPONSIVE
      ======================================================= */}

      <style>{`
        @media (max-width: 820px) {
          .svc-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .svc-card {
            padding: 28px 20px !important;
          }

          .services-cta {
            padding: 34px 24px !important;
          }

          .services-cta-content {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .services-cta-action {
            width: 100% !important;
          }

          .services-arsenal-button {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        @media (max-width: 520px) {
          .services-scroll-hint {
            margin-top: 24px !important;
          }

          .services-cta {
            border-radius: 16px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .svc-card {
            transform: none !important;
          }

          .services-scroll-hint span:last-child {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}