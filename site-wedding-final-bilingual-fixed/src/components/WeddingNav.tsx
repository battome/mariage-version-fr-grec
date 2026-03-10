import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const WeddingNav = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.story, href: "#notre-histoire" },
    { label: t.nav.venue, href: "#le-lieu" },
    { label: t.nav.accommodation, href: "#hebergements" },
    { label: t.nav.transport, href: "#transport" },
    { label: t.nav.rsvp, href: "#rsvp" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const langButtonClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active
        ? scrolled
          ? "border-primary bg-primary text-primary-foreground"
          : "border-primary-foreground/80 bg-primary-foreground/15 text-primary-foreground"
        : scrolled
          ? "border-border text-foreground/75 hover:border-primary/50"
          : "border-primary-foreground/30 text-primary-foreground/80 hover:border-primary-foreground/70"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`font-display text-xl tracking-wider transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          A&A
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className={`font-accent text-sm tracking-[0.15em] uppercase transition-colors hover:text-accent ${
                scrolled ? "text-foreground/70" : "text-primary-foreground/80"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
         <button onClick={() => setLanguage("fr")} className={langButtonClass(language === "fr")} aria-label="Français">
</button>
<button onClick={() => setLanguage("el")} className={langButtonClass(language === "el")} aria-label="Ελληνικά">
</button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border">
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <button onClick={() => setLanguage("fr")} className={langButtonClass(language === "fr")}>
                <span aria-hidden="true">🇫🇷</span>
                <span>FR</span>
              </button>
              <button onClick={() => setLanguage("el")} className={langButtonClass(language === "el")}>
                <span aria-hidden="true">🇬🇷</span>
                <span>GR</span>
              </button>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className="block w-full text-left font-accent text-base tracking-[0.1em] uppercase text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default WeddingNav;
