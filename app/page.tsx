import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/features/hero/components/hero-section";
import { ServicesSection } from "@/features/services/components/services-section";
import { PortfolioSection } from "@/features/portfolio/components/portfolio-section";
import { AboutSection } from "@/features/about/components/about-section";
import { ContactSection } from "@/features/contact/components/contact-section";
import { Footer } from "@/components/shared/footer";
import { VisitorTracker } from "@/components/shared/visitor-tracker";

export default function Home() {
	return (
		<div className="min-h-screen">
			<VisitorTracker />
			<Navbar />
			<HeroSection />
			<ServicesSection />
			<PortfolioSection />
			<AboutSection />
			<ContactSection />
			<Footer />
		</div>
	);
}
