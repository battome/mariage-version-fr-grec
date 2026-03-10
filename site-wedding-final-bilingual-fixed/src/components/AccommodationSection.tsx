import { Bed } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const AccommodationSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hebergements" className="wedding-section bg-secondary/30">
      <div className="wedding-container">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 text-center mb-3">
          {t.accommodation.eyebrow}
        </p>
        <h2 className="section-title">{t.accommodation.title}</h2>
        <div className="wedding-divider" />

        <div className="max-w-3xl mx-auto mt-16">
          <div className="card-wedding">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center flex-shrink-0">
                <Bed className="w-5 h-5 text-primary" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-4">
                {t.accommodation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}

                <p>
                  {t.accommodation.bookingLead}{" "}
                  <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Booking.com
                  </a>{" "}
                  {t.accommodation.bookingMiddle}{" "}
                  <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
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
