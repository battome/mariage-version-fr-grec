import { Bed } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const AccommodationSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hebergements" className="wedding-section">
      <HiddenHeart className="left-[18%] top-28 rotate-45" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{t.accommodation.eyebrow}</p>
        <h2 className="section-title">{t.accommodation.title}</h2>
        <div className="wedding-divider" />

        <div className="max-w-4xl mx-auto mt-16">
          <div className="editorial-panel">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
              <div className="icon-disc w-14 h-14">
                <Bed className="w-5 h-5" />
              </div>

              <div className="text-cream/85 leading-relaxed space-y-5 md:text-lg">
                {t.accommodation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <p>
                  {t.accommodation.bookingLead}{" "}
                  <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="glass-link">
                    Booking.com
                  </a>{" "}
                  {t.accommodation.bookingMiddle}{" "}
                  <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer" className="glass-link">
                    Airbnb
                  </a>{" "}
                  {t.accommodation.bookingTail}
                </p>

                <p className="font-medium text-cream">{t.accommodation.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
