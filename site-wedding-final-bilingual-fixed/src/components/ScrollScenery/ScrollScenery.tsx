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
 * les bandes restantes sont comblées par une seconde vidéo (mêmes images,
 * encodée à basse résolution puisqu'elle est floutée) agrandie qui joue le
 * rôle de fond — décoder et flouter du 1280x720 en continu pendant le scroll
 * faisait ramer le site, un flux à 320x180 coûte une fraction de ce CPU/GPU.
 */
const SOURCES = {
  landscape: { src: "/video/journey.mp4", bgSrc: "/video/journey-bg.mp4", poster: journeyPoster },
  portrait: { src: "/video/journey-portrait.mp4", bgSrc: "/video/journey-portrait-bg.mp4", poster: journeyPosterPortrait },
} as const;

type Variant = keyof typeof SOURCES;

/** Images fixes de secours, une par scène : /video/stills/<format>-<n>.jpg. */
const STILL_COUNT = 10;

const PORTRAIT_QUERY = "(orientation: portrait)";

const currentVariant = (): Variant =>
  window.matchMedia(PORTRAIT_QUERY).matches ? "portrait" : "landscape";

const ScrollScenery = () => {
  const fgRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant>(currentVariant);
  /* Index de l'image fixe affichée quand le navigateur refuse de lire la vidéo
     (mode économie d'énergie d'iOS, par exemple) ; null tant que la vidéo joue. */
  const [still, setStill] = useState<number | null>(null);

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
    let blocked = false;
    let stillIndex = -1;

    const computeEndScroll = () => {
      endScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };

    const tryPlay = () => Promise.all(videos.map((v) => v.play().then(() => v.pause())));

    const removeGestureListeners = () => {
      window.removeEventListener("touchend", onGesture);
      window.removeEventListener("click", onGesture);
    };

    /* Un appui volontaire autorise la lecture même quand elle est bloquée. */
    function onGesture() {
      tryPlay()
        .then(() => {
          blocked = false;
          stillIndex = -1;
          setStill(null);
          removeGestureListeners();
        })
        .catch(() => {
          /* toujours refusé : on reste sur les images fixes */
        });
    }

    const primeIOS = () => {
      if (primed) return;
      primed = true;
      tryPlay().catch(() => {
        /* Lecture refusée : sans elle, iOS n'affiche aucune image de la vidéo
           quand on change currentTime (écran noir). On passe aux images fixes. */
        blocked = true;
        window.addEventListener("touchend", onGesture);
        window.addEventListener("click", onGesture);
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

    computeEndScroll();
    primeIOS();

    const tick = () => {
      const progress = Math.min(Math.max(window.scrollY / endScroll, 0), 1);
      if (blocked) {
        const next = Math.round(progress * (STILL_COUNT - 1));
        if (next !== stillIndex) {
          stillIndex = next;
          setStill(next);
        }
      } else if (duration > 0) {
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
      removeGestureListeners();
      fg.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [variant]);

  const { src, bgSrc, poster } = SOURCES[variant];

  return (
    <div className="scenery" aria-hidden="true">
      <video key={`bg-${variant}`} ref={bgRef} className="scenery-video scenery-video-bg" src={bgSrc} muted playsInline preload="auto" />
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
      {still !== null &&
        Array.from({ length: STILL_COUNT }, (_, i) =>
          Math.abs(i - still) <= 1 ? (
            <img
              key={i}
              src={`/video/stills/${variant}-${i}.jpg`}
              alt=""
              className={`scenery-still${i === still ? " is-current" : ""}`}
            />
          ) : null,
        )}
      <div className="scenery-grade" />
      <div className="scenery-dim" />
      <div className="scenery-vignette" />
    </div>
  );
};

export default ScrollScenery;
