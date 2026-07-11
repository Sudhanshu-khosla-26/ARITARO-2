'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { submitServiceRequest } from '@/actions/contact.actions';
import { toast } from 'sonner';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const INCLUDES = [
  'Full Scope Security Scoping & Vulnerability Analysis',
  'Advanced Attack Path Mapping (Black/Grey/White Box)',
  'Detailed Environment Configuration Review',
  'Code-Level Remediation Guidance & Technical Debrief',
  'Professional PDF Audit Report with Verification',
  'Priority Direct WhatsApp Support Channels',
];

function IntakeFormContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    service_type: 'api_pt',
    engagement_type: 'black_box',
    scope_description: '',
    target_environment: '',
    business_justification: '',
    desired_start_date: '',
    deadline: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    authorization_confirmed: false,
  });

  const [selectedServices, setSelectedServices] = useState(['api_pt']);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill fields from session and query params
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        contact_name: session.user.name || '',
        contact_email: session.user.email || '',
      }));
    }

    const queryServices = searchParams.get('services');
    const queryService = searchParams.get('service');
    
    if (queryServices) {
      const parts = queryServices.split(',').filter(s => ['api_pt', 'wap_pt', 'cloud_security', 'ai_pt'].includes(s));
      if (parts.length > 0) {
        setSelectedServices(parts);
      }
    } else if (queryService && ['api_pt', 'wap_pt', 'cloud_security', 'ai_pt'].includes(queryService)) {
      setSelectedServices([queryService]);
    }
  }, [session, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to submit a request.');
      return;
    }

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service type.');
      return;
    }

    if (!form.authorization_confirmed) {
      toast.error('You must confirm you have authorization to test this target environment.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let succeededCount = 0;
      let lastError = '';

      for (const service of selectedServices) {
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (key === 'service_type') {
            formData.set('service_type', service);
          } else {
            formData.set(key, form[key]);
          }
        });
        formData.set('service_type', service);

        const res = await submitServiceRequest(formData);
        if (res.success) {
          succeededCount++;
        } else {
          lastError = res.error || 'Failed to submit request for one of the services.';
        }
      }

      setLoading(false);
      if (succeededCount === selectedServices.length) {
        setSubmitted(true);
        toast.success(`Successfully submitted ${succeededCount} scoping request(s)!`);
      } else if (succeededCount > 0) {
        setSubmitted(true);
        toast.warning(`Submitted ${succeededCount} of ${selectedServices.length} requests. Error: ${lastError}`);
      } else {
        setError(lastError || 'Failed to submit scoping requests.');
        toast.error(lastError || 'Failed to submit scoping requests.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617' }}>
      <section style={{ padding: '80px 24px 80px', position: 'relative' }}>
        <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 20, background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 18px', borderRadius: 100, color: '#818CF8', fontSize: 10, letterSpacing: '2.5px', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', marginRight: 8, display: 'inline-block' }} />
              B2B SECURITY AUDIT SCOPING
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1, marginBottom: 16 }}>
              Request Security <span style={{ color: '#818CF8' }}>Assessment</span>
            </h1>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, maxWidth: 600, margin: '0 auto' }}>
              Scope your application security and compliance audits. Submit details to receive dynamic target scoping logs and schedule testing.
            </p>
          </div>

          <div className="audit-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32, alignItems: 'start' }}>
            
            {/* Left: What's Included */}
            <div style={{ padding: '32px', background: '#0E1422', border: '1px solid #1E293B', borderRadius: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 20 }}>Engagement Guidelines</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {INCLUDES.map((item, i) => (
                  <li key={i} style={{ fontSize: 13.5, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 28, padding: '16px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 12 }}>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>
                  <strong style={{ color: '#818CF8' }}>Note:</strong> We strictly follow the state-based audit flow sequence. Detailed vulnerability tracking dashboards will be unlocked inside your company space once scoping is completed.
                </p>
              </div>
            </div>

            {/* Right: Intake Form or Prompts */}
            <div style={{ padding: '32px', background: '#0E1422', border: '1px solid #1E293B', borderRadius: 18 }}>
              {!session ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>Authentication Required</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
                    Please log in to submit a security scoping request and receive formal PDF audits.
                  </p>
                  <Link href="/login?redirect=/request-assessment" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none', background: '#4F46E5', color: '#fff', borderRadius: 8, fontWeight: 600 }}>
                    Log In to Continue
                  </Link>
                </div>
              ) : submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" style={{ marginBottom: 16 }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>Request Submitted Successfully!</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>We have generated a ticket for your service request. You can monitor the scope approvals in your client panel.</p>
                  <div style={{ marginTop: 24 }}>
                    <Link href="/dashboard" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', textDecoration: 'none', background: '#4F46E5', color: '#fff', borderRadius: 8, fontWeight: 600 }}>
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>Scoping Specifications</h2>
                  
                  {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
                      {error}
                    </div>
                  )}

                  {/* Selected Services Multi-select Checkbox Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #1E293B', padding: '16px', borderRadius: 12, background: 'rgba(99, 102, 241, 0.02)', marginBottom: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Services to Assess *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                      {[
                        { id: 'api_pt', label: 'API Pen Testing' },
                        { id: 'wap_pt', label: 'Web App Pen Testing' },
                        { id: 'cloud_security', label: 'Cloud Assessment' },
                        { id: 'ai_pt', label: 'AI Pen Testing' }
                      ].map(s => {
                        const active = selectedServices.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              setSelectedServices(prev =>
                                prev.includes(s.id)
                                  ? prev.filter(x => x !== s.id)
                                  : [...prev, s.id]
                              );
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '10px 12px',
                              background: active ? 'rgba(99, 102, 241, 0.08)' : '#020617',
                              border: `1px solid ${active ? '#6366F1' : '#1E293B'}`,
                              borderRadius: 8,
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.2s',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              readOnly
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 500, color: active ? '#F8FAFC' : '#94A3B8' }}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dropdowns */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Engagement Type *</label>
                    <select
                      value={form.engagement_type}
                      onChange={(e) => setForm({ ...form, engagement_type: e.target.value })}
                      style={{ padding: '10px 12px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                    >
                      <option value="black_box">Black Box (External)</option>
                      <option value="grey_box">Grey Box (Partial Credentials)</option>
                      <option value="white_box">White Box (Full Code Review)</option>
                    </select>
                  </div>

                  {/* Target Environment */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Target Environment * (URLs, IP Ranges or Repositories)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. api.domain.com, 192.168.1.0/24, github.com/org/repo"
                      value={form.target_environment}
                      onChange={(e) => setForm({ ...form, target_environment: e.target.value })}
                      style={{ padding: '10px 14px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                    />
                  </div>

                  {/* Scope Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Scope & Key Targets Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detail endpoints, user roles, API frameworks or key cloud modules you want tested."
                      value={form.scope_description}
                      onChange={(e) => setForm({ ...form, scope_description: e.target.value })}
                      style={{ padding: '10px 14px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Business Justification */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Business Justification / Compliance Mandates</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. SOC 2 certification, ISO 27001 annual audit, customer onboarding mandate."
                      value={form.business_justification}
                      onChange={(e) => setForm({ ...form, business_justification: e.target.value })}
                      style={{ padding: '10px 14px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Desired Start Date</label>
                      <input
                        type="date"
                        value={form.desired_start_date}
                        onChange={(e) => setForm({ ...form, desired_start_date: e.target.value })}
                        style={{ padding: '10px 12px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Desired Completion Deadline</label>
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        style={{ padding: '10px 12px', fontSize: 14, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ borderTop: '1px solid #1E293B', paddingTop: 14, marginTop: 4 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', display: 'block', marginBottom: 10 }}>Primary Point of Contact</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 12, color: '#94A3B8' }}>Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={form.contact_name}
                          onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                          style={{ padding: '10px 12px', fontSize: 13.5, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 12, color: '#94A3B8' }}>Contact Phone</label>
                        <input
                          type="text"
                          value={form.contact_phone}
                          onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                          style={{ padding: '10px 12px', fontSize: 13.5, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 12, color: '#94A3B8' }}>Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={form.contact_email}
                        onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                        style={{ padding: '10px 12px', fontSize: 13.5, background: '#020617', border: '1px solid #1E293B', borderRadius: 8, color: '#F8FAFC', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Authorization Confirmation */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 8 }}>
                    <input
                      type="checkbox"
                      id="auth_confirmed"
                      checked={form.authorization_confirmed}
                      onChange={(e) => setForm({ ...form, authorization_confirmed: e.target.checked })}
                      style={{ marginTop: 3, cursor: 'pointer' }}
                    />
                    <label htmlFor="auth_confirmed" style={{ fontSize: 12, color: '#94A3B8', cursor: 'pointer', lineHeight: 1.5 }}>
                      I confirm that I have proper authority to request security testing on this target environment.
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 12, padding: '14px', fontSize: 14, width: '100%', justifyContent: 'center', background: '#4F46E5', border: 'none', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? 'Submitting Request...' : 'Submit Scoping Request'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '32px 24px 48px' }}>
        <Link href="/" style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', padding: '12px 24px', border: '1px solid #1E293B', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          ← Back to Home
        </Link>
      </div>

      <WhatsAppWidget />
    </div>
  );
}

export default function RequestAssessmentClient() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <div style={{ width: 30, height: 30, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    }>
      <IntakeFormContent />
    </Suspense>
  );
}
