import { Mail, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="wedding-section">
      <HiddenHeart className="right-[16%] top-24 -rotate-12" />
      <div className="wedding-container text-center relative">
        <p className="section-eyebrow">{t.contact.eyebrow}</p>
        <h2 className="section-title">{t.contact.title}</h2>
        <div className="wedding-divider" />

        <div className="editorial-panel max-w-2xl mx-auto">
          <p className="text-cream/85 mx-auto mb-10 md:text-lg">{t.contact.text}</p>

          <a href="mailto:alexandre.renoux9@gmail.com" className="btn-wedding-outline gap-2">
            <Mail className="w-5 h-5" />
            {t.contact.cta}
          </a>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-cream/20 text-center relative [text-shadow:var(--halo-soft)]">
        <p className="font-display text-2xl mb-2 text-cream">Alexia & Alexandre</p>
        <p className="font-accent text-lg text-cream/75 mb-4">{t.contact.date}</p>
        <p className="text-sm text-cream/55 flex items-center justify-center gap-1">
          {t.contact.footer} <Heart className="w-3 h-3 text-terracotta" /> {t.contact.footerEnd}
        </p>
        <p className="text-[11px] leading-relaxed text-cream/45 max-w-2xl mx-auto mt-6">{t.contact.credits}</p>
      </div>
    </section>
  );
};

export default ContactSection;
