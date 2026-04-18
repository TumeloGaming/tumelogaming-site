// ── schemas/index.ts ────────────────────────────────────────────
// Central registry: every schema you create must be added here.
// Sanity reads this array to know what document types and field
// objects exist in your Studio.

// Document types (top-level, appear in the Studio sidebar)
import { siteSettings } from './documents/siteSettings';
import { page }         from './documents/page';
import { project }      from './documents/project';

// Object types (embedded inside documents, not standalone)
import { heroSection }      from './objects/heroSection';
import { positionsSection } from './objects/positionsSection';
import { projectsSection }  from './objects/projectsSection';
import { serversSection }   from './objects/serversSection';
import { contactSection }   from './objects/contactSection';
import { richTextSection }  from './objects/richTextSection';

// Export as a flat array — order doesn't matter.
export const schemas = [
  // Documents
  siteSettings,
  page,
  project,
  // Section objects (used inside page.sections[])
  heroSection,
  positionsSection,
  projectsSection,
  serversSection,
  contactSection,
  richTextSection,
];
