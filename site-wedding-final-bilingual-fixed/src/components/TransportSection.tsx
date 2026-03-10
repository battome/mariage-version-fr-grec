import { useLanguage } from "@/lib/i18n";

const TransportSection = () => {
  const { t } = useLanguage();

  return (
    <section id="transport" className="wedding-section bg-card">
      <div className="wedding-container">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 text-center mb-3">
          {t.transport.eyebrow}
        </p>
        <h2 className="section-title">{t.transport.title}</h2>
        <div className="wedding-divider" />

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="card-wedding">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center flex-shrink-0">
                <CarTaxiFront className="w-5 h-5 text-primary" />
              </div>

              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  <strong>{t.transport.taxiTitle}</strong>
                  <br />
                  {t.transport.taxiText}
                  <span dangerouslySetInnerHTML={{ __html: t.transport.taxiText }} />
                </p>

                <p>
                  <strong>{t.transport.rentalTitle}</strong>
                  <br />
                  {t.transport.rentalText}
                  <span dangerouslySetInnerHTML={{ __html: t.transport.rentalText }} />
                </p>

                <p>{t.transport.europcar}</p>
                <p dangerouslySetInnerHTML={{ __html: t.transport.europcar }} />
                <p>{t.transport.downtown}</p>
                <p>{t.transport.group}</p>
                <p>{t.transport.help}</p>
                <p dangerouslySetInnerHTML={{ __html: t.transport.help }} />

                <p className="space-y-1">
                  <a href="https://www.europcar.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline">
                    Europcar
                  </a>
                  <a href="https://www.sixt.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline">
                    Sixt
                  </a>
                  <a href="https://www.hertz.fr/" target="_blank" rel="noopener noreferrer" className="block text-primary underline">
                    Hertz
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/60 rounded-lg rotate-2" />
            <img
              src={transportImage}
              alt={t.transport.imageAlt}
              className="relative rounded-lg w-full h-[500px] object-cover shadow-lg"
            />
          </div>
        </div>
