import coupleImage from "@/assets/couple-landscape.jpg";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const StorySection = () => {
  const { t } = useLanguage();

  return (
    <section id="notre-histoire" className="wedding-section bg-background">
      <div className="absolute left-0 top-16 h-56 w-28 rounded-r-full bg-sea-light/45 blur-2xl" />
      <div className="absolute right-0 bottom-12 h-72 w-32 rounded-l-full bg-gold-light/35 blur-2xl" />
      <HiddenHeart className="left-[9%] bottom-24 -rotate-12" />

      <div className="wedding-container relative">
        <p className="section-eyebrow">{t.story.eyebrow}</p>
        <h2 className="section-title">{t.story.title}</h2>
        <div className="wedding-divider" />

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center mt-16">
          <div className="image-frame -rotate-1">
            <img
              src={coupleImage}
              alt={t.story.imageAlt}
              className="h-[360px] md:h-[520px]"
            />
          </div>

          <div className="editorial-panel space-y-6 text-foreground/80 leading-relaxed md:text-lg">
            {t.story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-accent text-2xl italic text-primary">{t.story.closing}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
