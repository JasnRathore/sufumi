// components/SufumiTheme.tsx
// Shared CSS foundation for all Sufumi pages
export const SUFUMI_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');`;

export const SUFUMI_BASE_CSS = `
  ${SUFUMI_FONTS}
  *, *::before, *::after { box-sizing: border-box; }
  html { background: #040404; color: #EEEBE4; scroll-behavior: smooth; cursor: none; }
  body { background: #040404; margin: 0; overflow-x: hidden; }
`;

export const SUFUMI_ATMOSPHERE_CSS = `
  .sf-grain {
    pointer-events: none; position: fixed; inset: 0; z-index: 1;
    opacity: 0.04; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 300px;
  }
  .sf-scanlines {
    pointer-events: none; position: fixed; inset: 0; z-index: 2;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.07) 2px, rgba(0,0,0,.07) 4px);
    opacity: 0.35;
  }
  .sf-grid-bg {
    pointer-events: none; position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(238,235,228,.016) 1px, transparent 1px),
      linear-gradient(90deg, rgba(238,235,228,.016) 1px, transparent 1px);
    background-size: 80px 80px;
  }
`;

// Shared cursor component
export const SUFUMI_CURSOR_CSS = `
  .sf-cursor-dot {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: #FF3D00; transform: translate(-50%, -50%);
    transition: width .2s, height .2s;
  }
  .sf-cursor-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid rgba(255,61,0,.4);
    transform: translate(-50%, -50%);
  }
`;