// ── schemas/objects/positionsSection.ts ─────────────────────────
// "Current Positions" section — the cards showing your active/retired roles.
// Add, remove, reorder, or toggle visibility of individual cards here.

import { defineField, defineType } from 'sanity';

export const positionsSection = defineType({
  name:  'positionsSection',
  title: '🛡️ Positions Section',
  type:  'object',

  fields: [
    defineField({
      name: 'visible', title: '👁 Visible', type: 'boolean',
      description: 'Toggle to hide/show the entire Positions section.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionNumber', title: 'Section Number', type: 'string',
      description: 'The large decorative number shown on the left (e.g. "01").',
      initialValue: '01',
    }),
    defineField({
      name: 'sectionTitle', title: 'Section Title', type: 'string',
      initialValue: 'Current Positions',
    }),
    defineField({
      name: 'sectionDesc', title: 'Section Description', type: 'string',
      initialValue: "Where I'm actively working right now.",
    }),
    defineField({
      name: 'showOpenToRoles', title: 'Show "Open to Roles" placeholder card?', type: 'boolean',
      initialValue: true,
      description: 'Shows a dashed placeholder card at the end of the positions grid.',
    }),
    defineField({
      name: 'positions', title: 'Position Cards', type: 'array',
      of: [{
        type: 'object',
        name: 'positionCard',
        fields: [
          defineField({ name: 'visible',  title: '👁 Card Visible', type: 'boolean', initialValue: true }),
          defineField({ name: 'icon',     title: 'Icon (emoji)',    type: 'string'  }),
          defineField({ name: 'title',    title: 'Title',           type: 'string'  }),
          defineField({ name: 'subtitle', title: 'Subtitle',        type: 'string'  }),
          defineField({ name: 'description', title: 'Description',  type: 'text', rows: 3 }),
          defineField({ name: 'link',     title: 'Link URL',        type: 'url'     }),
          defineField({ name: 'linkText', title: 'Link Label',      type: 'string'  }),
          defineField({
            name: 'tag', title: 'Status Tag', type: 'string',
            options: { list: ['Active', 'Retired', 'Upcoming', 'Paused'] },
          }),
          defineField({
            name: 'tagColor', title: 'Tag Colour', type: 'string',
            options: {
              list: [
                { title: 'Cyan (Active)',   value: 'cyan'   },
                { title: 'Purple',          value: 'purple' },
                { title: 'Pink (Retired)',  value: 'pink'   },
                { title: 'Yellow',          value: 'yellow' },
              ],
            },
          }),
        ],
        preview: {
          select: { icon: 'icon', title: 'title', tag: 'tag', visible: 'visible' },
          prepare({ icon, title, tag, visible }) {
            return {
              title:    `${icon ?? ''} ${title}`,
              subtitle: `${tag ?? ''} ${visible === false ? '· Hidden' : ''}`,
            };
          },
        },
      }],
    }),
  ],

  preview: {
    select: { visible: 'visible' },
    prepare({ visible }) {
      return { title: '🛡️ Positions Section', subtitle: visible === false ? '👁 Hidden' : '👁 Visible' };
    },
  },
});
