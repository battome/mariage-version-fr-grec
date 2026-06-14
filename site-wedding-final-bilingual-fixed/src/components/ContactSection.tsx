import { Mail, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import HiddenHeart from "@/components/HiddenHeart";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="wedding-section bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <HiddenHeart className="right-[16%] top-24 -rotate-12" />
      <div className="wedding-container text-center relative">
        <p className="section-eyebrow">{t.contact.eyebrow}</p>
        <h2 className="section-title">{t.contact.title}</h2>
        <div className="wedding-divider" />

        <div className="editorial-panel max-w-2xl mx-auto">
          <p className="text-muted-foreground mx-auto mb-10 md:text-lg">{t.contact.text}</p>

          <a href="mailto:alexandre.renoux9@gmail.com" className="btn-wedding-outline gap-2">
            <Mail className="w-5 h-5" />
            {t.contact.cta}
          </a>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-border text-center relative">
        <p className="font-display text-2xl mb-2">Alexia & Alexandre</p>
        <p className="font-accent text-lg text-muted-foreground mb-4">{t.contact.date}</p>
        <p className="text-sm text-muted-foreground/60 flex items-center justify-center gap-1">
          {t.contact.footer} <Heart className="w-3 h-3 text-terracotta" /> {t.contact.footerEnd}
        </p>
      </div>
    </section>
  );
};

export default ContactSection;
