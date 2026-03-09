import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

const RSVPSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "rsvp",
          name: formData.name,
          email: formData.email,
          guests: formData.guests,
          attending: formData.attending,
          message: formData.message,
        }),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        guests: "1",
        attending: "",
        message: "",
      });
    } catch {
      alert(t.rsvp.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="wedding-section bg-background">
      <div className="wedding-container">
        <p className="font-accent text-lg tracking-[0.2em] uppercase text-accent-foreground/60 text-center mb-3">
          {t.rsvp.eyebrow}
        </p>
        <h2 className="section-title">{t.rsvp.title}</h2>
        <div className="wedding-divider" />

        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">{t.rsvp.intro}</p>

        {submitted ? (
          <div className="max-w-lg mx-auto text-center card-wedding">
            <Heart className="w-12 h-12 text-terracotta mx-auto mb-4" />
            <h3 className="font-display text-2xl mb-3">{t.rsvp.thankYouTitle}</h3>
            <p className="text-muted-foreground">{t.rsvp.thankYouText}</p>
          </div>
        ) : (
          <form name="rsvp" method="POST" data-netlify="true" onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
            <input type="hidden" name="form-name" value="rsvp" />

            <div>
              <label className="block font-accent text-lg mb-2">{t.rsvp.name}</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder={t.rsvp.namePlaceholder}
              />
            </div>

            <div>
              <label className="block font-accent text-lg mb-2">{t.rsvp.email}</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block font-accent text-lg mb-2">{t.rsvp.guests}</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? t.rsvp.person : t.rsvp.people}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-accent text-lg mb-3">{t.rsvp.attending}</label>
              <div className="flex gap-4">
                {[t.rsvp.yes, t.rsvp.no].map((option) => (
                  <label
                    key={option}
                    className={`flex-1 text-center px-4 py-3 border rounded-sm cursor-pointer transition-all ${
                      formData.attending === option
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={option}
                      required
                      checked={formData.attending === option}
                      onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                      className="sr-only"
                    />
                    <span className="font-accent text-lg">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-accent text-lg mb-2">{t.rsvp.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                placeholder={t.rsvp.messagePlaceholder}
              />
            </div>

            <button type="submit" className="btn-wedding w-full gap-2" disabled={loading}>
              <Send className="w-4 h-4" />
              {loading ? t.rsvp.sending : t.rsvp.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default RSVPSection;
