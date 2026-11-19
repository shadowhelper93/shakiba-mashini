import { AboutSection } from '@/components/AboutSection';
import { CareerSection } from '@/components/CareerSection';
import { ContactSection } from '@/components/ContactSection';
import { CredentialsSection } from '@/components/CredentialsSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';
import { HeroSection } from '@/components/HeroSection';
import { MotionProvider } from '@/components/MotionProvider';
import { Navbar } from '@/components/Navbar';

export default function HomePage() {
  return (
    <MotionProvider>
      <div className="min-h-screen bg-[#000000] text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0a0c0c]"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content">
          <HeroSection />
          <AboutSection />
          <ExpertiseSection />
          <CareerSection />
          <CredentialsSection />
        </main>

        <ContactSection />
      </div>
    </MotionProvider>
  );
}
