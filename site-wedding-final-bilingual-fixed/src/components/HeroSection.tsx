import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-mediterranean.jpg";
import oliveWreath from "@/assets/olive-wreath.png";
import { useLanguage } from "@/lib/i18n";

const Countdown = () => {
  const { t } = useLanguage();
  const weddingDate = new Date("2027-07-17T14:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = weddingDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { value: timeLeft.days, label: t.hero.countdown.days },
    { value: timeLeft.hours, label: t.hero.countdown.hours },
    { value: timeLeft.minutes, label: t.hero.countdown.minutes },
    { value: timeLeft.seconds, label: t.hero.countdown.seconds },
  ];

  return (
    <div className="flex gap-6 md:gap-10 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="text-3xl md:text-5xl font-display font-light text-primary-foreground">
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm font-accent tracking-[0.2em] uppercase text-primary-foreground/80 mt-1">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt={t.hero.alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      <div className="relative z-10 text-center px-6 animate-fade-in">
        <img src={oliveWreath} alt="" className="w-32 md:w-44 mx-auto mb-6 opacity-90" />
        <p className="font-accent text-lg md:text-xl tracking-[0.3em] uppercase text-primary-foreground/80 mb-4">
          {t.hero.marrying}
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-primary-foreground mb-2 tracking-wide">
          Alexia
        </h1>
        <p className="font-accent text-2xl md:text-3xl text-accent italic mb-2">&</p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-primary-foreground mb-8 tracking-wide">
          Alexandre
        </h1>
        <div className="wedding-divider !bg-accent !my-6" />
        <p className="font-accent text-xl md:text-2xl tracking-[0.2em] text-primary-foreground/90 mb-12">
          {t.hero.dateLocation}
        </p>
        <Countdown />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-primary-foreground/40" />
      </div>
    </section>
  );
};

export default HeroSection;
