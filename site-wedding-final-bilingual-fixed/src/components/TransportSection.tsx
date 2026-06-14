import { CarTaxiFront } from "lucide-react";
import transportImage from "@/assets/photo-couple.jpg";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const TransportSection = () => {
  const { t } = useLanguage();

  return (
    <section id="transport" className="wedding-section bg-card">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-sea-light/35 blur-3xl" />
      <HiddenHeart className="right-[22%] top-40 -rotate-6" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{t.transport.eyebrow}</p>
        <h2 className="section-title">{t.transport.title}</h2>
        <div className="wedding-divider" />

        <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] items-center mt-16">
          <div className="editorial-panel order-2 lg:order-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <CarTaxiFront className="w-5 h-5 text-primary-foreground" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-4 md:text-lg">
                <p>
                  <strong>{t.transport.taxiTitle}</strong>
                  <br />
                  {t.transport.taxiText}
                </p>

                <p>
                  <strong>{t.transport.rentalTitle}</strong>
                  <br />
                  {t.transport.rentalText}
                </p>

                <p>{t.transport.europcar}</p>
                <p>{t.transport.downtown}</p>
                <p>{t.transport.group}</p>
                <p>{t.transport.help}</p>

                <p className="space-y-1">
                  <a href="https://www.europcar.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline decoration-accent underline-offset-4">
                    Europcar
                  </a>
                  <a href="https://www.sixt.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline decoration-accent underline-offset-4">
                    Sixt
                  </a>
                  <a href="https://www.hertz.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline decoration-accent underline-offset-4">
                    Hertz
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="image-frame order-1 -rotate-1 lg:order-2">
            <img
              src={transportImage}
              alt={t.transport.imageAlt}
              className="h-[420px] md:h-[560px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;
