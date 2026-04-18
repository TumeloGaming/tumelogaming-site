// ── schemas/objects/projectsSection.ts ──────────────────────────
// The "My Projects" section. Each card references a full `project`
// document (which has its own detail page). This lets you manage
// the project data in one place and reuse it across pages.

import { defineField, defineType } from 'sanity';

export const projectsSection = defineType({
  name:  'projectsSection',
  title: '🚀 Projects Section',
  type:  'object',

  fields: [
    defineField({
      name: 'visible', title: '👁 Visible', type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sectionLabel', title: 'Section Label', type: 'string',
      description: 'Small monospace label above the title (e.g. "// What I\'ve Built").',
      initialValue: "// What I've Built",
    }),
    defineField({
      name: 'sectionTitle', title: 'Section Title', type: 'string',
      initialValue: 'My Projects',
    }),
    defineField({
      name: 'sectionDesc', title: 'Right-side Description', type: 'string',
      initialValue: "Tools and apps I've shipped. More always in the works.",
    }),
    defineField({
      // References the standalone `project` documents.
      // Manage all project details (rich text, OG etc.) from the Projects section of the Studio.
      name: 'projects', title: 'Featured Projects', type: 'array',
      description: 'Pick which projects appear in this section. Edit project details from the 🚀 Projects section.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],

  preview: {
    select: { visible: 'visible' },
    prepare({ visible }) {
      return { title: '🚀 Projects Section', subtitle: visible === false ? '👁 Hidden' : '👁 Visible' };
    },
  },
});
