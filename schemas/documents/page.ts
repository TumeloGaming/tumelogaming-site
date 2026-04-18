// ── schemas/documents/page.ts ────────────────────────────────────
// The PAGE document is where the page-builder magic lives.
// A page has a slug (e.g. "/" for the homepage), per-page SEO/OG fields,
// and an ORDERED ARRAY of section blocks. You can drag to reorder them,
// toggle visibility on any section, or add/remove sections freely.

import { defineField, defineType } from 'sanity';

export const page = defineType({
  name:  'page',
  title: '📄 Page',
  type:  'document',

  groups: [
    { name: 'content', title: '📐 Page Builder', default: true },
    { name: 'seo',     title: '🔍 SEO & OG'                   },
  ],

  fields: [
    // ── Identity ──────────────────────────────────────────────
    defineField({
      name: 'title', title: 'Page Title', type: 'string',
      description: 'Internal label only — shown in the Studio sidebar.',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug', title: 'URL Slug', type: 'slug',
      description: 'Use "/" for the homepage. Use "/about" for an about page, etc.',
      options: { source: 'title' },
      validation: r => r.required(),
    }),

    // ── SEO / Open Graph (per-page overrides) ─────────────────
    // These OVERRIDE the global defaults set in siteSettings.
    // Leave blank to fall back to the global defaults.
    defineField({
      name: 'seoTitle', title: 'SEO / OG Title', type: 'string',
      group: 'seo',
      description: 'Overrides the global OG title for this page only.',
    }),
    defineField({
      name: 'seoDescription', title: 'SEO / OG Description', type: 'text', rows: 3,
      group: 'seo',
      description: 'Overrides the global OG description for this page only.',
    }),
    defineField({
      name: 'seoImage', title: 'OG Thumbnail Image', type: 'image',
      group: 'seo',
      description: 'Overrides the global OG image. Shown when you share this page link in Discord.',
      options: { hotspot: true },
    }),

    // ── Page Builder ──────────────────────────────────────────
    // This is the main drag-and-drop section array.
    // Each item is one of the section object types.
    // In the Studio, you can:
    //   • Click "Add item" and choose a section type
    //   • Drag the ⠿ handle to reorder sections
    //   • Click a section to expand and edit its fields
    //   • Toggle the "Visible" switch to hide/show any section
    defineField({
      name: 'sections',
      title: 'Page Sections',
      group: 'content',
      type: 'array',
      description: 'Drag to reorder. Toggle "Visible" to hide/show any section.',
      of: [
        { type: 'heroSection'      },
        { type: 'positionsSection' },
        { type: 'projectsSection'  },
        { type: 'serversSection'   },
        { type: 'contactSection'   },
        { type: 'richTextSection'  },
      ],
      // Show a useful preview in the collapsed section list
      options: {
        // Enable drag-and-drop reordering
        sortable: true,
      },
    }),
  ],

  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title:    title || 'Untitled Page',
        subtitle: slug  || 'No slug set',
      };
    },
  },
});
