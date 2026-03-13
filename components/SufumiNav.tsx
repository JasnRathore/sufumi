"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isToolInDev, TOOLS } from "@/lib/tools";

export function SufumiNav() {
    const pathname = usePathname();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

                .sfn-root {
                    position: sticky; top: 0; z-index: 50;
                    border-bottom: 1px solid rgba(238,235,228,.07);
                    background: rgba(4,4,4,.92);
                    backdrop-filter: blur(28px);
                    box-shadow: 0 1px 0 rgba(255,61,0,.07);
                    font-family: 'DM Mono', monospace;
                }
                .sfn-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 2rem; height: 58px;
                    display: flex; align-items: center; justify-content: space-between; gap: 2rem;
                }

                /* Logo */
                .sfn-logo {
                    display: flex; align-items: center; gap: .75rem;
                    text-decoration: none; flex-shrink: 0;
                }
                .sfn-mark {
                    width: 32px; height: 32px; border-radius: 6px;
                    border: 1px solid rgba(255,61,0,.28);
                    background: rgba(255,61,0,.07);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'DM Mono', monospace; font-size: 10px; color: #FF3D00;
                    letter-spacing: .04em;
                }
                .sfn-wordmark {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 1.4rem; letter-spacing: .06em;
                    color: #EEEBE4;
                }
                .sfn-badge {
                    font-family: 'DM Mono', monospace; font-size: 9px;
                    text-transform: uppercase; letter-spacing: .2em; color: #FF3D00;
                    border: 1px solid rgba(255,61,0,.22); background: rgba(255,61,0,.07);
                    padding: 2px 8px; border-radius: 2px;
                }

                /* Tool quick nav */
                .sfn-tools {
                    display: flex; align-items: center; gap: 2px;
                    flex: 1; justify-content: center;
                }
                .sfn-tool-link {
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .12em;
                    color: rgba(238,235,228,.3);
                    padding: 5px 10px; border-radius: 3px;
                    text-decoration: none;
                    border: 1px solid transparent;
                    transition: color .18s, background .18s, border-color .18s;
                    white-space: nowrap;
                }
                .sfn-tool-link:hover {
                    color: rgba(238,235,228,.72);
                    background: rgba(238,235,228,.04);
                }
                .sfn-tool-link.active {
                    border-color: rgba(255,255,255,.08);
                    background: rgba(255,255,255,.04);
                }
                .sfn-tool-badge {
                    margin-left: 6px;
                    font-size: .5rem;
                    letter-spacing: .16em;
                    text-transform: uppercase;
                    padding: 1px 5px;
                    border-radius: 2px;
                }

                /* Right */
                .sfn-right {
                    display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
                }
                .sfn-link {
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .14em;
                    color: rgba(238,235,228,.32); text-decoration: none;
                    transition: color .18s;
                }
                .sfn-link:hover { color: rgba(238,235,228,.75); }
                .sfn-gh {
                    display: flex; align-items: center; gap: .45rem;
                    font-family: 'DM Mono', monospace; font-size: .65rem;
                    text-transform: uppercase; letter-spacing: .1em;
                    color: rgba(238,235,228,.32); text-decoration: none;
                    border: 1px solid rgba(238,235,228,.1);
                    padding: 6px 14px; border-radius: 3px;
                    transition: color .18s, border-color .18s;
                }
                .sfn-gh:hover { color: rgba(238,235,228,.75); border-color: rgba(238,235,228,.22); }
                .sfn-gh svg { width: 13px; height: 13px; fill: currentColor; flex-shrink: 0; }
                .sfn-divider { width: 1px; height: 18px; background: rgba(238,235,228,.09); }

                @media (max-width: 900px) { .sfn-tools { display: none; } }
                @media (max-width: 640px) { .sfn-badge { display: none; } .sfn-link { display: none; } }
            `}</style>

            <header className="sfn-root">
                <div className="sfn-inner">
                    <Link href="/" className="sfn-logo">
                        <div className="sfn-mark">sf</div>
                        <span className="sfn-wordmark">Sufumi</span>
                        <span className="sfn-badge">Win</span>
                    </Link>

                    <nav className="sfn-tools">
                        {TOOLS.map((t) => {
                            const active = pathname.startsWith('/tools/' + t.slug);
                            return (
                                <Link
                                    key={t.slug}
                                    href={'/tools/' + t.slug}
                                    className={'sfn-tool-link' + (active ? ' active' : '')}
                                    style={active ? { color: t.accent, borderColor: t.accent + '28', background: t.accent + '0d' } : {}}
                                >
                                    {t.id}
                                    {isToolInDev(t) && (
                                        <span
                                            className="sfn-tool-badge"
                                            style={{
                                                color: t.accent,
                                                border: `1px solid ${t.accent}55`,
                                                background: `${t.accent}1a`,
                                            }}
                                        >
                                            Dev
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="sfn-right">
                        <Link href="/#tools" className="sfn-link">Tools</Link>
                        <div className="sfn-divider" />
                        <a href="https://github.com/JasnRathore" target="_blank" className="sfn-gh">
                            <svg viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            GitHub
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
}
