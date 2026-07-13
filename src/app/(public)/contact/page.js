import { Suspense } from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | Aritaro Cybersecurity Services',
  description:
    'Get in touch with Aritaro for cybersecurity services, penetration testing, and security consultations.',
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <ContactClient />
    </Suspense>
  );
}
