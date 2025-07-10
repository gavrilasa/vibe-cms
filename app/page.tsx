import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { ServicesSection } from '@/components/services-section';
import { PortfolioSection } from '@/components/portfolio-section';
import { AboutSection } from '@/components/about-section';
import { TeamSection } from '@/components/team-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { VisitorTracker } from '@/components/visitor-tracker';

export default function Home() {
  return (
    <div className="min-h-screen">
      <VisitorTracker />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  );
}