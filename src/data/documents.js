/**
 * The document library, the single source of truth for /documents.
 *
 * Everything the page shows is derived from `documents` below: the index, the
 * count, the search and the reader. Adding a record here is the whole workflow
 * for publishing a new document; no template or component has to change.
 *
 * Every record is metadata plus a canonical external URL. Nothing is mirrored
 * or copied into this repository, so the House never serves a stale fork of a
 * document the institution is still editing.
 *
 * Fields:
 *   id           stable slug, used as the selection key
 *   ref          archive number, derived from position in the array
 *   title        exactly as the document calls itself
 *   category     one key from CATEGORIES
 *   source       who publishes it
 *   sourceKind   the short label printed in the meta line
 *   type         one key from TYPES, which decides the action wording
 *   description  optional, and only when the title or the document supports it
 *   url          the canonical link, exactly as supplied
 *   icon         the Lucide component shown in the reader header
 */
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  GraduationCap,
  Scale,
  ScrollText,
  Sparkles,
  Table2,
  Users,
} from 'lucide-vue-next';

/**
 * Category labels. Eleven documents do not warrant a filter interface, so
 * there is none: a category is the label printed on an entry, and a term the
 * search matches against.
 */
export const CATEGORIES = [
  { key: 'handbooks', label: 'Handbooks' },
  { key: 'guidelines', label: 'Guidelines' },
  { key: 'academic', label: 'Academic' },
  { key: 'career', label: 'Career' },
  { key: 'student-life', label: 'Student Life' },
  { key: 'calendars', label: 'Calendars' },
  { key: 'policies', label: 'Policies' },
];

/**
 * What kind of resource sits at the other end of the link, and what the reader
 * can do with it. `viewer` decides which strategy DocumentViewer uses.
 *
 * The three embeddable strategies were verified against the live resources
 * rather than assumed from the URL shape:
 *
 *   doc     published Google Docs (/pub). No X-Frame-Options and no
 *           frame-ancestors, and they render inside an iframe.
 *   sheet   the published spreadsheet (/pubhtml), same story.
 *   drive   Drive files, which refuse to be framed at /view but are public
 *           and render fine at /preview.
 *
 * And the two that cannot be embedded, each for its own reason:
 *
 *   download  the term calendar is served with frame-ancestors 'none', so it
 *             can only ever be fetched, never displayed in a frame.
 *   external  a Google Doc that is publicly readable but is not published to
 *             the web; its /preview renders an empty frame, so the reader
 *             offers the original instead of a blank box.
 */
export const TYPES = {
  doc: { label: 'Google Doc', viewer: 'embed', action: 'Open Original', download: false },
  sheet: { label: 'Google Sheets', viewer: 'embed', action: 'Open Original', download: false },
  drive: { label: 'Google Drive', viewer: 'embed', action: 'Open Original', download: false },
  download: {
    label: 'Direct Download',
    viewer: 'download',
    action: 'Download',
    download: true,
  },
  external: { label: 'Google Doc', viewer: 'external', action: 'Open Original', download: false },
};

/**
 * The URL the reader frames, derived from the canonical link so the two can
 * never disagree. Returns null for anything that is not embeddable, which is
 * what tells the viewer to render a fallback instead of an iframe.
 */
export function embedUrlFor(doc) {
  switch (doc.type) {
    case 'doc':
      // Published docs take a query flag that drops Google's own chrome.
      return doc.url + (doc.url.includes('?') ? '&' : '?') + 'embedded=true';
    case 'sheet':
      return doc.url + (doc.url.includes('?') ? '&' : '?') + 'widget=true&headers=false';
    case 'drive':
      // /view refuses to be framed; /preview is the embeddable form of the
      // same file.
      return doc.url.replace(/\/view(\?.*)?$/, '/preview');
    default:
      return null;
  }
}

/**
 * The archive, in reading order: the documents a student needs most often
 * first, the specialised and community records last. This array is the only
 * place that order is stated. The index, the count, the search results and the
 * reader's own archive list all read it, and the printed number below is the
 * position in it, so moving a record renumbers it everywhere at once.
 */
const RECORDS = [
  {
    id: 'student-ds-handbook',
    title: 'Student DS Handbook',
    category: 'handbooks',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    description: 'Official handbook for the IIT Madras BS Degree Programme.',
    url: 'https://docs.google.com/document/u/1/d/e/2PACX-1vRxGnnDCVAO3KX2CGtMIcJQuDrAasVk2JHbDxkjsGrTP5ShhZK8N6ZSPX89lexKx86QPAUswSzGLsOA/pub',
    icon: BookOpen,
  },
  {
    id: 'academic-non-academic-guidelines',
    title: 'Academic and Non-Academic Guidelines',
    category: 'guidelines',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    description: 'Academic and non-academic guidelines for students.',
    url: 'https://docs.google.com/document/u/1/d/1N5ZmPJZUDHznjt6G_ZiRS1baG_WpOfJM-oFnvWve76Y/pub',
    icon: ScrollText,
  },
  {
    id: 'student-interaction-guidelines',
    title: 'Student Interaction Guidelines',
    category: 'guidelines',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    description: 'Guidelines for student interaction.',
    url: 'https://docs.google.com/document/u/1/d/1eSfJLWW-SChkbMkxMWnmWILx0bUY7PfRChwaAw0KJbE/pub',
    icon: Users,
  },
  {
    id: 'grading-ds-handbook',
    title: 'Grading DS Handbook',
    category: 'handbooks',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    description: 'Grading handbook for the Data Science programme.',
    url: 'https://docs.google.com/document/d/e/2PACX-1vT5PBOz4OH663W0IJPVGVjG_nfmYZGfFI7W1j-6wTLcex13O_7BZmf6a96Q6liO0W-mLZB5hOGZeNNl/pub',
    icon: Award,
  },
  {
    id: 'bs-region-reference',
    title: 'BS Region Reference',
    category: 'student-life',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'sheet',
    description: 'Reference sheet of BS programme regions.',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQB0J-AZCo9UT2BR76Q8h_gPsqDZmz2XR7iAAXGSyc5s2EQ-pqve270nitkFrcFSaW5DH8d8j0uVHrf/pubhtml',
    icon: Table2,
  },
  {
    id: 'term-calendar',
    title: 'Term Calendar',
    category: 'calendars',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'download',
    description: 'Academic term calendar for the programme.',
    url: 'https://drive.usercontent.google.com/download?id=1_vslwUdBNFCH6DSTLeVlqvX5Rtw57gSD&authuser=0',
    icon: CalendarDays,
  },
  {
    id: 'iitm-bs-students-constitution',
    title: "IITM BS Students' Constitution",
    category: 'policies',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    description: "The constitution of the IITM BS students' body.",
    url: 'https://docs.google.com/document/d/e/2PACX-1vRg7fBOFdQ6H0V-iqXSGa7lSZAaZeRZujPBKZe0UY2QzKB9yWQ7zR1PElBlzTZCp-Dt3kr7JAvNFpHM/pub',
    icon: Scale,
  },
  {
    id: 'placement-activity-points',
    title: 'Placement Activity Points',
    category: 'career',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'doc',
    url: 'https://docs.google.com/document/d/e/2PACX-1vTNmtT16crBJwERX-RKiC9wBr25FhIe5qq9pSYv0Z08oq96UxPZL0IL_EKlLlmWlp8ZBGJeinLY5z8A/pub',
    icon: FileText,
  },
  {
    id: 'course-mentorship',
    title: 'Course Mentorship',
    category: 'academic',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'drive',
    url: 'https://drive.google.com/file/d/1G4WtcFV2IvBPjd_y86yoonVwlnI3c_qg/view',
    icon: GraduationCap,
  },
  {
    id: 'ta-placement-internship',
    title: 'Teaching Assistantship & Placement Team Internship Details',
    category: 'career',
    source: 'IIT Madras',
    sourceKind: 'Institution',
    type: 'drive',
    description: 'Details of teaching assistantship and placement team internship roles.',
    url: 'https://drive.google.com/file/d/1yfznBrNROOd8uV_MYgmjEdyMagagRti3/view',
    icon: Briefcase,
  },
  {
    id: 'paradox',
    title: 'Paradox',
    category: 'student-life',
    source: 'Student Body',
    sourceKind: 'Student Body',
    type: 'external',
    url: 'https://docs.google.com/document/d/1RzkXftE0x07uMX1QUxm9D0sGfa0uoIson2SCKlHxy1c',
    icon: Sparkles,
  },
];

/** Position decides the archive number, so the two can never disagree. */
export const documents = RECORDS.map((doc, i) => ({
  ...doc,
  ref: String(i + 1).padStart(2, '0'),
}));

/** Category key to display label, for the meta line on every entry. */
export function categoryLabel(key) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/**
 * One pass over the archive. The query is matched against everything a reader
 * might reasonably type: the title, the category, who publishes it, the
 * description and the resource type.
 *
 * Eleven documents do not need faceted filtering, so there is none. The
 * category still earns its place as the label on each entry, and as the thing
 * a search for "handbooks" or "calendars" matches against.
 */
export function searchDocuments(list, query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((doc) =>
    [
      doc.title,
      categoryLabel(doc.category),
      doc.source,
      doc.sourceKind,
      doc.description,
      TYPES[doc.type]?.label,
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  );
}
