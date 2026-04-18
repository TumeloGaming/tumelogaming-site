// ── schemas/objects/richTextSection.ts ──────────────────────────
// A freeform Portable Text block you can drop anywhere on any page.
// Use it for custom "About" blurbs, announcements, changelog notes,
// or any content that doesn't fit the other section types.

import { defineField, defineType } from 'sanity';

export const richTextSection = defineType({
  name:  'richTextSection',
  title: '📝 Rich Text Section',
  type:  'object',

  fields: [
    defineField({ name: 'visible', title: '👁 Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'sectionTitle', title: 'Section Title (optional)', type: 'string',
      description: 'Optional heading shown above the rich text block.',
    }),
    defineField({
      name: 'content', title: 'Content', type: 'array',
      description: 'Full rich text — headings, bold, italic, links, and inline images.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal',    value: 'normal'     },
            { title: 'Heading 2', value: 'h2'         },
            { title: 'Heading 3', value: 'h3'         },
            { title: 'Quote',     value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em'     },
              { title: 'Code',   value: 'code'   },
            ],
            annotations: [
              {
                name: 'link', title: 'Link', type: 'object',
                fields: [{ name: 'href', title: 'URL', type: 'url' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: { title: 'sectionTitle', visible: 'visible' },
    prepare({ title, visible }) {
      return {
        title:    `📝 ${title || 'Rich Text Section'}`,
        subtitle: visible === false ? '👁 Hidden' : '👁 Visible',
      };
    },
  },
});
