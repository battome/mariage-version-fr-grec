import { MapPin } from "lucide-react";
import venueImage from "@/assets/cathedrale-athenes.jpg";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const VenueSection = () => {
  const { t } = useLanguage();

  return (
    <section id="le-lieu" className="wedding-section bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-secondary/35 blur-3xl" />
      <HiddenHeart className="right-[8%] bottom-20 rotate-6" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{t.venue.eyebrow}</p>
        <h2 className="section-title">{t.venue.title}</h2>
        <div className="wedding-divider" />

        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] items-center mt-16">
          <div className="editorial-panel">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-4 md:text-lg">
                <p>{t.venue.intro}</p>

                <p>
                  <strong>17h :</strong> {t.venue.ceremony}
                  <br />
                  Panepistimiou 24, Athina 106 72, Grèce
                </p>

                <p>
                  <strong>17h45 :</strong> {t.venue.ceremonyEnd}
                </p>

                <p>
                  <strong>18h30 - 19h :</strong> {t.venue.arrival}
                </p>

                <p>
                  {t.venue.mapsLead}
                  <a
                    href="https://www.google.com/maps/place/%CE%9A%CF%84%CE%AE%CE%BC%CE%B1+%CE%9A%CE%B5%CE%BA%CF%81%CF%89%CF%80%CE%AF%CE%B1+%CE%A6%CE%B1%CE%AF%CE%B4%CF%89%CE%BD+%CE%93%CE%B5%CF%89%CF%81%CE%B3%CE%AF%CF%84%CF%83%CE%B7%CF%82/@37.9272155,23.8298606,556m/data=!3m2!1e3!4b1!4m6!3m5!1s0x14a196e1598b0255:0x26413df2d0d94c65!8m2!3d37.9272155!4d23.8298606!16s%2Fg%2F1tdjnfnb?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-accent underline-offset-4 ml-1"
                  >
                    {t.venue.clickHere}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="image-frame rotate-1">
            <img
              src={venueImage}
              alt={t.venue.imageAlt}
              className="h-[420px] md:h-[560px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
