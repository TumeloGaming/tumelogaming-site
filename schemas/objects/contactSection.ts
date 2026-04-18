// ── schemas/objects/contactSection.ts ───────────────────────────
// Pulls contact data from siteSettings (or can be overridden per-page).
// Used as a standalone footer-trigger section if you want to reposition it.

import { defineField, defineType } from 'sanity';

export const contactSection = defineType({
  name:  'contactSection',
  title: '📬 Contact Section',
  type:  'object',
  fields: [
    defineField({ name: 'visible', title: '👁 Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'useGlobal', title: 'Use Global Contact Settings?', type: 'boolean',
      description: 'When ON, contact info is pulled from ⚙️ Site Settings. When OFF, you can override below.',
      initialValue: true,
    }),
    defineField({ name: 'discord',    title: 'Override Discord Handle',     type: 'string' }),
    defineField({ name: 'discordUrl', title: 'Override Discord Profile URL', type: 'url'   }),
    defineField({ name: 'email',      title: 'Override Email',              type: 'string' }),
  ],
  preview: {
    prepare() { return { title: '📬 Contact Section' }; },
  },
});
