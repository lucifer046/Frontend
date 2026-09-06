# Decisions — why things are the way they are

> **Internal.** Append-only log of load-bearing choices and WHY. Newest at the bottom.
> Format: `## YYYY-MM-DD — <decision>` then a short **Why:** line.
> **Never edit or delete an entry.** A superseded decision gets a NEW entry saying what replaced it
> and why, so the reasoning trail survives.

## 2026-07-11 — No backend; fully client-side app (inferred at adoption)
**Why:** Site is served as a static Vite build; "auth" is a localStorage token gate (`sundarbans_auth_token`), not server-verified. Keeps hosting simple and free.

## 2026-07-11 — Hash-based routing via `createWebHashHistory` (inferred at adoption)
**Why:** Works on plain static hosting without server-side rewrite rules for deep links.

## 2026-07-11 — All routes eagerly imported in `src/router/index.js` (inferred at adoption)
**Why:** Not clearly a deliberate performance choice — every view is statically imported, so the whole app ships in the initial bundle. Flagged as a latency lever to revisit during the storage/perf overhaul.
**Superseded:** routes are now lazy-loaded (see PR #5 / decision below).

## ~2026-07 — Lazy route imports in `src/router/index.js` (PR #5)
**Why:** Visitors only download the view chunk they need; homepage no longer pulls the whole app. Vite needs literal static paths in `import()` so each view emits its own chunk.

## 2026-07 — Membership via Apps Script + Google Sheet (T-13); no local roster (PRs #17, #19, #20)
**Why:** Single source of truth in the council Sheet. Client calls `VITE_MEMBERSHIP_CHECK_URL` after Google OAuth. `members.json` removed so prod cannot silently fall back to a stale roster.

## 2026-07 — Certificate PDFs on Google Drive, not in git (T-16; PRs #18, #20)
**Why:** ~89M of PDFs bloated the repo and deploys. Verify flow opens Drive view/export URLs by file id. Do not re-commit certificate binaries.

## 2026-08-05 — Site images on Cloudinary; hero frames stay in-repo
**Why:** Teams/events/regions (~40M) bloated git and page weight. Cloudinary hosts display images. Homepage 240-frame scroll stays on same-origin (`public/assets/frames/`) for predictable fast scrub. No full backend/admin — team dumps into `media/` and runs `npm run media:sync`.

## 2026-08-05 — Delivery URL transforms + incoming upload compression
**Why:** Raw CDN masters still lag (multi‑MB eager loads). Delivery URLs use `f_auto,q_auto:good,w_1000,c_limit` for bandwidth. Future `media:sync` uploads apply incoming max-1600 + `quality:auto:good` so free-tier **storage** is not filled with phone originals. URL-only transforms do not shrink stored bytes; both layers are intentional.

## 2026-08-05 — Drop Spec 001 T-11 (`docs/ownership.md`)
**Why:** Owner stays with the team long-term and will communicate where configs live when needed. No council-backup / handover / break-glass ownership doc.

## 2026-08-05 — Close Spec 001; cancel remaining tickets
**Why:** Product-visible + HEAD-quality goals are done (membership, Drive certs, Cloudinary, tooling/CI/refactors). Leftovers (history purge, screenshot baseline, size guard, modal cert UI, Apps Script source in repo, fork previews, re-audit, etc.) are optional hygiene — cancelled so the board matches reality and does not invent busywork.

## 2026-09-03 — Review council layouts before live Teams replacement
**Why:** The supplied 2026–27 portraits and roster differ from the current Teams page. A standalone review board lets the visual direction be selected before changing live content; the supplied UHC/LHC structure reference stays local and the portraits use the existing Cloudinary pipeline.

## 2026-09-03 — Match council portraits at native 3:4 ratio
**Why:** The processed portrait sources are 1200×1600. The separate command-deck demo uses 3:4 frames and visible card metadata so portraits are not treated as cropped landscape thumbnails; the technical team block remains deferred until requested.

## 2026-09-03 — Curate command deck: logo socials, no badges/pills, UHC+LHC only
**Why:** Owner feedback after reviewing the command-deck demo: text social links become icon-only brand logos, the 01–09 order badges are noise, the "Leadership"/"Regional" tags must not look pill/peeled, section subtitles are removed, and the demo carries only Upper and Lower House Council (no WebOps/technical block) until a later product decision. Rejected keeping demo scaffolding (roster panel, flow strip, rationale notes) so the review shows the actual design.

## 2026-09-06 — Past Events become one shared film reel, used on two pages
**Why:** The archive was a 3-column card grid that scrolled forever. It is now a film strip on a
rotated/perspective plane, seamless via two identical halves sliding exactly 50%. One component
(`PastEventsReel.vue`) with an `archive` and a `compact` variant serves `/events` and the homepage;
both read `src/data/events.js`, so the two can never drift. Rejected shortening the homepage list:
a set narrower than the viewport leaves a gap at the loop seam, so the compact variant shrinks the
frames instead.

## 2026-09-06 — Documents are metadata plus a canonical URL, never a mirror
**Why:** The institution keeps editing these documents. Copying them into the repo would ship a
stale fork the House then has to maintain. `src/data/documents.js` holds metadata and the exact
supplied URL; the reader embeds the source.

## 2026-09-06 — Viewer strategy per document, verified rather than assumed
**Why:** Not every Google URL embeds. Checked against the live resources: published `/pub` docs and
the `/pubhtml` sheet send no `X-Frame-Options` and no `frame-ancestors`, so they embed; Drive files
refuse framing at `/view` but render at `/preview`; the Term Calendar is served
`frame-ancestors 'none'` and can never be framed; Paradox is publicly readable but not
published-to-web, and its `/preview` renders an empty frame even in isolation. Nine embed, two get
an honest fallback. No blank iframes.

## 2026-09-06 — Documents collapse to index -> reader, two steps
**Why:** A category rail, a filter set and a right-hand detail panel were three screens between a
visitor and eleven documents. The index is now the page and a card click opens the reader. Search
stays because it is cheap; faceted filtering does not return for eleven records.

## 2026-09-06 — Archive numbering is derived from array position
**Why:** Hardcoded `ref: '01'…'11'` survives a reorder and starts lying. `documents` is now
`RECORDS.map((doc, i) => ({ ...doc, ref: ... }))`, so the index, the reader rail and the printed
number cannot disagree. Order is stated once, in the array.

## 2026-09-06 — Nav rail hover is one row, not a wave
**Why:** The gaussian displacement field ran at `maxOffset: 8, sigma: 0.9`, which gave the rows
either side 4.32px of travel and the ones beyond that visible drift: hovering one item moved four.
Now `4` and `0.5`, so neighbours take 0.54px and the rest none. The icon's own
`translate3d(3px,-1px) scale(1.06)` compounded with the row's travel into a diagonal hop; it is a
`scale(1.03)` with no translation.

## 2026-09-06 — One theme, locked, cooperatively
**Why:** Automatic darkening tools only have to guess where a page leaves a colour unstated, and an
audit found 40 selectors painting a background while inheriting their text colour. The fix is to
leave nothing unstated: `src/assets/theme-lock.css` restates the pairs, plus `color-scheme: dark`
(which stops Chrome's own auto-dark) and `<meta name="darkreader-lock">` (Dark Reader's own
published opt-out). Nothing detects, blocks or interferes with an extension, and no `!important` was
needed: loading the file last was enough.

## 2026-09-06 — Muted ink lifted to #8e7e5d
**Why:** `--color-cream-faint` was `#6e6248` and measured 3.2 to 3.5:1 against the page tones,
failing WCAG AA for body text before any extension was involved. Raised at identical hue (41 deg)
and saturation (21%) only until it cleared 4.5:1 on every ground, worst case 4.80:1.

## 2026-09-06 — Footer Privacy and Terms removed rather than left as href="#"
**Why:** Under hash routing `href="#"` is not inert: measured, it rewrote the hash and threw the
reader from `/events` to the homepage with the page gone. There are no Privacy or Terms pages to
link to. Restore them as router-links when those pages exist.
