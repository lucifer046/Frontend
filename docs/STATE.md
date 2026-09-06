# STATE — read this first

**Internal. Owner + AI agents only. Not public.**
Last checkpoint: 2026-09-06 · Branch: `feat/study-corner-exam-cities-hero`

---

## 1. What this is

Vue 3 SPA, hash routing, lazy routes, no backend. Public site plus a gated member portal.

```
npm run dev      npm run build      npm run lint      npm run test:smoke
```

## 2. Before you touch anything

| Touching | Read first |
|---|---|
| `/login` `/lounge` `/dashboard` | `reference/members-lounge.md` |
| `/documents` or the reader | `reference/document-library.md` |
| `/events` or the reel | `reference/events-reel.md` |
| Any colour | `reference/theme.md` |
| Adding a route/component/data file | `conventions.md` |
| Wondering why something is odd | `decisions.md` |

## 3. Hard constraints

Violating these has already caused a bug or a bad diff. Do not.

- **Never bulk-reformat.** `format:check` fails on ~47 pre-existing files. Format only files you
  touch, or the real diff is buried.
- **Never use `href="#"`.** Under hash routing it rewrites the hash and throws the reader to the
  homepage. Use a router-link or a scroll handler.
- **Never add a light theme**, a theme toggle, or a `prefers-color-scheme: light` block.
- **Never mirror an external document into the repo.** Metadata plus canonical URL only.
- **Never hardcode a derived field** (an archive number, a count). Compute it from the array.
- **Never duplicate House content in a view.** Events, documents and the roster live in `src/data/`.
- **Never `window.location.reload()`** for internal navigation, and no timeout hacks.
- **Do not commit** Cloudinary keys, OAuth secrets, app secrets, or a member roster.

## 4. Blocking production

In priority order. The first two make the portal unusable to a real member.

1. **`/login` has a dev bypass.** It signs everyone in as `sundarbans-sec@study.iitm.ac.in` with no
   Google popup and no Sheet check. The real OAuth block is preserved in comments beneath it.
   Restoration steps: `reference/members-lounge.md` section 8.
2. **Seven placeholder Meet links** in the Lounge, literally
   `https://meet.google.com/placeholder-*`. Five weekly events + two reading rooms.
3. **The Lounge leaderboard is five hardcoded names.** No real member can appear on it. Decide:
   make it real or remove it.
4. **`e2e/meetups.spec.js` fails.** It asserts on the Past Meetups archive cards that were removed
   from `MeetupsView.vue`. Restore the section or retire the assertions. Pre-dates 2026-09-06.

## 5. Other open work

- Continue testing the live RAG chatbot. Start with the P0 taxonomy and answerability failures in
  `reports/sundarbans-rag-chatbot-audit-2026-09-03.md`.
- Dashboard widget state is per-browser, not per-member. If the portal is meant to feel shared,
  that needs a backend decision.

## 6. Where things live

| Area | Files |
|---|---|
| Bootstrap, global chrome | `src/main.js`, `src/App.vue` |
| Routes (all of them, one file) | `src/router/index.js` |
| Public views | `src/views/*View.vue` |
| Navigation rail | `src/components/navigation/*` |
| Member portal | `src/views/LoginView.vue`, `src/views/MembersLoungeView.vue`, `src/views/DashboardView.vue`, `src/components/portal/`, `src/components/dashboard/` |
| Document library | `src/views/DocumentsView.vue`, `src/components/documents/*`, `src/data/documents.js` |
| Events + reel | `src/views/EventsView.vue`, `src/components/events/*`, `src/data/events.js` |
| Theme | `src/assets/style.css` (tokens), `src/assets/theme-lock.css` (lock) |
| Roster (Teams, Leaderboard, Lounge all read it) | `src/data/council.js` |
| Study resources | `src/components/study/*`, `src/data/scData_generated.js` |
| Meetups | `src/views/meetups/*`, `src/components/RegionMeetups.vue` |
| Images | Cloudinary. History in `media/manifest.json`, sync via `npm run media:sync` |

## 7. Recently landed (2026-09-06)

- **Dark theme lock.** `src/assets/theme-lock.css` + three head metas. One theme, cooperative
  extension handling, no `!important`.
- **Contrast fix.** `--color-cream-faint` was failing WCAG AA at 3.2:1. Now `#8e7e5d`.
- **Document library.** `/documents` 3-column index, `/documents/:id` in-site reader, 11 documents,
  9 embed and 2 fall back for verified reasons.
- **Past Events reel.** Shared component on `/events` and the homepage, one dataset.
- **Nav order** is Home, Study Corner, Documents, Events, Meetups, Leaderboard, Community, Teams,
  About, Contact. Rail hover calmed from a 4-row wave to a single row.
- **Removed:** Exam Cities page, Contact regional contacts, Meetups archive section, two dead
  footer links.

## 8. Gotchas

Things that look like bugs but are not, and things that are.

| Thing | Truth |
|---|---|
| `sundarbans_auth_token` | A plain email string in `localStorage`. Gates convenience, **not a security boundary.** Nothing behind it is secret |
| Dashboard tallies | Per-browser. The House-wide-looking numbers are seed values plus the local member's own contribution |
| `DOCS_timing is not defined` | Google's script inside their cross-origin frame on the doc reader. Not ours, not fixable |
| Term Calendar + Paradox won't embed | Verified: `frame-ancestors 'none'` and not-published-to-web. They fall back on purpose |
| A view resets its state on navigation | `App.vue` keys `<router-view>` by `route.path`. State that must survive goes at module scope in a plain `<script>` block |
| Playwright `hover()` times out on the reel | It waits for the element to stop moving. Point the mouse at coordinates instead |
| The live chatbot is React | It loads `/src/main.jsx`; this repo is Vue. The audit compares live behaviour with public repo content, it does not prove the backend |

## 9. Checkpoint protocol

At the end of a session: rewrite this file, append to `decisions.md` (never edit it), and add
`sessions/YYYY-MM-DD.md`. Keep this file short enough that reading it is always worth it.
