"use client";
// app/tools/[slug]/docs/page.tsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTool, isToolInDev, normalizeSlug, TOOLS, DocBlock } from "@/lib/tools";
import { SufumiNav } from "@/components/SufumiNav";

const GH_PATH = "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";

// ── Section nav ──────────────────────────────────────────────────────────────
// Single component used by sidebar (size="md") and right rail (size="sm").
// onSelect fires immediately on click so the active highlight snaps without
// waiting for the IntersectionObserver to catch up after scrolling.
function SectionNav({
    sections, activeSection, accent, size = "md", onSelect,
}: {
    sections: { id: string; title: string }[];
    activeSection: string;
    accent: string;
    size?: "sm" | "md";
    onSelect?: (id: string) => void;
}) {
    return (
        <nav>
            {sections.map((s) => {
                const active = activeSection === s.id;
                return (
                    <a
                        key={s.id}
                        href={`#${s.id}`}
                        onClick={() => onSelect?.(s.id)}
                        className={`snav-link snav-link--${size}${active ? " snav-link--active" : ""}`}
                        style={active ? { color: accent } : {}}
                    >
                        {active && <span className="snav-dot" style={{ background: accent }} />}
                        {s.title}
                    </a>
                );
            })}
        </nav>
    );
}

// ── Sidebar inner ─────────────────────────────────────────────────────────────
// Rendered once here, dropped into both the desktop aside and mobile drawer.
// No layout/position styles here — those live on the container.
function SidebarInner({
    tool, activeSection, accent, onSelect,
}: {
    tool: NonNullable<ReturnType<typeof getTool>>;
    activeSection: string;
    accent: string;
    onSelect?: (id: string) => void;
}) {
    return (
        <>
            <div className="doc-sidebar-head">
                <span className="doc-sidebar-id" style={{ color: accent, borderColor: `${accent}28`, background: `${accent}0d` }}>
                    {tool.id}
                </span>
                {isToolInDev(tool) && (
                    <span
                        className="doc-dev-badge doc-dev-badge--tiny"
                        style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}14` }}
                    >
                        Dev
                    </span>
                )}
                <span className="doc-sidebar-name">{tool.title}</span>
            </div>
            <div className="doc-sidebar-divider" />
            <span className="doc-sidebar-label">Sections</span>
            <SectionNav sections={tool.docs} activeSection={activeSection} accent={accent} size="md" onSelect={onSelect} />
            <div className="doc-sidebar-links">
                <a href={tool.github} target="_blank" className="doc-sidebar-ext">
                    <svg viewBox="0 0 16 16"><path d={GH_PATH} /></svg>GitHub
                </a>
                <Link href={`/tools/${tool.slug}`} className="doc-sidebar-ext">← Tool page</Link>
            </div>
        </>
    );
}

// ── Doc block renderer ───────────────────────────────────────────────────────
function DocBlockRenderer({ block, accent }: { block: DocBlock; accent: string }) {
    if (block.type === "p") return <p>{block.text}</p>;
    if (block.type === "h3") return <h3>{block.text}</h3>;

    if (block.type === "code")
        return (
            <div className="doc-code-wrap">
                <pre>
                    <div className="doc-code-chrome">
                        <span className="doc-chrome-dot" style={{ background: "#FF5F56" }} />
                        <span className="doc-chrome-dot" style={{ background: "#FFBD2E" }} />
                        <span className="doc-chrome-dot" style={{ background: "#27C93F" }} />
                        {block.lang && <span className="doc-code-lang">{block.lang}</span>}
                    </div>
                    <code>{block.code}</code>
                </pre>
            </div>
        );

    if (block.type === "ul")
        return (
            <ul className="doc-ul">
                {block.items.map((item, i) => (
                    <li key={i}>
                        <span className="doc-ul-dot" style={{ background: accent }} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        );

    if (block.type === "download")
        return (
            <div className="doc-download-wrap">
                <a
                    className="doc-download"
                    href={block.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ borderColor: accent, color: accent }}
                >
                    {block.label}
                </a>
                {block.file && <span className="doc-download-file">File: {block.file}</span>}
            </div>
        );

    if (block.type === "callout") {
        const v = {
            tip: { border: accent, bg: `${accent}0c`, label: "Tip", color: accent },
            warn: { border: "rgba(255,184,48,.6)", bg: "rgba(255,184,48,.06)", label: "Warning", color: "rgba(255,184,48,.85)" },
            info: { border: "rgba(100,180,255,.5)", bg: "rgba(100,180,255,.05)", label: "Info", color: "rgba(100,180,255,.8)" },
        }[block.kind];
        return (
            <div className="doc-callout" style={{ borderLeftColor: v.border, background: v.bg }}>
                <span className="doc-callout-label" style={{ color: v.color }}>{v.label}</span>
                <span className="doc-callout-text">{block.text}</span>
            </div>
        );
    }

    if (block.type === "table")
        return (
            <div className="doc-table-wrap">
                <table className="doc-table">
                    <thead>
                        <tr>{block.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {block.rows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci}
                                        className={ci === 0 ? "mono" : "prose-cell"}
                                        style={ci === 0 ? { color: accent } : {}}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

    return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DocsPage() {
    const params = useParams<{ slug?: string | string[] }>();
    const slug = normalizeSlug(params?.slug);
    const tool = getTool(slug);

    const [activeSection, setActiveSection] = useState<string>(() => tool?.docs[0]?.id ?? "");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (!tool) return;
        const observer = new IntersectionObserver(
            (entries) => {
                // Pick the topmost intersecting section
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActiveSection(visible[0].target.id);
            },
            { rootMargin: "-10% 0px -75% 0px", threshold: 0 }
        );
        tool.docs.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [tool]);

    if (!tool) return null;

    const { accent } = tool;
    const isDev = isToolInDev(tool);
    const idx = TOOLS.findIndex((t) => t.slug === slug);
    const prev = TOOLS[idx - 1];
    const next = TOOLS[idx + 1];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; }
                html { background: #040404; color: #EEEBE4; scroll-behavior: smooth; }
                body { background: #040404; margin: 0; overflow-x: hidden; }

                /* ── Atmosphere ── */
                .doc-grain {
                    pointer-events: none; position: fixed; inset: 0; z-index: 1; opacity: .04;
                    mix-blend-mode: overlay;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 300px;
                }
                .doc-grid-bg {
                    pointer-events: none; position: fixed; inset: 0; z-index: 0;
                    background-image: linear-gradient(rgba(238,235,228,.016) 1px, transparent 1px), linear-gradient(90deg, rgba(238,235,228,.016) 1px, transparent 1px);
                    background-size: 80px 80px;
                }
                .doc-scanlines {
                    pointer-events: none; position: fixed; inset: 0; z-index: 2;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.07) 2px, rgba(0,0,0,.07) 4px);
                    opacity: .35;
                }

                /* ── Layout ── */
                .doc-wrap { position: relative; z-index: 10; min-height: 100vh; }
                .doc-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
                .doc-layout { display: flex; gap: 3rem; align-items: flex-start; }

                /* ── Shared section-nav styles (sidebar + rail use the same classes) ── */
                .snav-link {
                    display: flex; align-items: center;
                    border-radius: 3px; text-decoration: none; cursor: pointer;
                    border: none; background: none; width: 100%; text-align: left;
                    font-family: 'DM Mono', monospace; text-transform: uppercase;
                    color: rgba(238,235,228,.3);
                    transition: color .15s, background .15s;
                }
                .snav-link:hover { color: rgba(238,235,228,.68); background: rgba(238,235,228,.04); }
                .snav-link--active { color: rgba(238,235,228,.88); }
                /* md = sidebar density */
                .snav-link--md { gap: .55rem; padding: .45rem .75rem; font-size: .65rem; letter-spacing: .1em; }
                .snav-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }

                /* ── Left sidebar ── */
                .doc-sidebar {
                    width: 196px; flex-shrink: 0;
                    position: sticky; top: 78px;
                    max-height: calc(100vh - 90px);
                    overflow-y: auto; padding: 2rem 0 4rem;
                    display: flex; flex-direction: column;
                }
                .doc-sidebar::-webkit-scrollbar { width: 0; }
                @media (max-width: 1024px) { .doc-sidebar { display: none; } }

                .doc-sidebar-head {
                    display: flex; align-items: center; gap: .6rem;
                    padding: .6rem .75rem; margin-bottom: .5rem;
                }
                .doc-sidebar-id {
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    padding: 2px 8px; border-radius: 2px; border: 1px solid;
                }
                .doc-sidebar-name {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .82rem; color: rgba(238,235,228,.45);
                }
                .doc-dev-badge {
                    display: inline-flex; align-items: center; justify-content: center;
                    font-family: 'DM Mono', monospace; font-size: .5rem;
                    text-transform: uppercase; letter-spacing: .16em;
                    padding: 2px 6px; border-radius: 2px; line-height: 1;
                }
                .doc-dev-badge--tiny {
                    font-size: .46rem; letter-spacing: .12em; padding: 1px 5px;
                }
                .doc-sidebar-label {
                    font-family: 'DM Mono', monospace; font-size: .56rem;
                    text-transform: uppercase; letter-spacing: .28em;
                    color: rgba(238,235,228,.2); padding: 0 .75rem; margin-bottom: .5rem; display: block;
                }
                .doc-sidebar-divider { height: 1px; background: rgba(238,235,228,.07); margin: .75rem 0; }
                /* links footer at the bottom of the sidebar */
                .doc-sidebar-links {
                    margin-top: auto; padding-top: 1.5rem;
                    border-top: 1px solid rgba(238,235,228,.06);
                }
                .doc-sidebar-ext {
                    display: flex; align-items: center; gap: .5rem;
                    padding: .4rem .75rem; border-radius: 3px;
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: rgba(238,235,228,.25); text-decoration: none;
                    transition: color .15s;
                }
                .doc-sidebar-ext:hover { color: rgba(238,235,228,.65); }
                .doc-sidebar-ext svg { width: 11px; height: 11px; fill: currentColor; flex-shrink: 0; }

                /* ── Main ── */
                .doc-main { flex: 1; min-width: 0; padding: 2.5rem 0 8rem; }

                .doc-breadcrumb {
                    display: flex; align-items: center; gap: .5rem; margin-bottom: 2rem;
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .16em;
                    color: rgba(238,235,228,.22);
                }
                .doc-breadcrumb a { color: inherit; text-decoration: none; transition: color .15s; }
                .doc-breadcrumb a:hover { color: rgba(238,235,228,.6); }
                .doc-breadcrumb-sep { opacity: .4; }

                .doc-title-block { margin-bottom: 2.5rem; }
                .doc-title-meta { display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem; }
                .doc-title-id {
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .2em;
                    padding: 3px 10px; border-radius: 2px; border: 1px solid;
                }
                .doc-title-lang {
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    color: rgba(238,235,228,.22);
                }
                .doc-title-h1 {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: clamp(2.8rem, 5vw, 4.2rem);
                    letter-spacing: .02em; line-height: .92; color: #EEEBE4; margin-bottom: .75rem;
                }
                .doc-title-h1 span {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .65em; color: rgba(238,235,228,.25); font-weight: 400;
                }
                .doc-title-tagline {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: 1rem; line-height: 1.7; color: rgba(238,235,228,.4);
                }

                .doc-rule { height: 1px; background: rgba(238,235,228,.07); margin: 2rem 0; }

                /* ── Doc sections ── */
                .doc-section { scroll-margin-top: 5.5rem; padding-top: .5rem; }
                .doc-section + .doc-section { margin-top: 4rem; }
                .doc-section-header {
                    display: flex; align-items: center; gap: .75rem; margin-bottom: 1.75rem;
                }
                .doc-section-num {
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .2em;
                    color: rgba(238,235,228,.18); flex-shrink: 0;
                }
                .doc-section-rule { flex: 1; height: 1px; }
                .doc-section-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.65rem; letter-spacing: .04em; color: #EEEBE4; flex-shrink: 0;
                }

                /* ── Prose ── */
                .doc-prose p {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .96rem; line-height: 1.95; color: rgba(238,235,228,.5); margin-bottom: 1rem;
                }
                .doc-prose h3 {
                    font-family: 'DM Mono', monospace; font-size: .75rem;
                    text-transform: uppercase; letter-spacing: .18em;
                    color: rgba(238,235,228,.72); margin: 1.75rem 0 .6rem;
                }
                .doc-code-wrap { position: relative; margin-bottom: 1.25rem; }
                .doc-code-chrome {
                    display: flex; align-items: center; gap: 6px; padding: 10px 14px;
                    border-bottom: 1px solid rgba(238,235,228,.06);
                    background: rgba(238,235,228,.012);
                }
                .doc-chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
                .doc-code-lang {
                    margin-left: auto; font-family: 'DM Mono', monospace; font-size: .55rem;
                    text-transform: uppercase; letter-spacing: .22em; color: rgba(238,235,228,.2);
                }
                pre {
                    background: #080808 !important; border: 1px solid rgba(238,235,228,.08);
                    border-radius: 6px; overflow: hidden; margin-bottom: 0;
                }
                pre code {
                    display: block; padding: 1.25rem 1.5rem; overflow-x: auto;
                    font-family: 'DM Mono', monospace; font-size: .78rem; line-height: 1.85;
                    color: rgba(238,235,228,.7);
                }
                pre::-webkit-scrollbar { height: 4px; }
                pre::-webkit-scrollbar-track { background: transparent; }
                pre::-webkit-scrollbar-thumb { background: rgba(238,235,228,.1); border-radius: 99px; }

                .doc-ul { list-style: none; padding: 0; margin-bottom: 1.25rem; }
                .doc-ul li {
                    display: flex; align-items: flex-start; gap: .85rem; padding: .55rem 0;
                    border-bottom: 1px solid rgba(238,235,228,.05);
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .9rem; line-height: 1.7; color: rgba(238,235,228,.48);
                }
                .doc-ul li:first-child { border-top: 1px solid rgba(238,235,228,.05); }
                .doc-ul-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; margin-top: .65rem; }

                .doc-download-wrap {
                    display: flex; align-items: center; flex-wrap: wrap; gap: .7rem;
                    margin-bottom: 1.25rem;
                }
                .doc-download {
                    display: inline-flex; align-items: center; justify-content: center;
                    padding: .62rem 1.25rem; border: 1px solid; border-radius: 999px;
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .18em; text-decoration: none;
                    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
                    box-shadow: 0 10px 24px rgba(0,0,0,.2);
                    transition: transform .15s ease, background .15s ease, box-shadow .15s ease, border-color .15s ease;
                }
                .doc-download:hover {
                    transform: translateY(-1px);
                    background: rgba(255,255,255,.05);
                    box-shadow: 0 14px 28px rgba(0,0,0,.28);
                }
                .doc-download-file {
                    display: inline-flex; align-items: center; gap: .35rem;
                    padding: .4rem .75rem; border-radius: 999px;
                    border: 1px solid rgba(238,235,228,.12);
                    background: rgba(255,255,255,.03);
                    font-family: 'DM Mono', monospace; font-size: .58rem;
                    letter-spacing: .06em;
                    color: rgba(238,235,228,.55);
                }

                .doc-callout { margin-bottom: 1.25rem; padding: 1.1rem 1.4rem; border-left: 3px solid; border-radius: 0 4px 4px 0; }
                .doc-callout-label {
                    font-family: 'DM Mono', monospace; font-size: .62rem;
                    text-transform: uppercase; letter-spacing: .16em; display: block; margin-bottom: .4rem;
                }
                .doc-callout-text {
                    font-family: 'Instrument Serif', serif; font-style: italic;
                    font-size: .88rem; line-height: 1.8; color: rgba(238,235,228,.52);
                }

                .doc-table-wrap { margin-bottom: 1.5rem; overflow-x: auto; border: 1px solid rgba(238,235,228,.08); border-radius: 6px; }
                .doc-table { width: 100%; border-collapse: collapse; }
                .doc-table thead tr { border-bottom: 1px solid rgba(238,235,228,.07); background: rgba(238,235,228,.02); }
                .doc-table th {
                    padding: .75rem 1rem; text-align: left;
                    font-family: 'DM Mono', monospace; font-size: .58rem;
                    text-transform: uppercase; letter-spacing: .22em; color: rgba(238,235,228,.28);
                }
                .doc-table td { padding: .7rem 1rem; border-bottom: 1px solid rgba(238,235,228,.05); font-size: .8rem; }
                .doc-table tr:last-child td { border-bottom: none; }
                .doc-table tr:hover td { background: rgba(238,235,228,.018); }
                .doc-table td.mono { font-family: 'DM Mono', monospace; font-size: .72rem; }
                .doc-table td.prose-cell { font-family: 'Instrument Serif', serif; font-style: italic; color: rgba(238,235,228,.48); }

                /* ── Prev / Next ── */
                .doc-nav-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
                    background: rgba(238,235,228,.07); border-radius: 6px; overflow: hidden; margin-top: 4rem;
                }
                .doc-nav-card {
                    background: #060606; padding: 1.5rem 1.75rem;
                    text-decoration: none; transition: background .2s;
                    display: flex; flex-direction: column; gap: .4rem;
                }
                .doc-nav-card:hover { background: #0D0D0D; }
                .doc-nav-card.right { text-align: right; }
                .doc-nav-dir {
                    font-family: 'DM Mono', monospace; font-size: .58rem;
                    text-transform: uppercase; letter-spacing: .22em; color: rgba(238,235,228,.22);
                }
                .doc-nav-title {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.2rem; letter-spacing: .04em; color: rgba(238,235,228,.72);
                }

                /* ── Edit bar ── */
                .doc-edit-bar {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-top: 1.5rem; padding: 1rem 1.5rem;
                    border: 1px solid rgba(238,235,228,.06); border-radius: 4px;
                    background: rgba(238,235,228,.015);
                }
                .doc-edit-text { font-family: 'Instrument Serif', serif; font-style: italic; font-size: .82rem; color: rgba(238,235,228,.28); }
                .doc-edit-link {
                    display: flex; align-items: center; gap: .5rem;
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .14em;
                    color: rgba(238,235,228,.3); text-decoration: none; transition: color .15s;
                }
                .doc-edit-link:hover { color: rgba(238,235,228,.7); }
                .doc-edit-link svg { width: 13px; height: 13px; fill: currentColor; }

                /* ── Footer ── */
                .doc-footer { border-top: 1px solid rgba(238,235,228,.07); box-shadow: 0 -1px 0 rgba(255,61,0,.06); position: relative; z-index: 10; }
                .doc-footer-inner {
                    max-width: 1280px; margin: 0 auto; padding: 1.5rem 2rem;
                    display: flex; align-items: center; justify-content: space-between;
                    font-family: 'DM Mono', monospace; font-size: .6rem;
                    text-transform: uppercase; letter-spacing: .12em; color: rgba(238,235,228,.2);
                }
                .doc-footer-inner a { color: inherit; text-decoration: none; transition: color .15s; }
                .doc-footer-inner a:hover { color: rgba(238,235,228,.6); }

                /* ── Mobile sidebar ── */
                .doc-mob-sidebar {
                    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
                    width: 280px; background: #060606; border-right: 1px solid rgba(238,235,228,.07);
                    transform: translateX(-100%); transition: transform .25s ease;
                    overflow-y: auto; padding: 80px 1rem 2rem;
                    display: flex; flex-direction: column;
                }
                .doc-mob-sidebar.open { transform: translateX(0); }
                .doc-mob-overlay { position: fixed; inset: 0; z-index: 99; background: rgba(0,0,0,.7); backdrop-filter: blur(4px); }
                .doc-mob-btn {
                    display: none;
                    align-items: center; gap: .6rem; margin-bottom: 1.5rem;
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .14em; color: rgba(238,235,228,.4);
                    border: 1px solid rgba(238,235,228,.1); background: rgba(238,235,228,.03);
                    padding: 8px 16px; border-radius: 3px; cursor: pointer; transition: color .15s, border-color .15s;
                }
                .doc-mob-btn:hover { color: rgba(238,235,228,.7); border-color: rgba(238,235,228,.2); }
                @media (max-width: 1024px) { .doc-mob-btn { display: flex; } }

                @keyframes docFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .doc-fade { animation: docFadeUp .55s ease both; }
            `}</style>

            <div className="doc-grain" />
            <div className="doc-grid-bg" />
            <div className="doc-scanlines" />
            <div style={{
                pointerEvents: "none", position: "fixed",
                top: "-20vh", left: "-10vw", width: "70vw", height: "70vh",
                borderRadius: "50%", background: `radial-gradient(circle, ${accent}09 0%, transparent 68%)`, zIndex: 0,
            }} />

            <div className="doc-wrap">
                <SufumiNav />

                {/* Mobile overlay + drawer */}
                {sidebarOpen && <div className="doc-mob-overlay" onClick={() => setSidebarOpen(false)} />}
                <aside className={`doc-mob-sidebar${sidebarOpen ? " open" : ""}`}>
                    <SidebarInner
                        tool={tool}
                        activeSection={activeSection}
                        accent={accent}
                        onSelect={(id) => { setActiveSection(id); setSidebarOpen(false); }}
                    />
                </aside>

                <div className="doc-container">
                    <div className="doc-layout">

                        {/* ── Desktop sidebar ── */}
                        <aside className="doc-sidebar">
                            <SidebarInner
                                tool={tool}
                                activeSection={activeSection}
                                accent={accent}
                                onSelect={(id) => setActiveSection(id)}
                            />
                        </aside>

                        {/* ── Main content ── */}
                        <main className="doc-main">
                            <button className="doc-mob-btn" onClick={() => setSidebarOpen(true)}>
                                <span>≡</span><span>Sections</span>
                            </button>

                            <div className="doc-breadcrumb doc-fade">
                                <Link href="/">sufumi</Link>
                                <span className="doc-breadcrumb-sep">/</span>
                                <Link href={`/tools/${tool.slug}`}>{tool.id}</Link>
                                <span className="doc-breadcrumb-sep">/</span>
                                <span style={{ color: accent }}>docs</span>
                            </div>

                            <div className="doc-title-block doc-fade" style={{ animationDelay: ".05s" }}>
                                <div className="doc-title-meta">
                                    <span className="doc-title-id" style={{ color: accent, borderColor: `${accent}30`, background: `${accent}0e` }}>{tool.id}</span>
                                    {isDev && (
                                        <span
                                            className="doc-dev-badge"
                                            style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}14` }}
                                        >
                                            In dev
                                        </span>
                                    )}
                                    <span className="doc-title-lang">{tool.lang}</span>
                                </div>
                                <h1 className="doc-title-h1">{tool.title} <span>/ docs</span></h1>
                                <p className="doc-title-tagline">{tool.tagline}</p>
                            </div>

                            <div className="doc-rule" />

                            <div>
                                {tool.docs.map((section, si) => (
                                    <section
                                        key={section.id}
                                        id={section.id}
                                        className="doc-section doc-fade"
                                        style={{ animationDelay: `${0.08 + si * 0.04}s` }}
                                        ref={(el) => { sectionRefs.current[section.id] = el; }}
                                    >
                                        <div className="doc-section-header">
                                            <span className="doc-section-num">{String(si + 1).padStart(2, "0")}</span>
                                            <div className="doc-section-rule" style={{ background: `${accent}22` }} />
                                            <h2 className="doc-section-title">{section.title}</h2>
                                            <div style={{ width: "2rem", height: "1px", background: `${accent}22`, flexShrink: 0 }} />
                                        </div>
                                        <div className="doc-prose">
                                            {section.content.map((block, bi) => (
                                                <DocBlockRenderer key={bi} block={block} accent={accent} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>

                            <div className="doc-nav-grid">
                                {prev ? (
                                    <Link href={`/tools/${prev.slug}/docs`} className="doc-nav-card">
                                        <span className="doc-nav-dir">← prev</span>
                                        <span className="doc-nav-title">{prev.title}</span>
                                        {isToolInDev(prev) && (
                                            <span
                                                className="doc-dev-badge doc-dev-badge--tiny"
                                                style={{ color: prev.accent, border: `1px solid ${prev.accent}55`, background: `${prev.accent}14` }}
                                            >
                                                Dev
                                            </span>
                                        )}
                                    </Link>
                                ) : <div style={{ background: "#060606" }} />}
                                {next ? (
                                    <Link href={`/tools/${next.slug}/docs`} className="doc-nav-card right">
                                        <span className="doc-nav-dir">next →</span>
                                        <span className="doc-nav-title">{next.title}</span>
                                        {isToolInDev(next) && (
                                            <span
                                                className="doc-dev-badge doc-dev-badge--tiny"
                                                style={{ color: next.accent, border: `1px solid ${next.accent}55`, background: `${next.accent}14` }}
                                            >
                                                Dev
                                            </span>
                                        )}
                                    </Link>
                                ) : <div style={{ background: "#060606" }} />}
                            </div>

                            <div className="doc-edit-bar">
                                <span className="doc-edit-text">Found an error? Docs are open source.</span>
                                <a href={tool.github} target="_blank" className="doc-edit-link">
                                    <svg viewBox="0 0 16 16"><path d={GH_PATH} /></svg>
                                    Edit on GitHub
                                </a>
                            </div>
                        </main>

                    </div>
                </div>

                <footer className="doc-footer">
                    <div className="doc-footer-inner">
                        <span><span style={{ color: accent }}>{tool.id}</span> · docs · sufumi · MIT</span>
                        <Link href="/">← sufumi home</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
