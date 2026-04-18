// ── schemas/documents/siteSettings.ts ───────────────────────────
// The SINGLETON document that controls global site config.
// There is only ever ONE of these (enforced via fixed documentId in Studio).
// Everything here — colors, fonts, OG defaults — affects the whole site.

import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name:  'siteSettings',
  title: '⚙️ Site Settings',
  type:  'document',

  groups: [
    { name: 'identity', title: '🪪 Identity'    },
    { name: 'theme',    title: '🎨 Theme'        },
    { name: 'seo',      title: '🔍 SEO & OG'    },
    { name: 'contact',  title: '📬 Contact'      },
    { name: 'canvas',   title: '✨ Particle FX'  },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────
    defineField({
      name: 'siteTitle', title: 'Site Title', type: 'string',
      group: 'identity',
      description: 'Appears in the browser tab and OG fallback.',
      initialValue: 'TumeloGaming — Gamer & Developer',
    }),
    defineField({
      name: 'siteTagline', title: 'Tagline', type: 'string',
      group: 'identity',
      initialValue: 'Gamer · Developer · Streamer',
    }),
    defineField({
      name: 'favicon', title: 'Favicon', type: 'image',
      group: 'identity',
      description: 'Recommended: 512×512 PNG. Sanity will serve it via CDN.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'navLogo', title: 'Nav Logo Text', type: 'string',
      group: 'identity',
      initialValue: 'TG',
      description: 'Short text shown in the navigation bar (e.g. "TG").',
    }),

    // ── Theme ─────────────────────────────────────────────────
    // These hex values are injected as CSS custom properties at build time.
    // Changing any color here triggers a full site rebuild on Netlify.
    defineField({
      name: 'colors', title: 'Colour Palette', type: 'object',
      group: 'theme',
      description: 'All values must be valid hex codes (e.g. #8b5cf6).',
      fields: [
        defineField({ name: 'bg',        title: 'Background',          type: 'string', initialValue: '#06060f' }),
        defineField({ name: 'surface',   title: 'Surface (cards)',     type: 'string', initialValue: '#0e0e1c' }),
        defineField({ name: 'border',    title: 'Border',              type: 'string', initialValue: 'rgba(255,255,255,0.08)' }),
        defineField({ name: 'accent',    title: 'Accent 1 (purple)',   type: 'string', initialValue: '#8b5cf6' }),
        defineField({ name: 'accent2',   title: 'Accent 2 (cyan)',     type: 'string', initialValue: '#06b6d4' }),
        defineField({ name: 'accent3',   title: 'Accent 3 (pink)',     type: 'string', initialValue: '#f472b6' }),
        defineField({ name: 'text',      title: 'Primary Text',        type: 'string', initialValue: '#e2e8f0' }),
        defineField({ name: 'textMuted', title: 'Muted Text',          type: 'string', initialValue: '#64748b' }),
        defineField({ name: 'textDim',   title: 'Dim Text',            type: 'string', initialValue: '#94a3b8' }),
      ],
    }),
    defineField({
      name: 'fonts', title: 'Google Fonts', type: 'object',
      group: 'theme',
      description: 'Exact font family names as they appear on fonts.google.com.',
      fields: [
        defineField({ name: 'display', title: 'Display Font',  type: 'string', initialValue: 'Orbitron'       }),
        defineField({ name: 'body',    title: 'Body Font',     type: 'string', initialValue: 'Syne'           }),
        defineField({ name: 'mono',    title: 'Monospace Font',type: 'string', initialValue: 'JetBrains Mono' }),
      ],
    }),

    // ── SEO / Open Graph ──────────────────────────────────────
    // These are the FALLBACK values when a specific page has no OG set.
    defineField({
      name: 'ogTitle', title: 'Default OG Title', type: 'string',
      group: 'seo',
      initialValue: 'TumeloGaming — Gamer & Developer',
    }),
    defineField({
      name: 'ogDescription', title: 'Default OG Description', type: 'text', rows: 3,
      group: 'seo',
      initialValue: '18-year-old gamer & developer who livestreams and builds Minecraft plugins, Discord bots, and web tools.',
    }),
    defineField({
      name: 'ogImage', title: 'Default OG Image', type: 'image',
      group: 'seo',
      description: 'Recommended: 1200×630 px. Shows when you paste the site link in Discord.',
      options: { hotspot: true },
    }),

    // ── Contact ───────────────────────────────────────────────
    defineField({
      name: 'contact', title: 'Contact Details', type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'discord',    title: 'Discord Handle',     type: 'string', initialValue: '@tumelogaming' }),
        defineField({ name: 'discordUrl', title: 'Discord Profile URL',type: 'url',    initialValue: 'https://discord.com/users/944246408247136297' }),
        defineField({ name: 'email',      title: 'Email Address',      type: 'string', initialValue: 'kgafaneMC@gmail.com' }),
      ],
    }),
    defineField({
      name: 'footerCredit', title: 'Footer Credit Text', type: 'string',
      group: 'contact',
      initialValue: 'MADE WITH LOVE ✦ 2025',
    }),

    // ── Particle Canvas FX ────────────────────────────────────
    defineField({
      name: 'particles', title: 'Star Particle Settings', type: 'object',
      group: 'canvas',
      fields: [
        defineField({ name: 'count',              title: 'Particle Count',                    type: 'number', initialValue: 100,  validation: r => r.min(20).max(300) }),
        defineField({ name: 'speed',              title: 'Speed (0.1–1.0)',                   type: 'number', initialValue: 0.35, validation: r => r.min(0.1).max(1)   }),
        defineField({ name: 'connectionDistance', title: 'Constellation Line Distance (px)',  type: 'number', initialValue: 140,  validation: r => r.min(50).max(300)  }),
        defineField({ name: 'mouseRepelRadius',   title: 'Mouse Repel Radius (px)',           type: 'number', initialValue: 180,  validation: r => r.min(0).max(400)   }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Global config — only one exists' };
    },
  },
});
