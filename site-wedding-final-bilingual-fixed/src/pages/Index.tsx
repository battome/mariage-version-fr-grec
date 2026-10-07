import WeddingNav from "@/components/WeddingNav";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import VenueSection from "@/components/VenueSection";
import AccommodationSection from "@/components/AccommodationSection";
import TransportSection from "@/components/TransportSection";
import GameSection from "@/components/GameSection";
import RSVPSection from "@/components/RSVPSection";
import ContactSection from "@/components/ContactSection";
import { LanguageProvider } from "@/lib/i18n";
import ScrollScenery from "@/components/ScrollScenery/ScrollScenery";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen scenery-active">
        <ScrollScenery />
        <div className="scenery-content">
        <WeddingNav />
        <HeroSection transparentBackground />
        <GameSection />
        <StorySection />
        <VenueSection />
        <AccommodationSection />
        <TransportSection />
        <RSVPSection />
        <ContactSection />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
