// ── schemas/objects/heroSection.ts ──────────────────────────────
// The hero is the first thing visitors see — full-viewport with
// the name, tagline, pronouns, skills marquee, stats, and socials.
// All of it is editable here without touching code.

import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name:  'heroSection',
  title: '🌟 Hero Section',
  type:  'object',

  fields: [
    // ── Section visibility toggle ──────────────────────────────
    defineField({
      name: 'visible', title: '👁 Visible', type: 'boolean',
      description: 'Toggle to hide/show this entire section on the live site.',
      initialValue: true,
    }),

    // ── Name display ──────────────────────────────────────────
    defineField({ name: 'name1', title: 'Name Line 1 (white gradient)', type: 'string', initialValue: 'TUMELO' }),
    defineField({ name: 'name2', title: 'Name Line 2 (accent gradient)',type: 'string', initialValue: 'GAMING' }),
    defineField({ name: 'pronouns', title: 'Pronouns', type: 'string', initialValue: 'he/him' }),

    // ── Bio / tagline ─────────────────────────────────────────
    defineField({
      name: 'tagline', title: 'Bio / Tagline', type: 'text', rows: 4,
      description: 'The paragraph shown below the name with the left purple border.',
    }),

    // ── Skills marquee ────────────────────────────────────────
    defineField({
      name: 'skills', title: 'Skills (marquee badges)', type: 'array',
      description: 'Each item becomes a scrolling badge. Include emoji prefix.',
      of: [{ type: 'string' }],
    }),

    // ── Stats sidebar ─────────────────────────────────────────
    defineField({
      name: 'stats', title: 'Stats', type: 'object',
      fields: [
        defineField({ name: 'servers',    title: 'MC Servers Count',    type: 'string', initialValue: '17'  }),
        defineField({ name: 'experience', title: 'Years Experience',    type: 'string', initialValue: '3+'  }),
        defineField({ name: 'serversLabel',    title: 'Servers Stat Label',    type: 'string', initialValue: 'MC Servers Staffed' }),
        defineField({ name: 'experienceLabel', title: 'Experience Stat Label', type: 'string', initialValue: 'Years Experience'  }),
      ],
    }),

    // ── Social links ──────────────────────────────────────────
    defineField({
      name: 'socials', title: 'Social Links', type: 'array',
      of: [{
        type: 'object',
        name: 'social',
        fields: [
          defineField({
            name: 'id', title: 'Platform', type: 'string',
            options: {
              list: [
                { title: 'Twitch',  value: 'twitch'  },
                { title: 'TikTok',  value: 'tiktok'  },
                { title: 'Twitter / X', value: 'twitter' },
                { title: 'YouTube', value: 'youtube' },
                { title: 'Discord', value: 'discord' },
                { title: 'GitHub',  value: 'github'  },
              ],
            },
          }),
          defineField({ name: 'label',   title: 'Button Label', type: 'string' }),
          defineField({ name: 'url',     title: 'URL',          type: 'url'    }),
          defineField({ name: 'enabled', title: 'Enabled',      type: 'boolean', initialValue: true }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'url', enabled: 'enabled' },
          prepare({ title, subtitle, enabled }) {
            return { title: `${enabled ? '✅' : '❌'} ${title}`, subtitle };
          },
        },
      }],
    }),
  ],

  preview: {
    select: { name1: 'name1', name2: 'name2', visible: 'visible' },
    prepare({ name1, name2, visible }) {
      return {
        title:    `🌟 Hero — ${name1} ${name2}`,
        subtitle: visible === false ? '👁 Hidden' : '👁 Visible',
      };
    },
  },
});
