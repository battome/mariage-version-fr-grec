import coupleImage from "@/assets/couple-landscape.jpg";
import { useLanguage } from "@/lib/i18n";

const StorySection = () => {
  const { t } = useLanguage();

  return (
    <section id="notre-histoire" className="wedding-section bg-background">
      <div className="wedding-container">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 text-center mb-3">
          {t.story.eyebrow}
        </p>
        <h2 className="section-title">{t.story.title}</h2>
        <div className="wedding-divider" />

        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/30 rounded-lg -rotate-2" />
            <img
              src={coupleImage}
              alt={t.story.imageAlt}
              className="relative rounded-lg w-full h-[400px] object-cover shadow-lg"
            />
          </div>

          <div className="space-y-6 text-foreground/80 leading-relaxed">
            {t.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-accent text-xl italic text-primary">{t.story.closing}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
