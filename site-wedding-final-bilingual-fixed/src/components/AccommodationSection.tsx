import { Bed } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const AccommodationSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hebergements" className="wedding-section bg-secondary/30">
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-sea-light/40 blur-3xl" />
      <div className="absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      <HiddenHeart className="left-[18%] top-28 rotate-45" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{t.accommodation.eyebrow}</p>
        <h2 className="section-title">{t.accommodation.title}</h2>
        <div className="wedding-divider" />

        <div className="max-w-4xl mx-auto mt-16">
          <div className="editorial-panel">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <Bed className="w-5 h-5 text-primary-foreground" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-5 md:text-lg">
                {t.accommodation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <p>
                  {t.accommodation.bookingLead}{" "}
                  <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-accent underline-offset-4">
                    Booking.com
                  </a>{" "}
                  {t.accommodation.bookingMiddle}{" "}
                  <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-accent underline-offset-4">
                    Airbnb
                  </a>{" "}
                  {t.accommodation.bookingTail}
                </p>

                <p className="font-medium text-foreground">{t.accommodation.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
