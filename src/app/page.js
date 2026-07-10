import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CertificationBadges from '@/components/CertificationBadges';
import ServicesSection from '@/components/ServicesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import LeadPopup from '@/components/LeadPopup';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main style={{ minHeight: '100vh' }}>
        <HeroSection />
        {/* <CertificationBadges /> */}
        <ServicesSection />
        {/* <WhyChooseUs /> */}
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
        <LeadPopup />
        <WhatsAppWidget />
      </main>
    </SmoothScrollProvider>
  );
}
