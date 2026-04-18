// ── sanity.config.ts ────────────────────────────────────────────
// This file configures the Sanity Studio that is embedded at /studio.
// It pulls in all schemas and sets up Studio plugins.

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemas } from './schemas/index';

export default defineConfig({
  // ── Project credentials ─────────────────────────────────────
  // Replace YOUR_PROJECT_ID after running `npx sanity init` (see SETUP.md).
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  dataset:   import.meta.env.PUBLIC_SANITY_DATASET   ?? 'production',

  // ── Studio title & icon ─────────────────────────────────────
  name: 'tumelogaming-studio',
  title: 'TumeloGaming Studio',

  // ── All document/object schemas ─────────────────────────────
  schema: { types: schemas },

  // ── Studio plugins ──────────────────────────────────────────
  plugins: [
    // structureTool: the main content desk where you edit documents.
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — Site Settings (only one document allowed)
            S.listItem()
              .title('⚙️ Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings') // Fixed ID = singleton
              ),
            S.divider(),
            // Pages — can have multiple (homepage, about, etc.)
            S.documentTypeListItem('page').title('📄 Pages'),
            S.divider(),
            // Projects — each gets its own detail page at /projects/[slug]
            S.documentTypeListItem('project').title('🚀 Projects'),
          ]),
    }),

    // presentationTool: live preview panel.
    // When you edit a field, the preview iframe updates instantly.
    presentationTool({
      // The preview URL is your Netlify deploy URL (or localhost in dev).
      // Astro reads SANITY_PREVIEW_SECRET to authenticate preview requests.
      previewUrl: {
        origin: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
        previewMode: {
          enable: '/api/preview/enable',
        },
      },
    }),

    // visionTool: GROQ query playground — useful for debugging data.
    visionTool(),
  ],
});
