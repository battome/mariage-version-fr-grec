import { Mail, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="wedding-section bg-card">
      <div className="wedding-container text-center">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 mb-3">
          {t.contact.eyebrow}
        </p>
        <h2 className="section-title">{t.contact.title}</h2>
        <div className="wedding-divider" />

        <p className="text-muted-foreground max-w-xl mx-auto mb-10">{t.contact.text}</p>

        <a href="mailto:alexandre.renoux9@gmail.com" className="btn-wedding-outline gap-2">
          <Mail className="w-5 h-5" />
          {t.contact.cta}
        </a>
      </div>

      <div className="mt-20 pt-10 border-t border-border text-center">
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
