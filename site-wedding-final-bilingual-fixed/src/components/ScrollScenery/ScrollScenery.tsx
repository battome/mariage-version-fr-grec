import { useEffect, useRef, useState } from "react";
import journeyPoster from "@/assets/scenery/journey-poster.jpg";
import journeyPosterPortrait from "@/assets/scenery/journey-poster-portrait.jpg";
import "./scenery.css";

/**
 * Décor plein écran, fixé derrière tout le site : une vidéo continue (Terre,
 * vol vers Athènes, oliviers, Sounion, Plaka, Acropole, cathédrale) dont la
 * lecture est pilotée par la position de scroll, du haut de la page jusqu'en
 * bas : la dernière image (intérieur de la cathédrale) n'est atteinte qu'à
 * la toute fin du site.
 *
 * Deux montages du même film existent : 16:9 pour les écrans en paysage,
 * 9:16 (généré séparément, mêmes scènes) pour les écrans en portrait. Dans
 * les deux cas l'image est affichée entière (`contain`, jamais recadrée) et
 * les bandes restantes sont comblées par une seconde copie de la même vidéo,
 * agrandie et floutée, qui joue le rôle de fond.
 */
const SOURCES = {
  landscape: { src: "/video/journey.mp4", poster: journeyPoster },
  portrait: { src: "/video/journey-portrait.mp4", poster: journeyPosterPortrait },
} as const;

type Variant = keyof typeof SOURCES;

const PORTRAIT_QUERY = "(orientation: portrait)";

const currentVariant = (): Variant =>
  window.matchMedia(PORTRAIT_QUERY).matches ? "portrait" : "landscape";

const ScrollScenery = () => {
  const fgRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant>(currentVariant);

  useEffect(() => {
    const query = window.matchMedia(PORTRAIT_QUERY);
    const onChange = () => setVariant(currentVariant());
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const fg = fgRef.current;
    const bg = bgRef.current;
    if (!fg || !bg) return;
    const videos = [fg, bg];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let duration = 0;
    let endScroll = 0;
    let current = 0;
    let raf = 0;
    let primed = false;

    const computeEndScroll = () => {
      endScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };

    const primeIOS = () => {
      if (primed) return;
      primed = true;
      videos.forEach((v) => {
        const p = v.play();
        if (p && typeof p.then === "function") {
          p.then(() => v.pause()).catch(() => {
            /* autoplay refusé : sans conséquence, on pilote par currentTime */
          });
        } else {
          v.pause();
        }
      });
    };

    const onLoaded = () => {
      duration = fg.duration || 0;
      computeEndScroll();
      primeIOS();
      if (reduce) {
        videos.forEach((v) => (v.currentTime = duration));
      }
    };
    fg.addEventListener("loadedmetadata", onLoaded);
    if (fg.readyState >= 1) onLoaded();

    if (reduce) {
      return () => fg.removeEventListener("loadedmetadata", onLoaded);
    }

    const tick = () => {
      if (duration > 0) {
        const progress = Math.min(Math.max(window.scrollY / endScroll, 0), 1);
        const target = progress * duration;
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.03) current = target;
        videos.forEach((v) => {
          if (Math.abs(v.currentTime - current) > 0.02 && !v.seeking) {
            v.currentTime = current;
          }
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(computeEndScroll);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      fg.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [variant]);

  const { src, poster } = SOURCES[variant];

  return (
    <div className="scenery" aria-hidden="true">
      <video key={`bg-${variant}`} ref={bgRef} className="scenery-video scenery-video-bg" src={src} muted playsInline preload="auto" />
      <video
        key={`fg-${variant}`}
        ref={fgRef}
        className="scenery-video scenery-video-fg"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
      />
      <div className="scenery-grade" />
      <div className="scenery-dim" />
      <div className="scenery-vignette" />
    </div>
  );
};

export default ScrollScenery;
