import { useEffect, useRef } from "react";
import journeyPoster from "@/assets/scenery/journey-poster.jpg";
import "./scenery.css";

/**
 * Décor plein écran, fixé derrière tout le site : une vidéo continue (Terre,
 * vol vers Athènes, Sounion, Plaka, Acropole, cathédrale) dont la lecture est
 * pilotée par la position de scroll, jusqu'à l'ancre `#hebergements`. Passé
 * cette ancre, la dernière image (intérieur de la cathédrale) reste fixe en
 * arrière-plan pour le reste du site.
 */
const END_ANCHOR = "#hebergements";

const ScrollScenery = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {
          /* autoplay refusé : sans conséquence, on pilote par currentTime */
        });
      } else {
        video.pause();
      }
    };

    const onLoaded = () => {
      duration = video.duration || 0;
      computeEndScroll();
      primeIOS();
      if (reduce) {
        video.currentTime = duration;
      }
    };
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    if (reduce) {
      return () => video.removeEventListener("loadedmetadata", onLoaded);
    }

    // Scène du globe (0 → ~5 s) : la France et la Grèce sont en haut du
    // cadre carré source. Un recadrage CSS centré les coupe sur un écran
    // large, donc on remonte le point de recadrage pendant cette scène
    // puis on revient au centre pour les scènes suivantes.
    const GLOBE_SCENE_END = 4.6;
    const updateCrop = (t: number) => {
      const p = Math.min(Math.max(t / GLOBE_SCENE_END, 0), 1);
      const y = 22 + p * 28; // 22% (globe) -> 50% (reste du film)
      video.style.objectPosition = `50% ${y}%`;
    };

    const tick = () => {
      if (duration > 0) {
        const progress = Math.min(Math.max(window.scrollY / endScroll, 0), 1);
        const target = progress * duration;
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.03) current = target;
        if (Math.abs(video.currentTime - current) > 0.02 && !video.seeking) {
          video.currentTime = current;
        }
        updateCrop(current);
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
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  return (
    <div className="scenery" aria-hidden="true">
      <video
        ref={videoRef}
        className="scenery-video"
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
