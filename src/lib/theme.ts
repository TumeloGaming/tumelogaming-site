// ── src/lib/theme.ts ─────────────────────────────────────────────
// Converts the `colors` and `fonts` objects from the siteSettings
// Sanity document into a CSS :root { } block that is injected into
// every page's <head> by Base.astro.
//
// This is how changing a hex code in the CMS re-themes the whole site
// without touching any code — the CSS variables propagate everywhere.

import type { SiteSettings } from './sanity';

/**
 * Builds a Google Fonts @import URL for the three configured fonts.
 * Astro injects this into the <head> as a <link> tag.
 */
export function buildFontUrl(fonts: SiteSettings['fonts']): string {
  // Each font needs to be URL-encoded and weight variants appended.
  const families = [
    `family=${encodeURIComponent(fonts.display)}:wght@400;700;900`,
    `family=${encodeURIComponent(fonts.body)}:wght@400;600;700`,
    `family=${encodeURIComponent(fonts.mono)}:wght@400;500`,
  ].join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Converts the `colors` object into a CSS :root block string.
 * Injected as an inline <style> tag in Base.astro so it loads instantly.
 *
 * Usage in Astro:  <style set:html={buildCssVars(settings.colors, settings.fonts)} />
 */
export function buildCssVars(
  colors: SiteSettings['colors'],
  fonts:  SiteSettings['fonts'],
): string {
  return `
    :root {
      /* ── Colours (set from Sanity CMS) ───────────────── */
      --bg:         ${colors.bg         ?? '#06060f'};
      --surface:    ${colors.surface    ?? '#0e0e1c'}18;  /* 18 = ~10% opacity hex */
      --surface2:   ${colors.surface    ?? '#0e0e1c'}28;
      --border:     ${colors.border     ?? 'rgba(255,255,255,0.08)'};
      --accent:     ${colors.accent     ?? '#8b5cf6'};
      --accent2:    ${colors.accent2    ?? '#06b6d4'};
      --accent3:    ${colors.accent3    ?? '#f472b6'};
      --text:       ${colors.text       ?? '#e2e8f0'};
      --text-muted: ${colors.textMuted  ?? '#64748b'};
      --text-dim:   ${colors.textDim    ?? '#94a3b8'};

      /* ── Fonts (set from Sanity CMS) ─────────────────── */
      --font-display: '${fonts.display  ?? 'Orbitron'}', monospace;
      --font-body:    '${fonts.body     ?? 'Syne'}', sans-serif;
      --font-mono:    '${fonts.mono     ?? 'JetBrains Mono'}', monospace;

      /* ── Layout constants (not CMS-controlled) ────────── */
      --sidebar-w: 260px;
      --section-pad: 64px;
    }
  `.trim();
}

/**
 * Builds the complete set of <meta> OG/Twitter tags for a page.
 * Priority:  page-level override  >  global siteSettings fallback
 *
 * @param settings  Global siteSettings document
 * @param pageTitle Override title (from page.seoTitle)
 * @param pageDesc  Override description (from page.seoDescription)
 * @param pageImage Override image (from page.seoImage)
 * @param pageUrl   Canonical URL for this page
 * @param imageUrlFn  The imageUrl() helper from sanity.ts
 */
export function buildOgMeta(opts: {
  settings:   SiteSettings;
  pageTitle?:  string | null;
  pageDesc?:   string | null;
  pageImage?:  any;
  pageUrl:     string;
  imageUrlFn:  (src: any, w: number, h: number) => string;
}) {
  const { settings, pageTitle, pageDesc, pageImage, pageUrl, imageUrlFn } = opts;

  const title = pageTitle || settings.ogTitle || settings.siteTitle;
  const desc   = pageDesc  || settings.ogDescription;

  // Resolve image: page-level first, then global, then empty string
  const rawImg = pageImage ?? settings.ogImage;
  const imgUrl  = rawImg ? imageUrlFn(rawImg, 1200, 630) : '';

  return { title, desc, imgUrl };
}
