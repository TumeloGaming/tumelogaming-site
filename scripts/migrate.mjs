#!/usr/bin/env node
// ── scripts/migrate.mjs ──────────────────────────────────────────
// One-time data migration script.
// Reads your existing content.json and creates all the corresponding
// Sanity documents so you don't have to re-enter any data manually.
//
// RUN ONCE: npm run migrate
// (After you've set up Sanity and added your env vars to .env)
//
// What it creates:
//   • siteSettings (singleton) — colours, fonts, contact, particles
//   • 1 project document per item in content.json#projects
//   • 1 page document with slug "/" containing all sections in order:
//       heroSection → positionsSection → projectsSection → serversSection → contactSection

import { createClient } from '@sanity/client';
import { readFileSync }  from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Sanity write client ──────────────────────────────────────────
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token:      process.env.SANITY_API_TOKEN,   // Needs write permission
  useCdn:    false,
});

// ── Read content.json ────────────────────────────────────────────
const contentPath = resolve(__dirname, '../content.json');
let data;
try {
  data = JSON.parse(readFileSync(contentPath, 'utf-8'));
  console.log('✅ Read content.json');
} catch (err) {
  console.error('❌ Could not read content.json:', err.message);
  console.error('   Make sure content.json exists in the project root.');
  process.exit(1);
}

// ── Helper: create or replace a Sanity document ──────────────────
async function upsert(doc) {
  // createOrReplace: if doc with this _id exists, replace it entirely.
  const result = await client.createOrReplace(doc);
  console.log(`  ✓ ${result._type} → ${result._id}`);
  return result;
}

// ════════════════════════════════════════════════════════════════
// 1. siteSettings (singleton)
// ════════════════════════════════════════════════════════════════
console.log('\n📋 Creating siteSettings...');
await upsert({
  _id:   'siteSettings',   // Fixed ID = singleton
  _type: 'siteSettings',
  siteTitle:   `${data.hero.name1}${data.hero.name2} — Gamer & Developer`,
  siteTagline: 'Gamer · Developer · Streamer',
  navLogo:     'TG',
  colors: {
    bg:        '#06060f',
    surface:   '#0e0e1c',
    border:    'rgba(255,255,255,0.08)',
    accent:    '#8b5cf6',
    accent2:   '#06b6d4',
    accent3:   '#f472b6',
    text:      '#e2e8f0',
    textMuted: '#64748b',
    textDim:   '#94a3b8',
  },
  fonts: {
    display: 'Orbitron',
    body:    'Syne',
    mono:    'JetBrains Mono',
  },
  ogTitle:       `${data.hero.name1}${data.hero.name2} — Gamer & Developer`,
  ogDescription: data.hero.tagline,
  contact: {
    discord:    data.contact?.discord    ?? '',
    discordUrl: data.contact?.discordUrl ?? '',
    email:      data.contact?.email      ?? '',
  },
  footerCredit: data.footer?.credit ?? 'MADE WITH LOVE ✦ 2025',
  particles: {
    count:              100,
    speed:              0.35,
    connectionDistance: 140,
    mouseRepelRadius:   180,
  },
});

// ════════════════════════════════════════════════════════════════
// 2. Project documents
// ════════════════════════════════════════════════════════════════
console.log('\n🚀 Creating project documents...');
const projectRefs = [];

for (const proj of (data.projects ?? [])) {
  // Generate a slug from the project title
  const slug = proj.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const doc = await upsert({
    _id:   `project-${proj.id}`,
    _type: 'project',
    title:            proj.title,
    slug:             { _type: 'slug', current: slug },
    description:      proj.description,
    thumbnailEmoji:   proj.pfpEmoji ?? '🛠️',
    platform:         proj.platform ?? 'web',
    externalLink:     proj.link,
    externalLinkText: proj.linkText,
    hasDetailPage:    false,   // Flip to true when you add a body in Studio
    featured:         false,
    // ogTitle and ogDescription default to title/description — no need to set
  });

  // Keep a reference for the projectsSection
  projectRefs.push({ _type: 'reference', _ref: doc._id, _key: proj.id });
}

// ════════════════════════════════════════════════════════════════
// 3. Homepage page document with all sections
// ════════════════════════════════════════════════════════════════
console.log('\n📄 Creating homepage page document...');

// Build positions array from content.json
const positions = (data.positions ?? []).map((p, i) => ({
  _type:       'object',
  _key:        p.id ?? `pos${i}`,
  visible:     true,
  icon:        p.icon,
  title:       p.title,
  subtitle:    p.subtitle,
  description: p.description,
  link:        p.link,
  linkText:    p.linkText,
  tag:         p.tag,
  tagColor:    p.tagColor,
}));

// Build servers array from content.json
const servers = (data.servers ?? []).map((s, i) => ({
  _type: 'object',
  _key:  `srv${i}`,
  name:  s.name,
  role:  s.role,
  color: s.color,
}));

// Build socials array
const socials = (data.hero.socials ?? []).map(s => ({
  _type:   'object',
  _key:    s.id,
  id:      s.id,
  label:   s.label,
  url:     s.url,
  enabled: s.enabled ?? true,
}));

await upsert({
  _id:   'homepage',
  _type: 'page',
  title: 'Homepage',
  slug:  { _type: 'slug', current: '/' },
  sections: [
    // ── Hero ────────────────────────────────────────────────
    {
      _type:    'heroSection',
      _key:     'hero',
      visible:  true,
      name1:    data.hero.name1,
      name2:    data.hero.name2,
      pronouns: data.hero.pronouns ?? 'he/him',
      tagline:  data.hero.tagline,
      skills:   data.hero.skills ?? [],
      stats: {
        servers:         data.hero.stats?.servers    ?? '17',
        experience:      data.hero.stats?.experience ?? '3+',
        serversLabel:    'MC Servers Staffed',
        experienceLabel: 'Years Experience',
      },
      socials,
    },

    // ── Positions ───────────────────────────────────────────
    {
      _type:          'positionsSection',
      _key:           'positions',
      visible:        true,
      sectionNumber:  '01',
      sectionTitle:   'Current Positions',
      sectionDesc:    "Where I'm actively working right now.",
      showOpenToRoles: true,
      positions,
    },

    // ── Projects ────────────────────────────────────────────
    {
      _type:        'projectsSection',
      _key:         'projects',
      visible:      true,
      sectionLabel: "// What I've Built",
      sectionTitle: 'My Projects',
      sectionDesc:  "Tools and apps I've shipped. More always in the works.",
      projects:     projectRefs,
    },

    // ── Servers ─────────────────────────────────────────────
    {
      _type:        'serversSection',
      _key:         'servers',
      visible:      true,
      sectionLabel: '// Minecraft Journey',
      sectionTitle: 'Server Experience',
      servers,
    },

    // ── Contact (uses global siteSettings) ──────────────────
    {
      _type:     'contactSection',
      _key:      'contact',
      visible:   true,
      useGlobal: true,
    },
  ],
});

console.log(`
╔══════════════════════════════════════════════════════╗
║  ✅  Migration complete!                             ║
║                                                      ║
║  Next steps:                                         ║
║  1. Open /studio and review the imported data        ║
║  2. Upload a favicon in ⚙️ Site Settings             ║
║  3. Add an OG image in ⚙️ Site Settings              ║
║  4. Run: npm run dev  to preview locally             ║
║  5. Push to GitHub → Netlify auto-deploys            ║
╚══════════════════════════════════════════════════════╝
`);
