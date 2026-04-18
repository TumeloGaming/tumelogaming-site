// ── schemas/documents/project.ts ────────────────────────────────
// Each project gets its own Sanity document AND its own URL at
// /projects/[slug]. This enables:
//   • A full rich-text detail page per project
//   • Per-project OG metadata (so Discord shows a custom embed
//     when you paste a project link — title, description, thumbnail)
//   • The project card in projectsSection links to this page

import { defineField, defineType } from 'sanity';

export const project = defineType({
  name:  'project',
  title: '🚀 Project',
  type:  'document',

  groups: [
    { name: 'card',    title: '🃏 Card Info',    default: true },
    { name: 'detail',  title: '📝 Detail Page'               },
    { name: 'seo',     title: '🔍 SEO & OG'                  },
  ],

  fields: [
    // ── Card info (shown in the projects grid) ────────────────
    defineField({
      name: 'title', title: 'Project Title', type: 'string',
      group: 'card',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug', title: 'URL Slug', type: 'slug',
      group: 'card',
      description: 'Auto-generated from the title. Creates /projects/[slug].',
      options: { source: 'title' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'description', title: 'Short Description', type: 'text', rows: 3,
      group: 'card',
      description: 'Shown on the project card in the grid.',
    }),
    defineField({
      name: 'thumbnail', title: 'Project Icon / Thumbnail', type: 'image',
      group: 'card',
      description: 'Square image (≥ 256×256). Used as the project card icon.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'thumbnailEmoji', title: 'Fallback Emoji Icon', type: 'string',
      group: 'card',
      description: 'Shown if no thumbnail image is uploaded (e.g. "🔐").',
    }),
    defineField({
      name: 'platform', title: 'Platform', type: 'string',
      group: 'card',
      options: {
        list: [
          { title: 'Web',     value: 'web'     },
          { title: 'Discord', value: 'discord' },
          { title: 'GitHub',  value: 'github'  },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Twitch',  value: 'twitch'  },
          { title: 'Minecraft',value: 'mc'     },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'externalLink', title: 'External Link URL', type: 'url',
      group: 'card',
      description: 'E.g. https://ineedapassword.netlify.app/',
    }),
    defineField({
      name: 'externalLinkText', title: 'External Link Label', type: 'string',
      group: 'card',
      description: 'E.g. "Try it out" or "Invite the bot".',
    }),
    defineField({
      name: 'hasDetailPage', title: 'Has Detail Page?', type: 'boolean',
      group: 'card',
      description: 'If true, the card links to /projects/[slug]. If false, it links to the external URL only.',
      initialValue: false,
    }),
    defineField({
      name: 'featured', title: 'Featured?', type: 'boolean',
      group: 'card',
      description: 'Featured projects appear first in the grid.',
      initialValue: false,
    }),

    // ── Detail page (full rich-text content) ──────────────────
    defineField({
      name: 'body', title: 'Project Detail Body', type: 'array',
      group: 'detail',
      description: 'Full rich text content shown on the /projects/[slug] page. Supports headings, bold, links, images, code blocks.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',     value: 'normal'  },
            { title: 'Heading 2',  value: 'h2'      },
            { title: 'Heading 3',  value: 'h3'      },
            { title: 'Quote',      value: 'blockquote'},
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em'     },
              { title: 'Code',   value: 'code'   },
            ],
            annotations: [
              {
                name: 'link', type: 'object', title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        // Inline images in the rich text body
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
        // Inline code block (for showing code snippets)
        {
          type: 'object', name: 'codeBlock', title: 'Code Block',
          fields: [
            defineField({ name: 'language', title: 'Language', type: 'string', initialValue: 'javascript' }),
            defineField({ name: 'code',     title: 'Code',     type: 'text'  }),
          ],
        },
      ],
    }),

    // ── SEO / OG (per-project overrides) ─────────────────────
    // When someone shares /projects/tummulti-bot in Discord,
    // THESE fields control exactly what the embed shows.
    defineField({
      name: 'ogTitle', title: 'OG Title (Discord embed title)', type: 'string',
      group: 'seo',
      description: 'Defaults to the project title if left blank.',
    }),
    defineField({
      name: 'ogDescription', title: 'OG Description (Discord embed text)', type: 'text', rows: 3,
      group: 'seo',
      description: 'Defaults to the short description if left blank.',
    }),
    defineField({
      name: 'ogImage', title: 'OG Thumbnail (Discord embed image)', type: 'image',
      group: 'seo',
      description: 'Recommended: 1200×630 px. Defaults to the project thumbnail if left blank.',
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: { title: 'title', media: 'thumbnail', emoji: 'thumbnailEmoji', platform: 'platform' },
    prepare({ title, media, emoji, platform }) {
      return {
        title,
        subtitle: platform ? `Platform: ${platform}` : 'No platform set',
        media:    media ?? undefined,
      };
    },
  },
});
