import WeddingNav from "@/components/WeddingNav";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import VenueSection from "@/components/VenueSection";
import AccommodationSection from "@/components/AccommodationSection";
import TransportSection from "@/components/TransportSection";
import RSVPSection from "@/components/RSVPSection";
import ContactSection from "@/components/ContactSection";
import { LanguageProvider } from "@/lib/i18n";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <WeddingNav />
        <HeroSection />
        <StorySection />
        <VenueSection />
        <AccommodationSection />
        <TransportSection />
        <RSVPSection />
        <ContactSection />
      </div>
    </LanguageProvider>
  );
};

export default Index;
