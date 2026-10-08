import { useEffect, useRef } from "react";
import journeyPoster from "@/assets/scenery/journey-poster.jpg";
import "./scenery.css";

/**
 * Décor plein écran, fixé derrière tout le site : une vidéo continue (Terre,
 * vol vers Athènes, Sounion, Plaka, Acropole, cathédrale) dont la lecture est
 * pilotée par la position de scroll, jusqu'à l'ancre `#hebergements`. Passé
 * cette ancre, la dernière image (intérieur de la cathédrale) reste fixe en
 * arrière-plan pour le reste du site.
 *
 * La source est carrée (960x960). Sur un écran large, un simple
 * `object-fit: cover` ne garde qu'une bande centrale d'environ 47 % de la
 * hauteur du carré, ce qui donne une impression de zoom excessif. On affiche
 * donc le carré en entier (`contain`, jamais recadré) et on comble les
 * bandes vides avec une seconde copie de la même vidéo, agrandie et floutée,
 * qui joue le rôle de fond.
 */
const END_ANCHOR = "#hebergements";

const ScrollScenery = () => {
  const fgRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);

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
      const node = document.querySelector(END_ANCHOR);
      const fallback = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      endScroll = node ? Math.max(node.getBoundingClientRect().top + window.scrollY, 1) : fallback;
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
  }, []);

  return (
    <div className="scenery" aria-hidden="true">
      <video ref={bgRef} className="scenery-video scenery-video-bg" src="/video/journey.mp4" muted playsInline preload="auto" />
      <video
        ref={fgRef}
        className="scenery-video scenery-video-fg"
        src="/video/journey.mp4"
        poster={journeyPoster}
        muted
        playsInline
        preload="auto"
      />
      <div className="scenery-grade" />
      <div className="scenery-vignette" />
    </div>
  );
};

export default ScrollScenery;
