"use client";
// app/tools/[slug]/page.tsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTool, normalizeSlug, TOOLS } from "@/lib/tools";
import { SufumiNav } from "@/components/SufumiNav";

/* ─────────────────────────────────────────────────────────────────
   Cursor (shared across all Sufumi pages — same as homepage)
───────────────────────────────────────────────────────────────── */
function Cursor() {
    const dot = useRef<HTMLDivElement>(null);
    const ring = useRef<HTMLDivElement>(null);
    const [big, setBig] = useState(false);
    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
            if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
        };
        const over = (e: MouseEvent) => setBig(!!(e.target as HTMLElement).closest("a,button"));
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseover", over);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
    }, []);
    return (
        <>
            <div ref={dot} style={{
                position: "fixed", pointerEvents: "none", zIndex: 9999,
                width: big ? 0 : 8, height: big ? 0 : 8, borderRadius: "50%",
                background: "#FF3D00", transform: "translate(-50%,-50%)",
                transition: "width .2s, height .2s",
            }} />
            <div ref={ring} style={{
                position: "fixed", pointerEvents: "none", zIndex: 9998,
                width: big ? 48 : 32, height: big ? 48 : 32, borderRadius: "50%",
                border: "1px solid rgba(255,61,0,.4)", transform: "translate(-50%,-50%)",
                transition: "width .35s cubic-bezier(.17,.67,.35,1.2), height .35s cubic-bezier(.17,.67,.35,1.2)",
            }} />
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Scroll-reveal hook (shared with homepage)
───────────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.08) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return { ref, visible };
}

/* ─────────────────────────────────────────────────────────────────
   Animated install command (tool-specific terminal snippet)
───────────────────────────────────────────────────────────────── */
function InstallBlock({ toolId, accent }: { toolId: string; accent: string }) {
    const cmd = `jpm install ${toolId.toLowerCase()}`;
    const [typed, setTyped] = useState("");
    const [done, setDone] = useState(false);
    const { ref, visible } = useReveal(0.3);

    useEffect(() => {
        if (!visible || done) return;
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setTyped(cmd.slice(0, i));
            if (i >= cmd.length) { clearInterval(iv); setDone(true); }
        }, 42);
        return () => clearInterval(iv);
    }, [visible, done, cmd]);

    return (
        <div ref={ref} className="tp-install">
            <div className="tp-install__chrome">
                <span className="tp-chrome-dot" style={{ background: "#FF5F56" }} />
                <span className="tp-chrome-dot" style={{ background: "#FFBD2E" }} />
                <span className="tp-chrome-dot" style={{ background: "#27C93F" }} />
                <span className="tp-chrome-label">windows powershell</span>
            </div>
            <div className="tp-install__body">
                <span className="tp-install__prompt" style={{ color: accent }}>PS &gt;</span>
                <span className="tp-install__cmd">{typed}</span>
                {!done && <span className="tp-install__cursor" style={{ background: `${accent}88` }} />}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────── */
export default function ToolPage() {
    const params = useParams<{ slug?: string | string[] }>();
    const slug = normalizeSlug(params?.slug);
    const tool = getTool(slug);

    const { ref: descRef, visible: descVis } = useReveal();
    const { ref: hlRef, visible: hlVis } = useReveal();
    const { ref: ctaRef, visible: ctaVis } = useReveal();

    if (!tool) return null;

    const { accent } = tool;
    const idx = TOOLS.findIndex((t) => t.slug === slug);
    const prev = TOOLS[idx - 1];
    const next = TOOLS[idx + 1];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; }
                html { background: #040404; color: #EEEBE4; scroll-behavior: smooth; cursor: none; }
                body { background: #040404; margin: 0; overflow-x: hidden; }

                /* ── Atmosphere (shared with homepage) ── */
                .sf-grain {
                    pointer-events: none; position: fixed; inset: 0; z-index: 1; opacity: .04;
                    mix-blend-mode: overlay;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 300px;
                }
                .sf-scanlines {
                    pointer-events: none; position: fixed; inset: 0; z-index: 2;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.07) 2px, rgba(0,0,0,.07) 4px);
                    opacity: .35;
                }
                .sf-grid-bg {
                    pointer-events: none; position: fixed; inset: 0; z-index: 0;
                    background-image: linear-gradient(rgba(238,235,228,.016) 1px, transparent 1px), linear-gradient(90deg, rgba(238,235,228,.016) 1px, transparent 1px);
                    background-size: 80px 80px;
                }

                /* ── Layout ── */
                .tp-wrap { position: relative; z-index: 10; min-height: 100vh; }
                .tp-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

                /* ── Breadcrumb ── */
                .tp-breadcrumb {
                    display: flex; align-items: center; gap: .5rem;
                    padding: 1.5rem 0 0;
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    color: rgba(238,235,228,.2);
                }
                .tp-breadcrumb a { color: inherit; text-decoration: none; transition: color .15s; }
                .tp-breadcrumb a:hover { color: rgba(238,235,228,.6); }
                .tp-breadcrumb-sep { opacity: .35; }

                /* ══════════════════════════════════════════
                   HERO — full-bleed, accent-tinted, dramatic
                ═══════════════════════════════════════════ */
                .tp-hero {
                    position: relative; overflow: hidden;
                    border-bottom: 1px solid rgba(238,235,228,.07);
                    min-height: 88vh;
                    display: flex; flex-direction: column; justify-content: flex-end;
                }
                /* giant ghost tool ID watermark */
                .tp-hero__ghost {
                    position: absolute; right: -1rem; bottom: -2rem;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(18rem, 38vw, 34rem);
                    line-height: .85; letter-spacing: -.02em;
                    color: transparent; pointer-events: none; user-select: none; z-index: 0;
                    -webkit-text-stroke: 1px rgba(238,235,228,.04);
                }
                /* accent color environment glow */
                .tp-hero__glow {
                    position: absolute; top: -30%; left: -10%; width: 90vw; height: 90vh;
                    border-radius: 50%; pointer-events: none; z-index: 0;
                }
                /* diagonal accent slash */
                .tp-hero__slash {
                    position: absolute; top: 0; right: 0; width: 50%; height: 100%;
                    pointer-events: none; z-index: 0;
                    clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
                }
                .tp-hero__inner {
                    position: relative; z-index: 10;
                    max-width: 1280px; margin: 0 auto; padding: 0 2rem 5rem;
                    display: grid; grid-template-columns: 1fr auto;
                    align-items: flex-end; gap: 4rem;
                }
                @media (max-width: 900px) {
                    .tp-hero__inner { grid-template-columns: 1fr; gap: 2.5rem; padding-bottom: 3.5rem; }
                }

                /* left — title stack */
                .tp-hero__eyebrow {
                    display: inline-flex; align-items: center; gap: .6rem;
                    margin-bottom: 1.5rem;
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .22em;
                    color: rgba(238,235,228,.3);
                }
                .tp-hero__eyebrow-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    animation: sfpulse 2s ease infinite;
                }
                @keyframes sfpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

                .tp-hero__id {
                    display: block;
                    font-family: 'DM Mono', monospace; font-size: .68rem;
                    text-transform: uppercase; letter-spacing: .26em;
                    margin-bottom: .85rem;
                }
                .tp-hero__title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(4.5rem, 10vw, 9rem);
                    line-height: .88; letter-spacing: .01em; color: #EEEBE4;
                    margin-bottom: 1.5rem;
                }
                .tp-hero__tagline {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: clamp(1.15rem, 2.2vw, 1.55rem); line-height: 1.55;
                    color: rgba(238,235,228,.52); max-width: 520px; margin-bottom: 2.5rem;
                }
                .tp-hero__actions {
                    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
                }
                .tp-hero__btn-primary {
                    display: inline-flex; align-items: center; gap: .5rem;
                    font-family: 'DM Mono', monospace; font-size: .72rem; font-weight: 500;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: #040404; padding: 13px 26px; border-radius: 4px;
                    text-decoration: none; transition: box-shadow .2s, transform .15s;
                }
                .tp-hero__btn-primary:hover { transform: translateY(-1px); }
                .tp-hero__btn-ghost {
                    display: inline-flex; align-items: center; gap: .5rem;
                    font-family: 'DM Mono', monospace; font-size: .72rem;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: rgba(238,235,228,.4); border: 1px solid rgba(238,235,228,.12);
                    padding: 12px 24px; border-radius: 4px; text-decoration: none;
                    transition: color .2s, border-color .2s;
                }
                .tp-hero__btn-ghost:hover { color: rgba(238,235,228,.82); border-color: rgba(238,235,228,.24); }

                /* right — meta panel */
                .tp-hero__meta {
                    display: flex; flex-direction: column; gap: 1px;
                    background: rgba(238,235,228,.06); border: 1px solid rgba(238,235,228,.07);
                    border-radius: 6px; overflow: hidden;
                    min-width: 200px;
                }
                .tp-hero__meta-row {
                    background: #060606; padding: .9rem 1.2rem;
                    display: flex; flex-direction: column; gap: .3rem;
                }
                .tp-hero__meta-key {
                    font-family: 'DM Mono', monospace; font-size: .56rem;
                    text-transform: uppercase; letter-spacing: .24em;
                    color: rgba(238,235,228,.22);
                }
                .tp-hero__meta-val {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .9rem; color: rgba(238,235,228,.7);
                }
                .tp-hero__meta-val.mono {
                    font-family: 'DM Mono', monospace; font-style: normal;
                    font-size: .72rem; letter-spacing: .04em;
                }
                .tp-hero__chips {
                    display: flex; flex-wrap: wrap; gap: .35rem; padding: .85rem 1.2rem;
                    background: #060606; border-top: 1px solid rgba(238,235,228,.06);
                }
                .tp-hero__chip {
                    font-family: 'DM Mono', monospace; font-size: .56rem;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: rgba(238,235,228,.3); border: 1px solid rgba(238,235,228,.08);
                    padding: 3px 9px; border-radius: 2px;
                }

                /* ── Section shared ── */
                .tp-section { max-width: 1280px; margin: 0 auto; padding: 6rem 2rem; }
                .tp-section-label {
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .28em;
                    color: rgba(238,235,228,.22); margin-bottom: 1rem; display: block;
                }

                /* ══════════════════════════════════════════
                   DESCRIPTION — editorial spread
                ═══════════════════════════════════════════ */
                .tp-desc {
                    border-top: 1px solid rgba(238,235,228,.07);
                    border-bottom: 1px solid rgba(238,235,228,.07);
                    position: relative; overflow: hidden;
                }
                .tp-desc__inner {
                    max-width: 1280px; margin: 0 auto; padding: 6rem 2rem;
                    display: grid; grid-template-columns: 5fr 6fr; gap: 6rem; align-items: center;
                }
                @media (max-width: 860px) { .tp-desc__inner { grid-template-columns: 1fr; gap: 3rem; } }
                /* large left number */
                .tp-desc__num {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(6rem, 14vw, 12rem);
                    line-height: .85; color: transparent;
                    -webkit-text-stroke: 1px rgba(238,235,228,.06);
                    letter-spacing: -.02em; pointer-events: none;
                    margin-bottom: 1.5rem; display: block;
                }
                .tp-desc__quote {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.35;
                    color: rgba(238,235,228,.78); margin-bottom: 2rem;
                }
                .tp-desc__quote strong { font-style: normal; color: #EEEBE4; font-weight: 400; }
                .tp-desc__body {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: 1rem; line-height: 1.9; color: rgba(238,235,228,.42);
                    max-width: 520px;
                }

                /* ══════════════════════════════════════════
                   HIGHLIGHTS — numbered feature list
                ═══════════════════════════════════════════ */
                .tp-hl-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1px;
                    background: rgba(238,235,228,.06);
                    border: 1px solid rgba(238,235,228,.07);
                    border-radius: 8px; overflow: hidden;
                    margin-top: 2.5rem;
                }
                .tp-hl-item {
                    background: #060606; padding: 2.5rem 2rem;
                    position: relative; overflow: hidden;
                    transition: background .25s;
                }
                .tp-hl-item:hover { background: #0D0D0D; }
                /* left accent bar */
                .tp-hl-item::before {
                    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
                    width: 2px; transform: scaleY(0); transform-origin: top;
                    transition: transform .35s cubic-bezier(.17,.67,.35,1);
                }
                .tp-hl-item:hover::before { transform: scaleY(1); }
                .tp-hl-num {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 3.5rem; line-height: .9; letter-spacing: .02em;
                    color: transparent; display: block; margin-bottom: 1rem;
                    -webkit-text-stroke: 1px rgba(238,235,228,.08);
                }
                .tp-hl-icon {
                    font-size: 1.4rem; display: block; margin-bottom: .85rem;
                    filter: grayscale(0.3);
                }
                .tp-hl-label {
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    margin-bottom: .5rem; display: block;
                }
                .tp-hl-text {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .9rem; line-height: 1.8; color: rgba(238,235,228,.4);
                }

                /* ══════════════════════════════════════════
                   QUICK START — install block + docs link
                ═══════════════════════════════════════════ */
                .tp-qs {
                    border-top: 1px solid rgba(238,235,228,.07);
                    background: rgba(238,235,228,.01);
                    position: relative; overflow: hidden;
                }
                /* big decorative text */
                .tp-qs__bg {
                    position: absolute; bottom: -2rem; right: -1rem;
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(6rem, 16vw, 14rem);
                    line-height: .85; letter-spacing: -.02em;
                    color: transparent; pointer-events: none;
                    -webkit-text-stroke: 1px rgba(238,235,228,.03);
                }
                .tp-qs__inner {
                    max-width: 1280px; margin: 0 auto; padding: 6rem 2rem;
                    display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;
                    position: relative; z-index: 1;
                }
                @media (max-width: 860px) { .tp-qs__inner { grid-template-columns: 1fr; gap: 3rem; } }
                .tp-qs__headline {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    line-height: .9; letter-spacing: .02em; color: #EEEBE4;
                    margin-bottom: .75rem;
                }
                .tp-qs__headline em {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .75em; color: rgba(238,235,228,.32); display: block;
                    font-weight: 400;
                }
                .tp-qs__sub {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .9rem; line-height: 1.85; color: rgba(238,235,228,.35);
                    margin-top: 1rem; max-width: 360px;
                }
                .tp-qs__links { display: flex; gap: .85rem; align-items: center; margin-top: 2rem; flex-wrap: wrap; }
                .tp-qs__link-docs {
                    font-family: 'DM Mono', monospace; font-size: .68rem;
                    text-transform: uppercase; letter-spacing: .12em;
                    color: #040404; padding: 11px 22px; border-radius: 4px;
                    text-decoration: none; transition: box-shadow .2s, transform .15s;
                }
                .tp-qs__link-docs:hover { transform: translateY(-1px); }
                .tp-qs__link-gh {
                    display: flex; align-items: center; gap: .5rem;
                    font-family: 'DM Mono', monospace; font-size: .68rem;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: rgba(238,235,228,.38); border: 1px solid rgba(238,235,228,.12);
                    padding: 10px 20px; border-radius: 4px; text-decoration: none;
                    transition: color .2s, border-color .2s;
                }
                .tp-qs__link-gh:hover { color: rgba(238,235,228,.78); border-color: rgba(238,235,228,.24); }
                .tp-qs__link-gh svg { width: 13px; height: 13px; fill: currentColor; }

                /* install terminal */
                .tp-install {
                    background: #080808; border: 1px solid rgba(238,235,228,.08);
                    border-radius: 8px; overflow: hidden;
                    box-shadow: 0 40px 80px rgba(0,0,0,.5);
                }
                .tp-install__chrome {
                    display: flex; align-items: center; gap: 6px; padding: 11px 14px;
                    border-bottom: 1px solid rgba(238,235,228,.06);
                    background: rgba(238,235,228,.012);
                }
                .tp-chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
                .tp-chrome-label {
                    margin-left: auto; font-family: 'DM Mono', monospace;
                    font-size: .58rem; text-transform: uppercase; letter-spacing: .18em;
                    color: rgba(238,235,228,.16);
                }
                .tp-install__body {
                    padding: 1.25rem 1.5rem;
                    display: flex; align-items: center; gap: .75rem;
                    font-family: 'DM Mono', monospace; font-size: .82rem; line-height: 1.6;
                }
                .tp-install__prompt { flex-shrink: 0; font-weight: 500; }
                .tp-install__cmd { color: rgba(238,235,228,.78); }
                .tp-install__cursor {
                    display: inline-block; width: 8px; height: 16px;
                    animation: sfblink 1s step-end infinite;
                }
                @keyframes sfblink { 50% { opacity: 0; } }

                /* ══════════════════════════════════════════
                   PREV / NEXT navigation
                ═══════════════════════════════════════════ */
                .tp-nav { border-top: 1px solid rgba(238,235,228,.07); }
                .tp-nav__inner {
                    max-width: 1280px; margin: 0 auto;
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
                    background: rgba(238,235,228,.06);
                }
                .tp-nav-card {
                    background: #060606; padding: 2.5rem 2rem;
                    text-decoration: none; transition: background .2s;
                    display: flex; flex-direction: column; gap: .4rem;
                    position: relative; overflow: hidden;
                }
                .tp-nav-card:hover { background: #0C0C0C; }
                .tp-nav-card__dir {
                    font-family: 'DM Mono', monospace; font-size: .58rem;
                    text-transform: uppercase; letter-spacing: .24em;
                    color: rgba(238,235,228,.2);
                }
                .tp-nav-card__id {
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    margin-top: .25rem;
                }
                .tp-nav-card__title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.8rem; letter-spacing: .03em; line-height: .9;
                    color: rgba(238,235,228,.62);
                }
                .tp-nav-card__tagline {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .82rem; color: rgba(238,235,228,.28);
                    margin-top: .3rem;
                }
                /* accent glow in corner */
                .tp-nav-card__glow {
                    position: absolute; bottom: -2rem; right: -2rem;
                    width: 8rem; height: 8rem; border-radius: 50%;
                    opacity: 0; transition: opacity .35s;
                    pointer-events: none;
                }
                .tp-nav-card:hover .tp-nav-card__glow { opacity: 1; }
                .tp-nav-card.right { text-align: right; }

                /* ── Footer ── */
                .tp-footer {
                    border-top: 1px solid rgba(238,235,228,.07);
                    box-shadow: 0 -1px 0 rgba(255,61,0,.06);
                    position: relative; z-index: 10;
                }
                .tp-footer__inner {
                    max-width: 1280px; margin: 0 auto; padding: 1.5rem 2rem;
                    display: flex; align-items: center; justify-content: space-between;
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .12em;
                    color: rgba(238,235,228,.2); flex-wrap: wrap; gap: 1rem;
                }
                .tp-footer__inner a { color: inherit; text-decoration: none; transition: color .15s; }
                .tp-footer__inner a:hover { color: rgba(238,235,228,.6); }

                /* ── Animations ── */
                @keyframes tpFadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .tp-fu  { animation: tpFadeUp .7s ease both; }
                .tp-fu2 { animation: tpFadeUp .7s .1s ease both; }
                .tp-fu3 { animation: tpFadeUp .7s .2s ease both; }
                .tp-fu4 { animation: tpFadeUp .7s .32s ease both; }
            `}</style>

            {/* Atmosphere */}
            <div className="sf-grain" />
            <div className="sf-scanlines" />
            <div className="sf-grid-bg" />
            <Cursor />

            <div className="tp-wrap">
                <SufumiNav />

                {/* ════════ HERO ════════ */}
                <section className="tp-hero">
                    {/* accent environment */}
                    <div className="tp-hero__glow" style={{
                        background: `radial-gradient(ellipse, ${accent}12 0%, transparent 65%)`,
                    }} />
                    {/* right-side tinted slash */}
                    <div className="tp-hero__slash" style={{
                        background: `linear-gradient(135deg, transparent 20%, ${accent}05 100%)`,
                    }} />
                    {/* giant ghost ID */}
                    <span className="tp-hero__ghost" aria-hidden>{tool.id}</span>

                    {/* breadcrumb inside hero */}
                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 10 }}>
                        <div className="tp-breadcrumb tp-fu">
                            <Link href="/">sufumi</Link>
                            <span className="tp-breadcrumb-sep">/</span>
                            <Link href="/#tools">tools</Link>
                            <span className="tp-breadcrumb-sep">/</span>
                            <span style={{ color: accent }}>{tool.id.toLowerCase()}</span>
                        </div>
                    </div>

                    <div className="tp-hero__inner">
                        {/* Left — title */}
                        <div>
                            <div className="tp-hero__eyebrow tp-fu">
                                <span className="tp-hero__eyebrow-dot" style={{ background: accent }} />
                                {tool.lang} · {tool.badge ?? "open source"}
                            </div>
                            <span className="tp-hero__id tp-fu" style={{ color: accent }}>
                                {tool.id}
                            </span>
                            <h1 className="tp-hero__title tp-fu2">{tool.title}</h1>
                            <p className="tp-hero__tagline tp-fu3">{tool.tagline}</p>
                            <div className="tp-hero__actions tp-fu4">
                                <Link
                                    href={`/tools/${tool.slug}/docs`}
                                    className="tp-hero__btn-primary"
                                    style={{
                                        background: accent,
                                        boxShadow: `0 0 0 1px ${accent}66, 0 0 32px ${accent}22`,
                                    }}
                                >
                                    Read docs →
                                </Link>
                                <a
                                    href={tool.github}
                                    target="_blank"
                                    className="tp-hero__btn-ghost"
                                >
                                    <svg viewBox="0 0 16 16" style={{ width: 13, height: 13, fill: "currentColor" }}>
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    GitHub
                                </a>
                            </div>
                        </div>

                        {/* Right — meta panel */}
                        <div
                            className="tp-fu3"
                            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                        >
                            <div className="tp-hero__meta">
                                <div className="tp-hero__meta-row" style={{ gap: ".2rem" }}>
                                    <span className="tp-hero__meta-key">Tool</span>
                                    <span className="tp-hero__meta-val mono" style={{ color: accent }}>{tool.id}</span>
                                </div>
                                <div className="tp-hero__meta-row">
                                    <span className="tp-hero__meta-key">Language</span>
                                    <span className="tp-hero__meta-val">{tool.lang}</span>
                                </div>
                                <div className="tp-hero__meta-row">
                                    <span className="tp-hero__meta-key">License</span>
                                    <span className="tp-hero__meta-val">MIT</span>
                                </div>
                                <div className="tp-hero__meta-row">
                                    <span className="tp-hero__meta-key">Status</span>
                                    <span className="tp-hero__meta-val mono" style={{ color: accent }}>{tool.badge ?? "active"}</span>
                                </div>
                                <div className="tp-hero__chips">
                                    {tool.chips.map((c) => (
                                        <span key={c} className="tp-hero__chip">{c}</span>
                                    ))}
                                </div>
                            </div>
                            {/* index in suite */}
                            <div style={{
                                fontFamily: "'DM Mono', monospace", fontSize: ".58rem",
                                textTransform: "uppercase", letterSpacing: ".22em",
                                color: "rgba(238,235,228,.18)", textAlign: "center",
                            }}>
                                {String(idx + 1).padStart(2, "0")} / {String(TOOLS.length).padStart(2, "0")} tools
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════ DESCRIPTION ════════ */}
                <div
                    className="tp-desc"
                    ref={descRef}
                    style={{
                        opacity: descVis ? 1 : 0,
                        transform: descVis ? "none" : "translateY(28px)",
                        transition: "opacity .85s ease, transform .85s ease",
                    }}
                >
                    <div className="tp-desc__inner">
                        <div>
                            <span className="tp-section-label">// 01 — What it is</span>
                            <span className="tp-desc__num" aria-hidden>01</span>
                            <blockquote className="tp-desc__quote">
                                {tool.tagline.includes("—")
                                    ? <>
                                        {tool.tagline.split("—")[0]}—{" "}
                                        <strong>{tool.tagline.split("—")[1].trim()}</strong>
                                    </>
                                    : <strong>{tool.tagline}</strong>
                                }
                            </blockquote>
                        </div>
                        <div>
                            <p className="tp-desc__body">{tool.description}</p>
                            <div style={{
                                marginTop: "2rem", paddingTop: "1.5rem",
                                borderTop: `1px solid ${accent}20`,
                                display: "flex", gap: "2.5rem", flexWrap: "wrap",
                            }}>
                                {[
                                    { val: String(tool.highlights.length), label: "Key features" },
                                    { val: tool.lang.split("·")[0].trim(), label: "Language" },
                                    { val: "MIT", label: "License" },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <span style={{
                                            display: "block",
                                            fontFamily: "'Bebas Neue', sans-serif",
                                            fontSize: "2rem", letterSpacing: ".03em",
                                            color: accent, lineHeight: 1,
                                        }}>{s.val}</span>
                                        <span style={{
                                            display: "block", marginTop: ".2rem",
                                            fontFamily: "'DM Mono', monospace", fontSize: ".56rem",
                                            textTransform: "uppercase", letterSpacing: ".2em",
                                            color: "rgba(238,235,228,.28)",
                                        }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════════ HIGHLIGHTS ════════ */}
                <div
                    className="tp-section"
                    ref={hlRef}
                    style={{
                        opacity: hlVis ? 1 : 0,
                        transform: hlVis ? "none" : "translateY(28px)",
                        transition: "opacity .85s ease, transform .85s ease",
                    }}
                >
                    <span className="tp-section-label">// 02 — Why it's different</span>
                    <h2 style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                        letterSpacing: ".02em", lineHeight: ".92",
                        color: "#EEEBE4", marginBottom: ".4rem",
                    }}>
                        What it does
                    </h2>
                    <p style={{
                        fontFamily: "'Instrument Serif', serif", fontStyle: "italic",
                        fontSize: ".92rem", color: "rgba(238,235,228,.35)",
                        marginBottom: "0",
                    }}>brutally well.</p>

                    <div className="tp-hl-grid">
                        {tool.highlights.map((h, i) => (
                            <div key={h.label} className="tp-hl-item"
                                style={{ "--accent": accent } as React.CSSProperties}>
                                {/* left accent bar (via CSS ::before, colored via style) */}
                                <style>{`.tp-hl-item:hover::before { background: ${accent}; }`}</style>
                                <span className="tp-hl-num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                                <span className="tp-hl-icon">{h.icon}</span>
                                <span className="tp-hl-label" style={{ color: accent }}>{h.label}</span>
                                <p className="tp-hl-text">{h.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════ QUICK START ════════ */}
                <div
                    className="tp-qs"
                    ref={ctaRef}
                    style={{
                        opacity: ctaVis ? 1 : 0,
                        transform: ctaVis ? "none" : "translateY(28px)",
                        transition: "opacity .85s ease, transform .85s ease",
                    }}
                >
                    <span className="tp-qs__bg" aria-hidden>START</span>
                    <div className="tp-qs__inner">
                        <div>
                            <span className="tp-section-label">// 03 — Get it</span>
                            <h2 className="tp-qs__headline">
                                Install<br />
                                {tool.id}.
                                <em>One command.</em>
                            </h2>
                            <p className="tp-qs__sub">
                                Use JPM — the package manager for the whole suite.
                                Or clone from GitHub and build from source.
                            </p>
                            <div className="tp-qs__links">
                                <Link
                                    href={`/tools/${tool.slug}/docs`}
                                    className="tp-qs__link-docs"
                                    style={{
                                        background: accent,
                                        boxShadow: `0 0 0 1px ${accent}55, 0 0 28px ${accent}1a`,
                                    }}
                                >
                                    Full docs →
                                </Link>
                                <a href={tool.github} target="_blank" className="tp-qs__link-gh">
                                    <svg viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                    Source
                                </a>
                            </div>
                        </div>
                        <InstallBlock toolId={tool.id} accent={accent} />
                    </div>
                </div>

                {/* ════════ PREV / NEXT ════════ */}
                <nav className="tp-nav">
                    <div className="tp-nav__inner">
                        {prev ? (
                            <Link href={`/tools/${prev.slug}`} className="tp-nav-card">
                                <div className="tp-nav-card__glow" style={{ background: `radial-gradient(circle, ${prev.accent}30, transparent 70%)` }} />
                                <span className="tp-nav-card__dir">← previous</span>
                                <span className="tp-nav-card__id" style={{ color: prev.accent }}>{prev.id}</span>
                                <span className="tp-nav-card__title">{prev.title}</span>
                                <span className="tp-nav-card__tagline">{prev.tagline}</span>
                            </Link>
                        ) : <div style={{ background: "#060606" }} />}
                        {next ? (
                            <Link href={`/tools/${next.slug}`} className="tp-nav-card right">
                                <div className="tp-nav-card__glow" style={{ background: `radial-gradient(circle, ${next.accent}30, transparent 70%)` }} />
                                <span className="tp-nav-card__dir">next →</span>
                                <span className="tp-nav-card__id" style={{ color: next.accent }}>{next.id}</span>
                                <span className="tp-nav-card__title">{next.title}</span>
                                <span className="tp-nav-card__tagline">{next.tagline}</span>
                            </Link>
                        ) : <div style={{ background: "#060606" }} />}
                    </div>
                </nav>

                {/* ════════ FOOTER ════════ */}
                <footer className="tp-footer">
                    <div className="tp-footer__inner">
                        <span>
                            <span style={{ color: accent }}>{tool.id.toLowerCase()}</span>
                            {" "}· sufumi · MIT · {new Date().getFullYear()}
                        </span>
                        <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                            <Link href="/">Home</Link>
                            <Link href={`/tools/${tool.slug}/docs`}>Docs</Link>
                            <a href={tool.github} target="_blank">GitHub</a>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}