// ── src/lib/sanity.ts ────────────────────────────────────────────
// Single source of truth for ALL data fetching from Sanity.
// The client is configured here, and every GROQ query the site
// needs is exported as a typed async function.
//
// GROQ = "Graph-Relational Object Queries" — Sanity's query language.
// Think of it like SQL but for JSON documents.

import { createClient } from '@sanity/client';
import imageUrlBuilder  from '@sanity/image-url';

// ── Sanity client ────────────────────────────────────────────────
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset:   import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',   // Pin the API version — never changes under you
  useCdn:    false,           // Always fresh data on every Netlify build
});

// ── Image URL builder ────────────────────────────────────────────
// Sanity stores images as references, not URLs. This builder converts
// them to real URLs with optional transformations (resize, crop, format).
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// ── Helper: image URL with dimensions ───────────────────────────
// Returns a WebP URL at the specified dimensions, falling back to
// the emoji string if no image is set.
export function imageUrl(source: any, width = 800, height?: number): string {
  if (!source?.asset?._ref) return '';
  let img = builder.image(source).width(width).format('webp').auto('format');
  if (height) img = img.height(height);
  return img.url();
}

// ── Type definitions ─────────────────────────────────────────────
// These mirror the Sanity schema shapes so TypeScript can help you
// catch typos and missing fields throughout the codebase.

export interface SiteSettings {
  siteTitle:    string;
  siteTagline:  string;
  navLogo:      string;
  favicon?:     any;
  colors: {
    bg: string; surface: string; border: string;
    accent: string; accent2: string; accent3: string;
    text: string; textMuted: string; textDim: string;
  };
  fonts: { display: string; body: string; mono: string; };
  ogTitle:       string;
  ogDescription: string;
  ogImage?:      any;
  contact: {
    discord: string; discordUrl: string; email: string;
  };
  footerCredit: string;
  particles: {
    count: number; speed: number;
    connectionDistance: number; mouseRepelRadius: number;
  };
}

export interface PageData {
  title:          string;
  slug:           string;
  seoTitle?:      string;
  seoDescription?:string;
  seoImage?:      any;
  sections:       Section[];
}

export type Section =
  | HeroSection
  | PositionsSection
  | ProjectsSection
  | ServersSection
  | ContactSection
  | RichTextSection;

export interface HeroSection {
  _type: 'heroSection'; visible: boolean;
  name1: string; name2: string; pronouns: string; tagline: string;
  skills: string[];
  stats: { servers: string; experience: string; serversLabel: string; experienceLabel: string; };
  socials: { id: string; label: string; url: string; enabled: boolean; }[];
}

export interface PositionsSection {
  _type: 'positionsSection'; visible: boolean;
  sectionNumber: string; sectionTitle: string; sectionDesc: string;
  showOpenToRoles: boolean;
  positions: {
    _key: string; visible: boolean; icon: string; title: string;
    subtitle: string; description: string;
    link: string; linkText: string; tag: string; tagColor: string;
  }[];
}

export interface ProjectsSection {
  _type: 'projectsSection'; visible: boolean;
  sectionLabel: string; sectionTitle: string; sectionDesc: string;
  projects: ProjectCard[];
}

export interface ProjectCard {
  _id: string; title: string; slug: string;
  description: string; thumbnail?: any; thumbnailEmoji?: string;
  platform: string; externalLink: string; externalLinkText: string;
  hasDetailPage: boolean; featured: boolean;
}

export interface ServersSection {
  _type: 'serversSection'; visible: boolean;
  sectionLabel: string; sectionTitle: string;
  servers: { _key: string; name: string; role: string; color: string; }[];
}

export interface ContactSection {
  _type: 'contactSection'; visible: boolean;
  useGlobal: boolean; discord?: string; discordUrl?: string; email?: string;
}

export interface RichTextSection {
  _type: 'richTextSection'; visible: boolean;
  sectionTitle?: string; content: any[];
}

export interface ProjectDetail {
  _id: string; title: string; slug: string;
  description: string; thumbnail?: any; thumbnailEmoji?: string;
  platform: string; externalLink: string; externalLinkText: string;
  hasDetailPage: boolean; body?: any[];
  ogTitle?: string; ogDescription?: string; ogImage?: any;
}

// ── GROQ Queries ─────────────────────────────────────────────────

// ── Site Settings ──────────────────────────────────────────────
// Fetches the singleton siteSettings document.
// Called on every page via the Base layout.
export async function getSiteSettings(): Promise<SiteSettings> {
  return sanityClient.fetch(/* groq */`
    *[_type == "siteSettings"][0] {
      siteTitle, siteTagline, navLogo, favicon,
      colors, fonts,
      ogTitle, ogDescription, ogImage,
      contact, footerCredit, particles
    }
  `);
}

// ── Page by Slug ───────────────────────────────────────────────
// Fetches a single page document and ALL its nested section data.
// The -> operator follows references (e.g. projects[] -> {...} resolves
// the project reference to its full document data).
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  return sanityClient.fetch(/* groq */`
    *[_type == "page" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      seoTitle, seoDescription, seoImage,
      sections[] {
        _type,

        // ── heroSection fields ──────────────────────────────
        _type == "heroSection" => {
          visible, name1, name2, pronouns, tagline, skills, stats,
          socials[] { id, label, url, enabled }
        },

        // ── positionsSection fields ─────────────────────────
        _type == "positionsSection" => {
          visible, sectionNumber, sectionTitle, sectionDesc, showOpenToRoles,
          positions[] { _key, visible, icon, title, subtitle, description, link, linkText, tag, tagColor }
        },

        // ── projectsSection — dereferences project docs ─────
        _type == "projectsSection" => {
          visible, sectionLabel, sectionTitle, sectionDesc,
          projects[]-> {
            _id, title, "slug": slug.current,
            description, thumbnail, thumbnailEmoji,
            platform, externalLink, externalLinkText,
            hasDetailPage, featured
          }
        },

        // ── serversSection fields ───────────────────────────
        _type == "serversSection" => {
          visible, sectionLabel, sectionTitle,
          servers[] { _key, name, role, color }
        },

        // ── contactSection fields ───────────────────────────
        _type == "contactSection" => {
          visible, useGlobal, discord, discordUrl, email
        },

        // ── richTextSection fields ──────────────────────────
        _type == "richTextSection" => {
          visible, sectionTitle, content
        },
      }
    }
  `, { slug });
}

// ── All Page Slugs ─────────────────────────────────────────────
// Used by Astro's getStaticPaths() to generate all page routes.
export async function getAllPageSlugs(): Promise<string[]> {
  const pages = await sanityClient.fetch<{ slug: string }[]>(/* groq */`
    *[_type == "page"] { "slug": slug.current }
  `);
  return pages.map(p => p.slug);
}

// ── Project by Slug ────────────────────────────────────────────
// Full project detail — used on /projects/[slug] pages.
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  return sanityClient.fetch(/* groq */`
    *[_type == "project" && slug.current == $slug][0] {
      _id, title, "slug": slug.current,
      description, thumbnail, thumbnailEmoji,
      platform, externalLink, externalLinkText,
      hasDetailPage, body,
      ogTitle, ogDescription, ogImage
    }
  `, { slug });
}

// ── All Project Slugs ──────────────────────────────────────────
// Used by getStaticPaths() on the /projects/[slug] route.
export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await sanityClient.fetch<{ slug: string }[]>(/* groq */`
    *[_type == "project" && hasDetailPage == true] { "slug": slug.current }
  `);
  return projects.map(p => p.slug);
}
