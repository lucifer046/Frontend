# Conventions — how to work in this repo

**Read this before adding a route, component, data file or stylesheet.**
Internal doc. These are rules, not suggestions: each one exists because breaking it cost time.

- Stack: Vue 3 (SFC) · vue-router 4 (hash history) · Vite 6 · no backend, no TypeScript
- Run the app: `npm run dev`
- Build: `npm run build` · Preview build: `npm run preview`
- Local gates (same idea as CI): `npm run format:check` · `npm run lint` · `npm run build` · `npm run test:smoke` (Playwright route smoke; needs prior build + Chromium)
- Env: copy `.env.example` → `.env`. Lounge login needs `VITE_GOOGLE_CLIENT_ID` and `VITE_MEMBERSHIP_CHECK_URL` at build time.
- Naming / structure notes:
  - Page-level components live in `src/views/` and are named `*View.vue`; region meetup pages in `src/views/meetups/`.
  - Shared components in `src/components/`; dashboard widgets in `src/components/dashboard/`; portal chrome in `src/components/portal/`; document library in `src/components/documents/`; the events reel in `src/components/events/`.
  - All routes are declared in one file: `src/router/index.js` (lazy `import()` per view — keep paths as literal strings for Vite chunking).
  - `src/assets/` = assets processed/bundled by Vite (import them); `public/` = served as-is at the root URL.
  - Static data as JSON/CSV/JS in `src/data/`, `public/data/`, and per-region export folders under `src/views/meetups/`. No committed members roster.
  - A view never keeps its own copy of House content. Events live in `src/data/events.js`, documents in `src/data/documents.js`, the roster in `src/data/council.js`. Ordering and derived fields (an archive number, a category count) are computed from the array, never written beside it, so a reorder cannot leave a stale label behind.
  - Page-specific CSS is a file in `src/assets/` imported by the view (`events.css`, `documents.css`). CSS a component owns is imported by the component itself (`reel.css`, `reader.css`), so mounting it anywhere brings its styles along. Namespace every file so it cannot reach another page.
  - `src/assets/theme-lock.css` loads last in `main.js` and is the final word on colour. Add new surfaces to its restatement block rather than adding `!important` locally.
  - Certificates live on Google Drive (URLs in code/data), not under `public/certificates/`.
  - Display images live on Cloudinary (delivery transforms in URL). Dump new files in `media/` and run `npm run media:sync`; copy URLs from `media/manifest.json`. The homepage hero uses the optimized clips in `public/assets/video/` (`home-1080.webm` first, `home-1080.mp4` fallback); the uncompressed master is kept out of `public/` so it is never deployed. The hero's loading fallback is the video element's own `poster`, swapped per mount: `home-frame-first.webp` when the clip will play from the top, `home-frame-last.webp` when it will seek to its closing frame. Both are cut from `home-1080.webm` (the file browsers actually load) with `ffmpeg -ss 0` and `-ss 24.85` — the same instant the seek targets — so the poster and the first painted frame are the same picture and the hand-off needs no crossfade. Regenerate both from the same source whenever the clip changes; a poster that is not a frame of the clip shows up as a zoom. `home-poster.webp` is a different photograph, used only by the Save-Data fallback where no video loads.
- Gotchas that have already cost time:
  - `href="#"` is not inert under hash routing; it rewrites the hash and navigates. Use a router-link or a scroll handler.
  - `npm run format:check` fails on ~47 pre-existing files. Format the files you touch; do not bulk-reformat, it buries the real diff.
  - App.vue keys `<router-view>` by `route.path`, so changing the path remounts the view. State that must survive belongs at module scope in a plain `<script>` block.
  - The member portal is documented separately in `docs/reference/members-lounge.md`; read it before touching `/login`, `/lounge` or `/dashboard`.
- Workflow: changes land via GitHub PRs (repo `Anuraj-dev/Frontend`, branch `main`). See `CONTRIBUTING.md` for the full onboarding path.

