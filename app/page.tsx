"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

/* ═══════════════════════════════════════════════════
   SUFUMI — Homepage
   Aesthetic: Editorial Brutalism × Terminal Craft
   Inspired by: Zhenya Rynzhuk · Leo Natsume · Gleb Kuznetsov
   Fonts: Bebas Neue (display) · Instrument Serif (serif)
          · DM Mono (terminal)
   Palette: Ember dark · Warm white · Red-orange accent
════════════════════════════════════════════════════ */

const SPANS: Record<string, string> = {
  jhr: "md:col-span-7",
  jpm: "md:col-span-5",
  arlo: "md:col-span-5",
  glide: "md:col-span-7",
  "project-aliaser": "md:col-span-4",
  jcommandchain: "md:col-span-4",
  jyntaxe: "md:col-span-4",
};

/* ── Animated terminal ───────────────────────────── */
const STEPS = [
  { p: "PS >", cmd: "jpm install jhr", delay: 0 },
  { p: "   ", cmd: "↓  fetched  180ms", delay: 1100, dim: true },
  { p: "PS >", cmd: "jhr --watch ./src", delay: 1800 },
  { p: "   ", cmd: "⚡ hot-reload  active", delay: 2900, dim: true },
  { p: "PS >", cmd: "arlo dev", delay: 3600 },
  { p: "   ", cmd: "▸  listening  :8080", delay: 4600, dim: true },
];

function Terminal() {
  const [n, setN] = useState(0);
  useEffect(() => {
    STEPS.forEach((s, i) => setTimeout(() => setN(i + 1), s.delay + 400));
  }, []);
  return (
    <div className="sf-terminal" style={{ fontFamily: "'DM Mono', monospace" }}>
      <div className="sf-terminal__chrome">
        <span className="sf-terminal__dot" style={{ background: "#FF5F56" }} />
        <span className="sf-terminal__dot" style={{ background: "#FFBD2E" }} />
        <span className="sf-terminal__dot" style={{ background: "#27C93F" }} />
        <span className="sf-terminal__label">windows powershell</span>
      </div>
      <div className="sf-terminal__body">
        {STEPS.map((s, i) => (
          <div key={i} className="sf-terminal__row"
            style={{ opacity: n > i ? 1 : 0, transform: n > i ? "none" : "translateY(4px)" }}>
            <span className="sf-terminal__prompt">{s.p}</span>
            <span className={s.dim ? "sf-terminal__dim" : "sf-terminal__cmd"}>{s.cmd}</span>
          </div>
        ))}
        {n >= STEPS.length && (
          <div className="sf-terminal__row" style={{ opacity: 0.4 }}>
            <span className="sf-terminal__prompt">PS &gt;</span>
            <span className="sf-terminal__cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Marquee ticker ──────────────────────────────── */
function Marquee() {
  const items = [...TOOLS, ...TOOLS, ...TOOLS];
  return (
    <div className="sf-marquee">
      <div className="sf-marquee__track">
        {items.map((t, i) => (
          <Link key={i} href={`/tools/${t.slug}`} className="sf-marquee__item">
            <span className="sf-marquee__num" style={{ color: t.accent }}>
              {String(TOOLS.findIndex(x => x.slug === t.slug) + 1).padStart(2, "0")}
            </span>
            <span className="sf-marquee__name">{t.title}</span>
            <span className="sf-marquee__div">·</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Scroll-reveal hook ──────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Tool card ───────────────────────────────────── */
function ToolCard({ tool, idx }: { tool: typeof TOOLS[0]; idx: number }) {
  const span = SPANS[tool.slug] ?? "md:col-span-4";
  const num = String(idx + 1).padStart(2, "0");
  const { ref, visible } = useReveal();

  return (
    <article
      ref={ref}
      className={`sf-card ${span}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity .65s ${idx * 0.07}s ease, transform .65s ${idx * 0.07}s ease`,
      }}
    >
      <div className="sf-card__glow" style={{ background: tool.accent }} />

      <div className="sf-card__head">
        <span className="sf-card__num" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{num}</span>
        <div className="sf-card__rule" />
        <span className="sf-card__lang" style={{ fontFamily: "'DM Mono', monospace" }}>{tool.lang}</span>
      </div>

      <div className="sf-card__body">
        <span className="sf-card__id" style={{ color: tool.accent, fontFamily: "'DM Mono', monospace" }}>{tool.id}</span>
        <h3 className="sf-card__title">{tool.title}</h3>
        <p className="sf-card__desc">{tool.description}</p>
      </div>

      <div className="sf-card__chips">
        {tool.chips.map(c => (
          <span key={c} className="sf-card__chip" style={{ fontFamily: "'DM Mono', monospace" }}>{c}</span>
        ))}
      </div>

      <div className="sf-card__footer">
        <Link href={`/tools/${tool.slug}`}
          className="sf-card__link sf-card__link--accent"
          style={{ color: tool.accent, fontFamily: "'DM Mono', monospace" }}>
          View tool →
        </Link>
        <Link href={`/tools/${tool.slug}/docs`}
          className="sf-card__link"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          Docs
        </Link>
        <a href={tool.github} target="_blank"
          className="sf-card__link sf-card__link--github"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          <svg viewBox="0 0 16 16" className="sf-icon">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GH
        </a>
      </div>
    </article>
  );
}

/* ── Custom cursor ───────────────────────────────── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    const over = (e: MouseEvent) => setBig(!!(e.target as HTMLElement).closest("a, button"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div ref={dot} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: big ? 0 : 8, height: big ? 0 : 8, borderRadius: "50%",
        background: "#FF3D00", transform: "translate(-50%, -50%)",
        transition: "width .2s, height .2s",
      }} />
      <div ref={ring} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9998,
        width: big ? 48 : 32, height: big ? 48 : 32, borderRadius: "50%",
        border: "1px solid rgba(255,61,0,.4)",
        transform: "translate(-50%, -50%)",
        transition: "width .35s cubic-bezier(.17,.67,.35,1.2), height .35s cubic-bezier(.17,.67,.35,1.2), border-color .2s",
      }} />
    </>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function Home() {
  const { ref: phRef, visible: phVis } = useReveal();
  const { ref: ctaRef, visible: ctaVis } = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { background: #040404; color: #EEEBE4; scroll-behavior: smooth; cursor: none; }
        body { background: #040404; overflow-x: hidden; }

        /* ── Noise ── */
        .sf-grain {
          pointer-events: none; position: fixed; inset: 0; z-index: 1;
          opacity: 0.045; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 300px;
        }
        /* scanline overlay */
        .sf-scanlines {
          pointer-events: none; position: fixed; inset: 0; z-index: 2;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,.08) 2px,
            rgba(0,0,0,.08) 4px
          );
          opacity: 0.4;
        }
        /* subtle grid */
        .sf-grid-bg {
          pointer-events: none; position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(238,235,228,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(238,235,228,.018) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .sf-glow-a {
          pointer-events: none; position: fixed;
          top: -25vh; left: -15vw; width: 80vw; height: 80vh;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,61,0,.08) 0%, transparent 68%);
          z-index: 0;
        }
        .sf-glow-b {
          pointer-events: none; position: fixed;
          bottom: -15vh; right: -15vw; width: 70vw; height: 70vh;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,180,41,.04) 0%, transparent 70%);
          z-index: 0;
        }

        /* ── Nav ── */
        .sf-nav {
          position: sticky; top: 0; z-index: 50;
          border-bottom: 1px solid rgba(238,235,228,.07);
          background: rgba(4,4,4,.92); backdrop-filter: blur(28px);
          box-shadow: 0 1px 0 rgba(255,61,0,.08);
        }
        .sf-nav__inner {
          max-width: 1280px; margin: 0 auto; padding: 0 2rem;
          height: 58px; display: flex; align-items: center; justify-content: space-between;
        }
        .sf-nav__logo { display: flex; align-items: center; gap: .75rem; text-decoration: none; }
        .sf-nav__mark {
          width: 32px; height: 32px; border-radius: 6px;
          border: 1px solid rgba(255,61,0,.28); background: rgba(255,61,0,.07);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace; font-size: 10px; color: #FF3D00;
        }
        .sf-nav__wordmark {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem;
          letter-spacing: .05em; color: #EEEBE4;
        }
        .sf-nav__badge {
          font-family: 'DM Mono', monospace; font-size: 9px;
          text-transform: uppercase; letter-spacing: .2em; color: #FF3D00;
          border: 1px solid rgba(255,61,0,.22); background: rgba(255,61,0,.07);
          padding: 2px 8px; border-radius: 2px;
        }
        .sf-nav__links {
          display: flex; align-items: center; gap: 2.5rem; list-style: none; padding: 0;
        }
        .sf-nav__link {
          font-family: 'DM Mono', monospace; font-size: .68rem;
          color: rgba(238,235,228,.38); text-decoration: none;
          text-transform: uppercase; letter-spacing: .14em; transition: color .2s;
        }
        .sf-nav__link:hover { color: rgba(238,235,228,.88); }
        .sf-nav__cta {
          font-family: 'DM Mono', monospace; font-size: .7rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: .1em;
          background: #FF3D00; color: #040404;
          padding: 9px 20px; border-radius: 4px; text-decoration: none;
          box-shadow: 0 0 0 1px rgba(255,61,0,.45), 0 0 28px rgba(255,61,0,.18);
          transition: box-shadow .2s, transform .15s;
        }
        .sf-nav__cta:hover {
          box-shadow: 0 0 0 1px rgba(255,61,0,.75), 0 0 44px rgba(255,61,0,.3);
          transform: translateY(-1px);
        }

        /* ── Hero ── */
        .sf-hero {
          position: relative; z-index: 10;
          max-width: 1280px; margin: 0 auto; padding: 0 2rem;
          min-height: calc(100vh - 58px);
          display: grid; grid-template-columns: 1.1fr 1fr;
          align-items: center; gap: 4rem;
        }
        @media (max-width: 960px) {
          .sf-hero { grid-template-columns: 1fr; min-height: auto; padding-top: 5rem; padding-bottom: 4rem; gap: 3rem; }
        }
        .sf-hero__left { position: relative; }
        .sf-hero__eyebrow {
          display: inline-flex; align-items: center; gap: .6rem; margin-bottom: 1.75rem;
          font-family: 'DM Mono', monospace; font-size: .68rem;
          color: rgba(238,235,228,.32); text-transform: uppercase; letter-spacing: .2em;
        }
        .sf-hero__dot {
          width: 6px; height: 6px; border-radius: 50%; background: #FF3D00;
          animation: sfpulse 2s ease infinite;
        }
        @keyframes sfpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.75)} }

        .sf-hero__headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(6rem, 13vw, 11rem);
          line-height: .88; letter-spacing: .01em; color: #EEEBE4;
        }
        .sf-hero__headline em {
          font-family: 'Instrument Serif', serif; font-style: italic;
          color: #FF3D00; display: block;
        }
        /* ghost number behind headline */
        .sf-hero__ghost {
          position: absolute; top: 40%; right: -2rem;
          transform: translateY(-50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(16rem, 34vw, 30rem);
          line-height: 1; letter-spacing: -.02em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(238,235,228,.028);
          pointer-events: none; user-select: none; z-index: -1;
        }
        /* vertical rule left of hero text */
        .sf-hero__vbar {
          position: absolute; left: -1.5rem; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, #FF3D00 30%, #FF3D00 70%, transparent);
          opacity: 0.22;
        }
        /* coordinate label */
        .sf-hero__coord {
          font-family: 'DM Mono', monospace; font-size: .55rem;
          text-transform: uppercase; letter-spacing: .22em;
          color: rgba(238,235,228,.16); display: block; margin-top: 1rem;
        }
        .sf-hero__sub {
          margin-top: 2rem; max-width: 400px;
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1.2rem; line-height: 1.75; color: rgba(238,235,228,.48);
        }
        .sf-hero__actions {
          display: flex; align-items: center; gap: 1rem; margin-top: 2.75rem; flex-wrap: wrap;
        }
        .sf-hero__btn-primary {
          display: inline-flex; align-items: center; gap: .5rem;
          font-family: 'DM Mono', monospace; font-size: .76rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: .1em;
          background: #FF3D00; color: #040404;
          padding: 14px 28px; border-radius: 4px; text-decoration: none;
          box-shadow: 0 0 0 1px rgba(255,61,0,.5), 0 0 34px rgba(255,61,0,.22);
          transition: all .2s;
        }
        .sf-hero__btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(255,61,0,.9), 0 0 56px rgba(255,61,0,.38);
          transform: translateY(-1px);
        }
        .sf-hero__btn-ghost {
          display: inline-flex; align-items: center; gap: .5rem;
          font-family: 'DM Mono', monospace; font-size: .76rem;
          text-transform: uppercase; letter-spacing: .1em;
          color: rgba(238,235,228,.4); text-decoration: none;
          border: 1px solid rgba(238,235,228,.1); padding: 13px 26px; border-radius: 4px;
          transition: all .2s;
        }
        .sf-hero__btn-ghost:hover { color: rgba(238,235,228,.85); border-color: rgba(238,235,228,.22); }
        .sf-hero__stats {
          display: flex; gap: 0; margin-top: 3.5rem;
          border: 1px solid rgba(238,235,228,.07); border-radius: 6px; overflow: hidden;
        }
        .sf-hero__stats > div {
          flex: 1; padding: 1rem 1.5rem;
          border-right: 1px solid rgba(238,235,228,.07);
        }
        .sf-hero__stats > div:last-child { border-right: none; }
        .sf-hero__stat-val {
          display: block; font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem; letter-spacing: .03em; color: #EEEBE4; line-height: 1;
        }
        .sf-hero__stat-label {
          display: block; margin-top: .3rem;
          font-family: 'DM Mono', monospace; font-size: .62rem;
          text-transform: uppercase; letter-spacing: .18em; color: rgba(238,235,228,.28);
        }
        .sf-hero__tags { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem; }
        .sf-hero__tag {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          text-transform: uppercase; letter-spacing: .12em;
          color: rgba(238,235,228,.28); border: 1px solid rgba(238,235,228,.08);
          padding: 4px 10px; border-radius: 2px;
        }

        /* ── Terminal ── */
        .sf-terminal {
          background: #0B0B0B; border: 1px solid rgba(238,235,228,.08);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,61,0,.05);
        }
        .sf-terminal__chrome {
          display: flex; align-items: center; gap: 7px; padding: 12px 16px;
          border-bottom: 1px solid rgba(238,235,228,.06); background: rgba(238,235,228,.015);
        }
        .sf-terminal__dot { width: 11px; height: 11px; border-radius: 50%; }
        .sf-terminal__label {
          margin-left: auto; font-family: 'DM Mono', monospace;
          font-size: .62rem; text-transform: uppercase; letter-spacing: .18em;
          color: rgba(238,235,228,.18);
        }
        .sf-terminal__body { padding: 1.4rem 1.6rem; }
        .sf-terminal__row {
          display: flex; align-items: flex-start; gap: .8rem; margin-bottom: .5rem;
          font-size: .8rem; line-height: 1.65;
          transition: opacity .45s ease, transform .45s ease;
        }
        .sf-terminal__prompt { color: #FF3D00; flex-shrink: 0; }
        .sf-terminal__cmd   { color: rgba(238,235,228,.8); }
        .sf-terminal__dim   { color: rgba(238,235,228,.28); }
        .sf-terminal__cursor {
          display: inline-block; width: 8px; height: 15px;
          background: rgba(255,61,0,.5); animation: sfblink 1.1s step-end infinite;
        }
        @keyframes sfblink { 50%{opacity:0} }

        /* ── Marquee ── */
        .sf-marquee {
          position: relative; z-index: 10;
          border-top: 1px solid rgba(238,235,228,.06);
          border-bottom: 1px solid rgba(238,235,228,.06);
          padding: 11px 0; overflow: hidden; background: rgba(238,235,228,.012);
        }
        .sf-marquee__track {
          display: flex; width: max-content;
          animation: sfmarquee 38s linear infinite;
        }
        .sf-marquee__track:hover { animation-play-state: paused; }
        @keyframes sfmarquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        .sf-marquee__item {
          display: flex; align-items: center; gap: .75rem;
          padding: 0 2.25rem; text-decoration: none; white-space: nowrap; transition: opacity .2s;
        }
        .sf-marquee__item:hover { opacity: .6; }
        .sf-marquee__num { font-family: 'DM Mono', monospace; font-size: .62rem; font-weight: 500; }
        .sf-marquee__name {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .92rem; color: rgba(238,235,228,.42);
        }
        .sf-marquee__div {
          font-family: 'DM Mono', monospace; font-size: .6rem;
          color: rgba(238,235,228,.14); margin-left: .6rem;
        }

        /* ── Shared section wrapper ── */
        .sf-section { max-width: 1280px; margin: 0 auto; padding: 6rem 2rem; position: relative; z-index: 10; }

        .sf-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap; margin-bottom: 2.75rem;
          padding-bottom: 1.75rem; border-bottom: 1px solid rgba(238,235,228,.07);
          position: relative;
        }
        /* ghost label behind section header */
        .sf-section-header::before {
          content: attr(data-label);
          position: absolute; right: 0; top: -1.5rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 7rem; line-height: 1; letter-spacing: .02em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(238,235,228,.04);
          pointer-events: none; user-select: none;
        }
        .sf-section-label {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          text-transform: uppercase; letter-spacing: .22em;
          color: rgba(238,235,228,.25); margin-bottom: .6rem;
        }
        .sf-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.8rem, 5.5vw, 4.5rem);
          letter-spacing: .02em; line-height: .92; color: #EEEBE4;
        }
        .sf-section-title em {
          font-family: 'Instrument Serif', serif; font-style: italic;
          color: rgba(238,235,228,.42); font-size: .88em;
        }
        .sf-section-sub {
          max-width: 260px; font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .9rem; line-height: 1.8; color: rgba(238,235,228,.35);
        }

        /* ── Bento grid ── */
        .sf-grid {
          display: grid; grid-template-columns: repeat(12, 1fr);
          gap: 1px; background: rgba(238,235,228,.06);
          border: 1px solid rgba(238,235,228,.06);
          border-radius: 10px; overflow: hidden;
        }

        /* ── Tool card ── */
        .sf-card {
          position: relative; overflow: hidden; background: #060606;
          padding: 2.25rem; display: flex; flex-direction: column; gap: 1.1rem;
          transition: background .25s;
          border-top: 2px solid transparent;
        }
        .sf-card:hover { background: #0E0E0E; }
        .sf-card__glow {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          transition: opacity .4s;
          background: radial-gradient(ellipse at 15% -10%, currentColor 0%, transparent 55%);
          mix-blend-mode: screen;
        }
        .sf-card:hover .sf-card__glow { opacity: .06; }
        /* left accent bar on hover */
        .sf-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: currentColor;
          transform: scaleY(0); transform-origin: top;
          transition: transform .35s cubic-bezier(.17,.67,.35,1);
        }
        .sf-card:hover::before { transform: scaleY(1); }
        .sf-card__head { display: flex; align-items: center; gap: .75rem; }
        .sf-card__num {
          font-size: 3rem; line-height: 1; letter-spacing: .02em;
          color: rgba(238,235,228,.05); flex-shrink: 0;
          font-family: 'Bebas Neue', sans-serif;
        }
        .sf-card__rule { flex: 1; height: 1px; background: rgba(238,235,228,.07); }
        .sf-card__lang {
          font-size: .58rem; text-transform: uppercase; letter-spacing: .16em;
          color: rgba(238,235,228,.22); white-space: nowrap;
        }
        .sf-card__body { flex: 1; }
        .sf-card__id {
          font-size: .62rem; text-transform: uppercase; letter-spacing: .2em;
          display: block; margin-bottom: .65rem;
        }
        .sf-card__title {
          font-family: 'Instrument Serif', serif; font-size: 1.4rem;
          line-height: 1.2; color: rgba(238,235,228,.88); margin-bottom: .7rem;
        }
        .sf-card__desc {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .88rem; line-height: 1.8; color: rgba(238,235,228,.36);
        }
        .sf-card__chips { display: flex; flex-wrap: wrap; gap: .4rem; }
        .sf-card__chip {
          font-size: .58rem; text-transform: uppercase; letter-spacing: .1em;
          color: rgba(238,235,228,.28); border: 1px solid rgba(238,235,228,.08);
          padding: 3px 9px; border-radius: 2px;
        }
        .sf-card__footer {
          display: flex; align-items: center; gap: 1.5rem;
          padding-top: 1rem; border-top: 1px solid rgba(238,235,228,.06);
        }
        .sf-card__link {
          font-size: .65rem; text-transform: uppercase; letter-spacing: .12em;
          color: rgba(238,235,228,.28); text-decoration: none;
          display: flex; align-items: center; gap: .3rem; transition: color .2s;
        }
        .sf-card__link:hover { color: rgba(238,235,228,.78); }
        .sf-card__link--github { margin-left: auto; }
        .sf-icon { width: 13px; height: 13px; fill: currentColor; }

        /* ── Philosophy ── */
        .sf-philo {
          position: relative; z-index: 10;
          border-top: 1px solid rgba(238,235,228,.07);
          border-bottom: 1px solid rgba(238,235,228,.07);
          background: rgba(238,235,228,.012);
          overflow: hidden;
        }
        .sf-philo::before {
          content: '"';
          position: absolute; top: -2rem; left: calc(50% - 38rem);
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 28rem; line-height: 1; color: rgba(255,61,0,.025);
          pointer-events: none; user-select: none;
        }
        .sf-philo__inner {
          max-width: 1280px; margin: 0 auto; padding: 8rem 2rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;
          position: relative;
        }
        @media (max-width: 820px) { .sf-philo__inner { grid-template-columns: 1fr; gap: 3.5rem; } }
        .sf-philo__quote {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: clamp(1.85rem, 3.5vw, 2.9rem); line-height: 1.35;
          color: rgba(238,235,228,.78);
        }
        .sf-philo__quote strong { font-style: normal; color: #FF3D00; font-weight: 400; }
        .sf-philo__list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1px; }
        .sf-philo__item {
          display: flex; align-items: flex-start; gap: 1.1rem;
          padding: 1.25rem; background: #060606;
          border: 1px solid rgba(238,235,228,.06);
          border-bottom: none; transition: background .2s;
        }
        .sf-philo__item:first-child { border-radius: 8px 8px 0 0; }
        .sf-philo__item:last-child  { border-bottom: 1px solid rgba(238,235,228,.06); border-radius: 0 0 8px 8px; }
        .sf-philo__item:hover { background: #0D0D0D; }
        .sf-philo__icon {
          font-family: 'DM Mono', monospace; font-size: .65rem;
          color: #FF3D00; flex-shrink: 0; padding-top: .15rem; line-height: 1.6;
        }
        .sf-philo__head {
          font-family: 'DM Mono', monospace; font-size: .7rem;
          text-transform: uppercase; letter-spacing: .12em;
          color: rgba(238,235,228,.7); margin-bottom: .3rem;
        }
        .sf-philo__body {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .88rem; line-height: 1.7; color: rgba(238,235,228,.36);
        }

        /* ── CTA ── */
        .sf-cta { max-width: 1280px; margin: 0 auto; padding: 6rem 2rem; position: relative; z-index: 10; }
        .sf-cta__grid {
          display: grid; grid-template-columns: 5fr 4fr; gap: 1px;
          background: rgba(238,235,228,.06); border: 1px solid rgba(238,235,228,.06);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 2px 0 rgba(255,61,0,.07);
        }
        @media (max-width: 820px) { .sf-cta__grid { grid-template-columns: 1fr; } }
        .sf-cta__panel { background: #060606; padding: 3.5rem; transition: background .2s; position: relative; overflow: hidden; }
        .sf-cta__panel:hover { background: #0A0A0A; }
        /* diagonal slash decoration */
        .sf-cta__panel:first-child::after {
          content: ''; position: absolute; right: -4rem; top: -4rem;
          width: 12rem; height: 12rem;
          border: 1px solid rgba(255,61,0,.08);
          border-radius: 50%;
          pointer-events: none;
        }
        .sf-cta__panel-label {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          text-transform: uppercase; letter-spacing: .2em;
          color: rgba(238,235,228,.25); margin-bottom: 1rem;
        }
        .sf-cta__panel-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 3.6rem;
          letter-spacing: .02em; line-height: .9; color: #EEEBE4; margin-bottom: 1.25rem;
        }
        .sf-cta__panel-body {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .92rem; line-height: 1.8; color: rgba(238,235,228,.38);
          max-width: 320px; margin-bottom: 2rem;
        }
        .sf-cta__cmd {
          font-family: 'DM Mono', monospace; font-size: .8rem; color: #FF3D00;
          background: rgba(255,61,0,.06); border: 1px solid rgba(255,61,0,.14);
          border-left: 3px solid rgba(255,61,0,.5);
          padding: 13px 18px; border-radius: 0 4px 4px 0; margin-bottom: 1.75rem;
          letter-spacing: .06em;
        }
        .sf-cta__cmd::before { content: '$ '; opacity: .4; }
        .sf-cta__actions { display: flex; gap: .85rem; align-items: center; flex-wrap: wrap; }
        .sf-cta__btn-primary {
          font-family: 'DM Mono', monospace; font-size: .72rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: .1em;
          background: #FF3D00; color: #040404;
          padding: 12px 24px; border-radius: 4px; text-decoration: none;
          box-shadow: 0 0 0 1px rgba(255,61,0,.5), 0 0 28px rgba(255,61,0,.2);
          transition: all .2s;
        }
        .sf-cta__btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(255,61,0,.85), 0 0 48px rgba(255,61,0,.34);
          transform: translateY(-1px);
        }
        .sf-cta__btn-ghost {
          font-family: 'DM Mono', monospace; font-size: .72rem;
          text-transform: uppercase; letter-spacing: .1em;
          color: rgba(238,235,228,.38); text-decoration: none; transition: color .2s;
        }
        .sf-cta__btn-ghost:hover { color: rgba(238,235,228,.8); }

        /* Tool list */
        .sf-tlist { list-style: none; padding: 0; }
        .sf-tlist__item {
          display: flex; align-items: center; justify-content: space-between;
          padding: .9rem 0; border-bottom: 1px solid rgba(238,235,228,.06);
          transition: opacity .15s;
        }
        .sf-tlist__item:first-child { border-top: 1px solid rgba(238,235,228,.06); }
        .sf-tlist__item:hover { opacity: .7; }
        .sf-tlist__left { display: flex; align-items: center; gap: 1rem; }
        .sf-tlist__id {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          text-transform: uppercase; letter-spacing: .14em; width: 34px;
        }
        .sf-tlist__name {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: .9rem; color: rgba(238,235,228,.5);
        }
        .sf-tlist__links { display: flex; align-items: center; gap: 1.25rem; }
        .sf-tlist__link {
          font-family: 'DM Mono', monospace; font-size: .6rem;
          text-transform: uppercase; letter-spacing: .12em;
          color: rgba(238,235,228,.22); text-decoration: none; transition: color .2s;
        }
        .sf-tlist__link:hover { color: rgba(238,235,228,.65); }

        /* ── Footer ── */
        .sf-footer {
          border-top: 1px solid rgba(238,235,228,.07);
          position: relative; z-index: 10;
          box-shadow: 0 -1px 0 rgba(255,61,0,.06);
        }
        .sf-footer__inner {
          max-width: 1280px; margin: 0 auto; padding: 2rem;
          display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
        }
        .sf-footer__copy {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          color: rgba(238,235,228,.2); letter-spacing: .1em;
        }
        .sf-footer__copy span { color: #FF3D00; }
        .sf-footer__links { display: flex; align-items: center; gap: 1.75rem; flex-wrap: wrap; }
        .sf-footer__link {
          font-family: 'DM Mono', monospace; font-size: .62rem;
          color: rgba(238,235,228,.2); text-decoration: none;
          letter-spacing: .1em; text-transform: uppercase; transition: color .2s;
        }
        .sf-footer__link:hover { color: rgba(238,235,228,.6); }

        /* ── Animations ── */
        @keyframes sfFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sf-fu  { animation: sfFadeUp .7s ease both; }
        .sf-fu2 { animation: sfFadeUp .7s .1s ease both; }
        .sf-fu3 { animation: sfFadeUp .7s .2s ease both; }
        .sf-fu4 { animation: sfFadeUp .7s .32s ease both; }

        /* ── Responsive grid ── */
        @media (max-width: 768px) {
          .sf-nav__links { display: none; }
          .sf-grid { grid-template-columns: 1fr !important; }
          .sf-card { grid-column: 1/-1 !important; }
        }
        .md\\:col-span-4 { grid-column: span 12; }
        .md\\:col-span-5 { grid-column: span 12; }
        .md\\:col-span-7 { grid-column: span 12; }
        @media (min-width: 768px) {
          .md\\:col-span-4 { grid-column: span 4; }
          .md\\:col-span-5 { grid-column: span 5; }
          .md\\:col-span-7 { grid-column: span 7; }
        }
      `}</style>

      <Cursor />
      <div className="sf-grain" />
      <div className="sf-scanlines" />
      <div className="sf-grid-bg" />
      <div className="sf-glow-a" />
      <div className="sf-glow-b" />

      {/* ════════ NAV ════════ */}
      <nav className="sf-nav">
        <div className="sf-nav__inner">
          <Link href="/" className="sf-nav__logo">
            <div className="sf-nav__mark">sf</div>
            <span className="sf-nav__wordmark">Sufumi</span>
            <span className="sf-nav__badge">Windows</span>
          </Link>
          <ul className="sf-nav__links">
            <li><a href="#tools" className="sf-nav__link">Tools</a></li>
            <li><Link href="/tools/jhr/docs" className="sf-nav__link">Docs</Link></li>
            <li><a href="https://github.com/JasnRathore" target="_blank" className="sf-nav__link">GitHub</a></li>
          </ul>
          <Link href="/tools/jpm" className="sf-nav__cta">Get JPM</Link>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="sf-hero">
        <span className="sf-hero__ghost" aria-hidden>07</span>

        <div className="sf-hero__left">
          <div className="sf-hero__vbar" />
          <p className="sf-fu sf-hero__eyebrow">
            <span className="sf-hero__dot" />
            7 tools · all open source
          </p>

          <h1 className="sf-fu2 sf-hero__headline">
            Fast.<br />
            Light.<br />
            <em>Windows.</em>
          </h1>

          <p className="sf-fu3 sf-hero__sub">
            A suite of sharp, single-purpose tools built to remove
            friction from your workflow. Each one does one thing — brutally well.
          </p>

          <div className="sf-fu4 sf-hero__actions">
            <Link href="/tools/jpm" className="sf-hero__btn-primary">
              Install JPM
              <svg viewBox="0 0 16 16" style={{ width: 13, height: 13, fill: "currentColor" }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </Link>
            <a href="#tools" className="sf-hero__btn-ghost">Browse tools ↓</a>
          </div>

          <div className="sf-fu4 sf-hero__stats">
            {[
              { val: "07", label: "Open source tools" },
              { val: "Go", label: "Primary language" },
              { val: "MIT", label: "License" },
            ].map(s => (
              <div key={s.label}>
                <span className="sf-hero__stat-val"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.val}</span>
                <span className="sf-hero__stat-label"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{s.label}</span>
              </div>
            ))}
          </div>
          <span className="sf-hero__coord">48.8566° N · 2.3522° E · build/2025</span>
        </div>

        <div className="sf-fu3 sf-hero__right">
          <Terminal />
          <div className="sf-hero__tags">
            {["Go", "Rust", "Java", "Tauri", "Vite", "Windows", "MIT"].map(t => (
              <span key={t} className="sf-hero__tag">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ MARQUEE ════════ */}
      <Marquee />

      {/* ════════ TOOLS BENTO ════════ */}
      <div id="tools" className="sf-section">
        <div className="sf-section-header" data-label="TOOLS">
          <div>
            <p className="sf-section-label">{"// 01 — Projects"}</p>
            <h2 className="sf-section-title">
              The full<br /><em>toolkit.</em>
            </h2>
          </div>
          <p className="sf-section-sub">
            Seven tools. Each one built because something was too slow,
            too heavy, or simply didn&apos;t exist.
          </p>
        </div>
        <div className="sf-grid">
          {TOOLS.map((tool, i) => <ToolCard key={tool.slug} tool={tool} idx={i} />)}
        </div>
      </div>

      {/* ════════ PHILOSOPHY ════════ */}
      <section
        ref={phRef}
        className="sf-philo"
        style={{
          opacity: phVis ? 1 : 0,
          transform: phVis ? "none" : "translateY(32px)",
          transition: "opacity .85s ease, transform .85s ease",
        }}
      >
        <div className="sf-philo__inner">
          <div>
            <p className="sf-section-label" style={{ marginBottom: "1.75rem" }}>{"// 02 — Philosophy"}</p>
            <blockquote className="sf-philo__quote">
              Developer tools should be <strong>invisible.</strong>{" "}
              If you&apos;re thinking about your build system, it&apos;s already failed you.
            </blockquote>
          </div>
          <ul className="sf-philo__list">
            {[
              { icon: "01", head: "Single binary", body: "Ship as one file. No ceremony, no runtime, no wizard." },
              { icon: "02", head: "Windows-first", body: "Built for where most professional developers actually work." },
              { icon: "03", head: "Read the source", body: "Small enough to audit the whole thing in a weekend." },
              { icon: "04", head: "Zero telemetry", body: "Nothing phones home. What you build stays yours." },
            ].map(item => (
              <li key={item.head} className="sf-philo__item">
                <span className="sf-philo__icon"
                  style={{ fontFamily: "'DM Mono', monospace" }}>{item.icon}</span>
                <div>
                  <p className="sf-philo__head">{item.head}</p>
                  <p className="sf-philo__body">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <div
        ref={ctaRef}
        className="sf-cta"
        style={{
          opacity: ctaVis ? 1 : 0,
          transform: ctaVis ? "none" : "translateY(32px)",
          transition: "opacity .85s ease, transform .85s ease",
        }}
      >
        <p className="sf-section-label" style={{ marginBottom: "1.75rem" }}>{"// 03 — Get started"}</p>
        <div className="sf-cta__grid">
          <div className="sf-cta__panel">
            <p className="sf-cta__panel-label">Start here</p>
            <h3 className="sf-cta__panel-title"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Install<br />JPM.
            </h3>
            <p className="sf-cta__panel-body">
              The package manager for the whole suite.
              Get it once, install everything else in seconds.
            </p>
            <div className="sf-cta__cmd">jpm install jhr arlo glide</div>
            <div className="sf-cta__actions">
              <Link href="/tools/jpm" className="sf-cta__btn-primary">Get JPM →</Link>
              <Link href="/tools/jpm/docs" className="sf-cta__btn-ghost">Read the docs</Link>
            </div>
          </div>

          <div className="sf-cta__panel">
            <p className="sf-cta__panel-label">All tools</p>
            <h3 className="sf-cta__panel-title"
              style={{ fontFamily: "'Bebas Neue', sans-serif", marginBottom: "1.75rem" }}>
              Browse.
            </h3>
            <ul className="sf-tlist">
              {TOOLS.map(t => (
                <li key={t.slug} className="sf-tlist__item">
                  <div className="sf-tlist__left">
                    <span className="sf-tlist__id"
                      style={{ color: t.accent, fontFamily: "'DM Mono', monospace" }}>{t.id}</span>
                    <span className="sf-tlist__name">{t.title}</span>
                  </div>
                  <div className="sf-tlist__links">
                    <Link href={`/tools/${t.slug}`} className="sf-tlist__link">Page</Link>
                    <Link href={`/tools/${t.slug}/docs`} className="sf-tlist__link">Docs →</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ════════ FOOTER ════════ */}
      <footer className="sf-footer">
        <div className="sf-footer__inner">
          <p className="sf-footer__copy">
            <span>sf</span> · sufumi · MIT · {new Date().getFullYear()}
          </p>
          <nav className="sf-footer__links">
            <a href="https://github.com/JasnRathore" target="_blank" className="sf-footer__link">GitHub</a>
            {TOOLS.map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="sf-footer__link">{t.id}</Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
