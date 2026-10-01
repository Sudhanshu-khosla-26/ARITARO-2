'use client';

import dynamic from 'next/dynamic';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import CompanyLogosSection from '@/components/CompanyLogosSection';

const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '60vh', background: 'var(--bg-base)' }} />,
});

const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '32rem', background: 'var(--bg-primary)' }} />,
});

const AboutSection = dynamic(() => import('@/components/AboutSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '32rem', background: 'var(--bg-primary)' }} />,
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '24rem', background: 'var(--bg-primary)' }} />,
});

const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '24rem', background: 'var(--bg-primary)' }} />,
});

export default function HomePageClient() {
  return (
    <SmoothScrollProvider>
      <main style={{ minHeight: '100vh' }}>
        <HeroSection />
        <CompanyLogosSection />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <WhatsAppWidget />
      </main>
    </SmoothScrollProvider>
  );
}
