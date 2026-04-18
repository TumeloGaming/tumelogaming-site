// ── astro.config.mjs ────────────────────────────────────────────
// Main Astro configuration file.
// - output: 'hybrid' means pages are STATIC by default (fast, CDN-cached)
//   but individual pages can opt into SSR by exporting `prerender = false`.
// - The Netlify adapter handles both static asset serving and SSR functions.
// - The Sanity integration embeds the Studio at /studio and wires up the client.

import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sanity from '@sanity/astro';

export default defineConfig({
  // ── Rendering mode ──────────────────────────────────────────
  // 'hybrid' = static by default, individual pages can go SSR.
  output: 'hybrid',

  // ── Netlify adapter ─────────────────────────────────────────
  // Handles serverless functions for SSR pages and API routes.
  adapter: netlify(),

  // ── Integrations ────────────────────────────────────────────
  integrations: [
    sanity({
      // These come from .env / Netlify environment variables.
      // PUBLIC_ prefix makes them available in browser-side code too.
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset:   import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',

      // useCdn: false → always fetch fresh data (no stale CDN cache).
      // For a portfolio with infrequent updates this is fine.
      // Switch to true if you see slow build times.
      useCdn: false,

      // The Studio is embedded at /studio on YOUR domain.
      // Netlify will serve it as part of the same site.
      studioBasePath: '/studio',

      // Only enable visual editing in development or on preview deploys.
      // The SANITY_PREVIEW_SECRET env var gates access.
      // Full live-preview setup: see SETUP.md § Live Preview.
    }),
  ],
});
