import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import earthImg from "@/assets/scenery/earth.webp";
import sounionImg from "@/assets/scenery/sounion.webp";
import plakaImg from "@/assets/scenery/plaka.webp";
import acropolisImg from "@/assets/scenery/acropolis.webp";
import facadeImg from "@/assets/scenery/cathedral-facade.webp";
import interiorImg from "@/assets/cathedrale-athenes.jpg";
import handManOpen from "@/assets/scenery/hand-man-open.webp";
import handManHold from "@/assets/scenery/hand-man-hold.webp";
import handWomanOpen from "@/assets/scenery/hand-woman-open.webp";
import handWomanGuide from "@/assets/scenery/hand-woman-guide.webp";
import gyrosImg from "@/assets/scenery/gyros.webp";
import "./scenery.css";

gsap.registerPlugin(MotionPathPlugin);

/** Ancres des sections, dans l'ordre de la page : fin de chaque scène. */
const ANCHORS = ["#jeu", "#notre-histoire", "#le-lieu", "#hebergements"];

/** Façade de la cathédrale : dimensions de l'image et position de la porte (fractions). */
const FACADE = {
  w: 2600,
  h: 2482,
  door: { x: 0.516, y: 0.662, w: 0.058, h: 0.12 },
  focus: { x: 0.5, y: 0.78 },
};

/** Paris et Athènes sur l'image de la Terre (fractions de la boîte). */
const PARIS = { x: 45.4, y: 16.8 };
const ATHENS = { x: 54.4, y: 22.2 };
const ARC = `M ${PARIS.x} ${PARIS.y} Q ${(PARIS.x + ATHENS.x) / 2} ${PARIS.y - 6} ${ATHENS.x} ${ATHENS.y}`;

function coverRect(imgW: number, imgH: number, W: number, H: number, fx: number, fy: number) {
  const s = Math.max(W / imgW, H / imgH);
  const w = imgW * s;
  const h = imgH * s;
  return { x: (W - w) * fx, y: (H - h) * fy, w, h };
}

const ScrollScenery = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (sel: string) => el.querySelector<HTMLElement>(sel)!;

    const layers = {
      space: q(".js-space"),
      stars: q(".js-stars"),
      earthBox: q(".js-earth-box"),
      arc: q(".js-arc") as unknown as SVGPathElement,
      plane: q(".js-plane"),
      window: q(".js-window"),
      armrest: q(".js-armrest"),
      sounion: q(".js-sounion"),
      sounionImg: q(".js-sounion img"),
      plaka: q(".js-plaka"),
      plakaImg: q(".js-plaka img"),
      acropolis: q(".js-acropolis"),
      facade: q(".js-facade"),
      facadeBox: q(".js-facade-box"),
      doorL: q(".js-door-left"),
      doorR: q(".js-door-right"),
      interior: q(".js-interior"),
      handHold: q(".js-hand-hold"),
      handGuide: q(".js-hand-guide"),
      gyros: q(".js-gyros"),
    };

    const layoutFacade = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const r = coverRect(FACADE.w, FACADE.h, W, H, FACADE.focus.x, FACADE.focus.y);
      Object.assign(layers.facadeBox.style, {
        left: `${r.x}px`,
        top: `${r.y}px`,
        width: `${r.w}px`,
        height: `${r.h}px`,
        transformOrigin: `${FACADE.door.x * 100}% ${FACADE.door.y * 100}%`,
      });
    };

    if (reduce) {
      layoutFacade();
      gsap.set([layers.space, layers.sounion, layers.plaka, layers.acropolis, layers.window, layers.armrest, layers.handHold, layers.handGuide, layers.gyros, layers.interior], { opacity: 0 });
      gsap.set(layers.facade, { opacity: 1 });
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    // Progression lissée : on pilote la timeline nous-mêmes à partir du scroll (en pixels).
    let current = window.scrollY;

    const build = () => {
      tl?.kill();
      layoutFacade();

      const vh = window.innerHeight;
      const maxScroll = Math.max(document.documentElement.scrollHeight - vh, vh);
      const tops = ANCHORS.map((sel) => {
        const node = document.querySelector(sel);
        return node ? node.getBoundingClientRect().top + window.scrollY : null;
      });
      // Repli : si une ancre manque, on répartit le reste uniformément.
      const bounds: number[] = [];
      let prev = 0;
      tops.forEach((t, i) => {
        const fallback = prev + (maxScroll - prev) / (ANCHORS.length - i + 1);
        const v = t === null || t <= prev ? fallback : Math.min(t, maxScroll - 1);
        bounds.push(v);
        prev = v;
      });
      const [aEnd, bEnd, cEnd, dEnd] = bounds;
      const A = Math.max(aEnd, 1);
      const B = Math.max(bEnd - aEnd, 1);
      const C = Math.max(cEnd - bEnd, 1);
      const D = Math.max(dEnd - cEnd, 1);
      const E = Math.max(maxScroll - dEnd, 1);
      const sB = A;
      const sC = A + B;
      const sD = A + B + C;
      const sE = A + B + C + D;

      const arcLen = layers.arc.getTotalLength();
      gsap.set(layers.arc, { strokeDasharray: arcLen, strokeDashoffset: arcLen });

      // État initial
      gsap.set([layers.sounion, layers.plaka, layers.acropolis, layers.facade, layers.interior, layers.window, layers.armrest, layers.handHold, layers.handGuide, layers.gyros, layers.plane], { opacity: 0 });
      gsap.set([layers.space, layers.stars, layers.earthBox], { opacity: 1 });
      gsap.set(layers.earthBox, { scale: 1 });
      gsap.set(layers.facadeBox, { scale: 1 });
      gsap.set([layers.doorL, layers.doorR], { rotateY: 0 });

      const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      // ---- Scène A : Terre, avion, hublot (tout se joue avant l'arrivée de la première carte) ----
      t.to(layers.earthBox, { scale: 1.45, duration: A * 0.3 }, 0)
        .to(layers.earthBox, { scale: 2.3, duration: A * 0.2 }, A * 0.3)
        .to(layers.arc, { strokeDashoffset: 0, duration: A * 0.28 }, A * 0.05)
        .to(layers.plane, { opacity: 1, duration: A * 0.03 }, A * 0.04)
        .to(
          layers.plane,
          {
            duration: A * 0.28,
            motionPath: { path: layers.arc, align: layers.arc, alignOrigin: [0.5, 0.5], autoRotate: 90 },
          },
          A * 0.05,
        )
        .to(layers.plane, { opacity: 0, duration: A * 0.04 }, A * 0.33)
        .fromTo(layers.window, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: A * 0.12 }, A * 0.34)
        .fromTo(layers.armrest, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: A * 0.1 }, A * 0.37)
        .fromTo(layers.sounion, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1.2, duration: A * 0.12 }, A * 0.38)
        .to([layers.stars, layers.earthBox], { opacity: 0, duration: A * 0.1 }, A * 0.4)
        .to(layers.space, { opacity: 0, duration: A * 0.08 }, A * 0.48)
        .to(layers.window, { scale: 4.8, opacity: 0, duration: A * 0.16 }, A * 0.54)
        .to(layers.armrest, { opacity: 0, y: 140, duration: A * 0.1 }, A * 0.55)
        .to(layers.sounion, { scale: 1.0, duration: A * 0.2 }, A * 0.54);

      // ---- Scène B : Sounion, follow me ----
      t.fromTo(layers.handHold, { opacity: 0, x: 140, y: 180 }, { opacity: 1, x: 0, y: 0, duration: B * 0.16 }, sB)
        .fromTo(layers.handGuide, { opacity: 0, x: -180, y: 70 }, { opacity: 1, x: 0, y: 0, duration: B * 0.2 }, sB + B * 0.04)
        .to(layers.sounion, { scale: 1.16, duration: B }, sB)
        .to(layers.sounionImg, { xPercent: -3, yPercent: -2, duration: B }, sB)
        .to(layers.handGuide, { x: 40, y: -30, duration: B * 0.8 }, sB + B * 0.2)
        .fromTo(layers.plaka, { opacity: 0, scale: 1.32 }, { opacity: 1, scale: 1.0, duration: B * 0.2 }, sB + B * 0.8);

      // ---- Scène C : Plaka, gyros, Acropole ----
      t.to(layers.plaka, { scale: 1.18, duration: C * 0.65 }, sC)
        .to(layers.plakaImg, { yPercent: -4, duration: C * 0.65 }, sC)
        .fromTo(layers.gyros, { opacity: 0, y: 70, rotation: -8 }, { opacity: 1, y: 0, rotation: 0, duration: C * 0.14 }, sC + C * 0.14)
        .to(layers.gyros, { opacity: 0, y: 50, duration: C * 0.12 }, sC + C * 0.6)
        .fromTo(layers.acropolis, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1.0, duration: C * 0.25 }, sC + C * 0.55)
        .to(layers.plaka, { opacity: 0, duration: C * 0.05 }, sC + C * 0.8)
        .to(layers.acropolis, { scale: 1.06, duration: C * 0.2 }, sC + C * 0.8)
        .to(layers.handGuide, { opacity: 0, x: -90, duration: C * 0.15 }, sC + C * 0.8)
        .to(layers.handHold, { opacity: 0, y: 140, duration: C * 0.15 }, sC + C * 0.85);

      // ---- Scène D : cathédrale, la porte s'ouvre ----
      t.fromTo(layers.facade, { opacity: 0 }, { opacity: 1, duration: D * 0.14 }, sD)
        .to(layers.acropolis, { opacity: 0, duration: D * 0.1 }, sD + D * 0.1)
        .to(layers.facadeBox, { scale: 4.2, duration: D * 0.55 }, sD)
        .to(layers.doorL, { rotateY: -108, duration: D * 0.24 }, sD + D * 0.5)
        .to(layers.doorR, { rotateY: 108, duration: D * 0.24 }, sD + D * 0.5)
        .to(layers.facadeBox, { scale: 12, duration: D * 0.3 }, sD + D * 0.7)
        .fromTo(layers.interior, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1.0, duration: D * 0.15 }, sD + D * 0.85);

      // ---- Scène E : intérieur, lent travelling ----
      t.to(layers.interior, { scale: 1.08, duration: E }, sE).to(layers.facade, { opacity: 0, duration: 1 }, sE + 1);

      tl = t;
      t.time(Math.min(current, t.duration()));
    };

    build();

    const tick = () => {
      if (!tl) return;
      const target = window.scrollY;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.4) current = target;
      tl.time(Math.min(Math.max(current, 0), tl.duration()));
    };
    gsap.ticker.add(tick);
    // Onglet en arrière-plan (pas de requestAnimationFrame) : on avance aussi sur l'événement scroll.
    const onScroll = () => {
      if (document.visibilityState === "hidden") tick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let lastH = document.documentElement.scrollHeight;
    const scheduleRebuild = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => build());
    };
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) > 4) {
        lastH = h;
        scheduleRebuild();
      }
    });
    ro.observe(document.body);
    window.addEventListener("resize", scheduleRebuild);
    window.addEventListener("load", scheduleRebuild);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleRebuild);
      window.removeEventListener("load", scheduleRebuild);
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      tl?.kill();
    };
  }, []);

  const door = FACADE.door;
  const doorStyle = {
    left: `${(door.x - door.w / 2) * 100}%`,
    top: `${(door.y - door.h / 2) * 100}%`,
    width: `${door.w * 100}%`,
    height: `${door.h * 100}%`,
  } as const;

  return (
    <div ref={root} className="scenery" aria-hidden="true">
      {/* Scène A */}
      <div className="scenery-layer scenery-space js-space">
        <div className="scenery-stars js-stars" />
        <div className="scenery-earth-box js-earth-box">
          <img src={earthImg} alt="" decoding="async" {...{ fetchpriority: "high" }} />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="js-arc" d={ARC} fill="none" stroke="hsl(38 60% 72%)" strokeWidth="0.35" strokeDasharray="1 1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <circle cx={PARIS.x} cy={PARIS.y} r="0.6" fill="hsl(38 60% 72%)" />
            <circle cx={ATHENS.x} cy={ATHENS.y} r="0.6" fill="hsl(38 60% 72%)" />
          </svg>
          <svg className="scenery-plane js-plane" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 4c2 0 3 2 3 4v14l22 13v5l-22-6v12l6 5v4l-9-3-9 3v-4l6-5V34L7 40v-5l22-13V8c0-2 1-4 3-4z" fill="#FAF8F5" />
          </svg>
        </div>
      </div>

      {/* Scène B */}
      <div className="scenery-layer js-sounion">
        <img className="scenery-photo" src={sounionImg} alt="" decoding="async" style={{ objectPosition: "60% 55%" }} />
      </div>

      {/* Scène C */}
      <div className="scenery-layer js-plaka">
        <img className="scenery-photo" src={plakaImg} alt="" decoding="async" {...{ fetchpriority: "low" }} style={{ objectPosition: "50% 45%" }} />
      </div>
      <div className="scenery-layer js-acropolis">
        <img className="scenery-photo" src={acropolisImg} alt="" decoding="async" {...{ fetchpriority: "low" }} style={{ objectPosition: "60% 40%" }} />
      </div>

      {/* Scène E (derrière la façade, révélé par la porte) */}
      <div className="scenery-layer js-interior">
        <img className="scenery-photo" src={interiorImg} alt="" decoding="async" style={{ objectPosition: "50% 60%" }} />
      </div>

      {/* Scène D */}
      <div className="scenery-layer js-facade">
        <div className="scenery-facade-box js-facade-box">
          <img src={facadeImg} alt="" decoding="async" {...{ fetchpriority: "low" }} />
          <div className="scenery-doorway" style={doorStyle}>
            <img src={interiorImg} alt="" decoding="async" />
          </div>
          <div className="scenery-doors" style={doorStyle}>
            <div className="scenery-door scenery-door-left js-door-left" />
            <div className="scenery-door scenery-door-right js-door-right" />
          </div>
        </div>
      </div>

      {/* Premier plan : mains et gyros */}
      <img className="scenery-cutout scenery-gyros js-gyros" src={gyrosImg} alt="" decoding="async" />
      <img className="scenery-cutout scenery-hand-hold js-hand-hold" src={handManHold} alt="" decoding="async" />
      <img className="scenery-cutout scenery-hand-guide js-hand-guide" src={handWomanGuide} alt="" decoding="async" />

      {/* Hublot et accoudoir (scène A) */}
      <div className="scenery-layer scenery-window js-window">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <clipPath id="scenery-window-hole">
              <rect x="0" y="0" width="100" height="100" />
            </clipPath>
          </defs>
          <defs>
            <linearGradient id="scenery-cabin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#efe9df" />
              <stop offset="1" stopColor="#cfc6b8" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M0 0 H100 V100 H0 Z M30 22 C30 13 36 10 50 10 C64 10 70 13 70 22 V58 C70 68 64 72 50 72 C36 72 30 68 30 58 Z"
            fill="url(#scenery-cabin)"
          />
          <path
            d="M30 22 C30 13 36 10 50 10 C64 10 70 13 70 22 V58 C70 68 64 72 50 72 C36 72 30 68 30 58 Z"
            fill="none"
            stroke="#7d7467"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M32.5 23 C32.5 15.5 38 13 50 13 C62 13 67.5 15.5 67.5 23 V57 C67.5 65 62 69 50 69 C38 69 32.5 65 32.5 57 Z"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="scenery-layer js-armrest">
        <div className="scenery-armrest" />
        <img className="scenery-cutout scenery-hand-armrest-man" src={handManOpen} alt="" decoding="async" />
        <img className="scenery-cutout scenery-hand-armrest-woman" src={handWomanOpen} alt="" decoding="async" />
      </div>

      <div className="scenery-grade" />
      <div className="scenery-vignette" />
    </div>
  );
};

export default ScrollScenery;
