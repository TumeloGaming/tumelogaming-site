// ── schemas/objects/serversSection.ts ───────────────────────────
// The Minecraft server experience section.
// Each server entry shows the name, role badge, and colour category.

import { defineField, defineType } from 'sanity';

const ROLE_COLOURS = [
  { title: 'Mod (cyan)',       value: 'mod'     },
  { title: 'Admin (pink)',     value: 'admin'   },
  { title: 'Manager (purple)',value: 'manager' },
  { title: 'Dev (green)',     value: 'dev'     },
  { title: 'Executive (gold)',value: 'exec'    },
  { title: 'Builder (orange)',value: 'builder' },
];

export const serversSection = defineType({
  name:  'serversSection',
  title: '⛏️ Servers Section',
  type:  'object',

  fields: [
    defineField({ name: 'visible', title: '👁 Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'sectionLabel', title: 'Label', type: 'string', initialValue: '// Minecraft Journey' }),
    defineField({ name: 'sectionTitle', title: 'Title', type: 'string', initialValue: 'Server Experience' }),
    defineField({
      name: 'servers', title: 'Server List', type: 'array',
      of: [{
        type: 'object', name: 'serverEntry',
        fields: [
          defineField({ name: 'name', title: 'Server Name', type: 'string' }),
          defineField({ name: 'role', title: 'Role Title',  type: 'string' }),
          defineField({
            name: 'color', title: 'Role Colour', type: 'string',
            options: { list: ROLE_COLOURS, layout: 'radio' },
          }),
        ],
        preview: {
          select: { name: 'name', role: 'role', color: 'color' },
          prepare({ name, role, color }) {
            return { title: name, subtitle: `${role} · ${color}` };
          },
        },
      }],
    }),
  ],

  preview: {
    select: { visible: 'visible' },
    prepare({ visible }) {
      return { title: '⛏️ Servers Section', subtitle: visible === false ? '👁 Hidden' : '👁 Visible' };
    },
  },
});
