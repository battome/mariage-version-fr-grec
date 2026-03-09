import { MapPin } from "lucide-react";
import venueImage from "@/assets/cathedrale-athenes.jpg";
import { useLanguage } from "@/lib/i18n";

const VenueSection = () => {
  const { t } = useLanguage();

  return (
    <section id="le-lieu" className="wedding-section bg-card">
      <div className="wedding-container">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 text-center mb-3">
          {t.venue.eyebrow}
        </p>
        <h2 className="section-title">{t.venue.title}</h2>
        <div className="wedding-divider" />

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="card-wedding">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-4">
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
                    className="text-primary underline ml-1"
                  >
                    {t.venue.clickHere}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/60 rounded-lg rotate-2" />
            <img
              src={venueImage}
              alt={t.venue.imageAlt}
              className="relative rounded-lg w-full h-[500px] object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
