# Sundarbans House - State
> IITM BS Sundarbans House frontend and related product work · Last checkpoint: 2026-09-03

## In progress / next
- Live Teams view now carries the 2026–27 roster in the approved card format: photo and text as separate blocks, plain role/name/region text (no pills, no pin, no m-dash), gold border-only hover with photo-only zoom, only UHC + LHC sections. Owner approved; next step is a final pass on any remaining crop/text tweaks.
- Continue testing the live RAG chatbot after the first audit; start with the P0 taxonomy and answerability failures in `docs/reports/sundarbans-rag-chatbot-audit-2026-09-03.md`.

## Status
- Repository frontend is a Vue 3 SPA with hash routing and lazy-loaded routes.
- 12 team portraits (abstract-background edits, 3:4) are synced to Cloudinary under `sundarbans/teams/`; delivery URLs live in `media/manifest.json`. Anuraj and Dhanashree were re-cropped from the uncropped originals (arms visible / subject fills frame) and re-uploaded under the same public IDs.
- The old local scratch dirs (`Teams/`, `prototypes/`, `tmp/`) were deleted by the owner after the council design was chosen and ported into `src/views/TeamsView.vue`; they are gitignored in case they return.
- Live chatbot audit report: `docs/reports/sundarbans-rag-chatbot-audit-2026-09-03.md`; found retrieval wins but critical taxonomy/grounding failures.

## Architecture map
- App bootstrap and global navigation -> `src/main.js`, `src/App.vue`
- Routes -> `src/router/index.js`
- Public views -> `src/views/*`
- Community taxonomy and event records -> `src/views/CommunityView.vue`, `src/views/TechnicalView.vue`, `src/views/CulturalView.vue`, `src/views/ESportsView.vue`
- Teams and community heads -> `src/views/TeamsView.vue`
- Cloudinary image history -> `media/manifest.json` · workflow -> `media/README.md`, `scripts/media-sync.mjs`
- Study resource browser -> `src/components/study/ResourceBrowser.vue`, `src/data/scData_generated.js`
- Meetup data/template -> `src/views/meetups/*`, `src/components/RegionMeetups.vue`
- Audit artifacts -> `docs/reports/*`

## Stack & run
- Stack: Vue 3, vue-router 4, Vite 6, static hosting
- Run: `npm run dev` · Build: `npm run build`
- Gates: `npm run format:check`, `npm run lint`, `npm run build`, `npm run test:smoke`

## Key decisions
- Keep the first chatbot deliverable as an evidence report; defer implementation until the RAG backend and source of truth are known.
- Treat the three public community names as Technical, Cultural, and E-Sports, based on `src/views/CommunityView.vue`.
- Council redesign landed in the live Teams view (owner-approved 2026-09-03): split photo/text cards, plain text labels (never pill/"peeled"), icon-only brand-logo social links, UHC + LHC only (no WebOps/technical block).
- Hover feedback is border-only on the card; only the photo zooms (subtle 1.035), never the whole card.
- Use exact 3:4 portrait frames so processed portraits are never re-cropped by the container; show public social links in the card body.
- Local scratch assets (`Teams/`, `prototypes/`, `tmp/`) stay out of git; Cloudinary + `media/manifest.json` are the image source of truth.

## Gotchas
- The live chatbot loaded a React entry point at `/src/main.jsx`, while this repository's frontend uses Vue. The audit compares live behavior with public repository content; it does not prove the backend implementation.
- Captured chatbot waits often reached roughly 30 seconds; this is a client-side lower bound, not a precise backend benchmark.
- The supplied HTML is a roster export, not a UI specification; verify any future role/name changes against the current source document before implementation.
- Do not commit Cloudinary keys, OAuth secrets, app secrets, or a member roster.
