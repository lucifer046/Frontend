# Reference: Document Library

**Read this before touching `/documents`, the reader, or `src/data/documents.js`.**
Internal doc. State what is true.

---

## Files

```
src/views/DocumentsView.vue                    index + reader, one component
src/components/documents/DocumentViewer.vue    the frame, five strategies
src/data/documents.js                          the dataset, the only source of truth
src/assets/documents.css                       index styles (dl- namespace)
src/assets/reader.css                          reader + viewer styles (dr-, dv-)
e2e/documents.spec.js                          20 tests, including every exact URL
```

## Routes

One record, optional param:

```js
{ path: '/documents/:id?', component: () => import('../views/DocumentsView.vue') }
```

- `/documents` renders the index
- `/documents/<id>` renders the reader
- An id matching no document does `router.replace('/documents')`, so Back still works

There is **no intermediate detail page**. A card click goes straight to the reader. Do not
reintroduce a selection step.

## The dataset

`src/data/documents.js` exports:

| Export | What |
|---|---|
| `documents` | The archive, **in reading order** |
| `CATEGORIES` | Label lookup. There is no filter UI and should not be |
| `TYPES` | Per-type label, viewer strategy, action wording |
| `embedUrlFor(doc)` | Derives the embeddable URL from the canonical one, or `null` |
| `searchDocuments(list, q)` | Matches title, category, source, sourceKind, description, type label |
| `categoryLabel(key)` | Key to label |

### Rules

- **Order is stated once**, in the `RECORDS` array. The printed number is derived:
  `documents = RECORDS.map((doc, i) => ({ ...doc, ref: String(i+1).padStart(2,'0') }))`.
  Never hardcode a `ref`. Reordering the array renumbers the index and the reader rail together.
- **URLs are exact as supplied.** `e2e/documents.spec.js` holds a literal copy of all 11 and will
  fail if one is edited. That is deliberate.
- **Nothing is mirrored into the repo.** Metadata plus a canonical external URL. The institution
  keeps editing these documents; a copy would be a stale fork.
- Add a document by appending an object. The index, count, search and reader all follow.

## Viewer strategies

`TYPES[doc.type].viewer` picks one of three behaviours. **These were verified against the live
resources, not inferred from URL shape.** Re-verify before changing one.

| `type` | Viewer | Embed URL | Evidence |
|---|---|---|---|
| `doc` | embed | `+ ?embedded=true` | Published `/pub`: no `X-Frame-Options`, no `frame-ancestors`. Renders |
| `sheet` | embed | `+ ?widget=true&headers=false` | Published `/pubhtml`, same. Renders |
| `drive` | embed | `/view` -> `/preview` | `/view` sends `SAMEORIGIN` and refuses; `/preview` renders |
| `download` | download | none | Term Calendar is served **`frame-ancestors 'none'`**. Can never be framed |
| `external` | external | none | Paradox is publicly readable but not published-to-web; its `/preview` renders an empty frame even with nothing else loading |

Current split: **9 embed, 2 fall back.** Every strategy also offers Open Original.

**Never render a blank frame.** A document that cannot embed says so and offers the original.

## The viewer component

- **Exactly one iframe is ever mounted**, keyed by `document.id` so switching replaces rather than
  stacks. The index mounts none. Asserted by test.
- `state` is `loading` -> `ready` (on iframe `load`) or `error` (on timeout).
- Timeout is **30s** and deliberately patient: the published handbooks are close to a megabyte plus
  images. It was 15s and fired on a good document.
- No `loading="lazy"`: the frame is the page's main content.
- No `sandbox` attribute. Google's viewers need scripts and same-origin for their own origin, and
  `allow-scripts allow-same-origin` on a cross-origin frame grants nothing past the existing
  boundary while risking breaking the viewer.

## Known non-issue

`DOCS_timing is not defined` appears in the console on any embedded-doc reader route. **It is
Google's own published-page script inside their cross-origin frame.** Proof: it appears only when
a frame is mounted, never on the identical shell without one, and the identifier exists nowhere in
this repo. It cannot be fixed from outside the frame. Do not chase it.

## Layout constraints

- Index is a 3-column grid, 2 below 1100px, 1 below 680px.
- Cards in a row share a height: the grid cell stretches, the card is a flex column filling it,
  the action sits on `margin-top: auto`. The **description** is the only thing that yields
  (3-line clamp). Titles wrap freely and must never be truncated.
- The reader panel is **not sticky**. It was, and a pinned panel taller than the viewport puts its
  own actions permanently out of reach. Do not restore `position: sticky` there.
- Reader frame height tracks the viewport: `clamp(30rem, calc(100vh - 17rem), 62rem)`.

## Gotchas

- `App.vue` keys `<router-view>` by `route.path`, so moving between index and reader **remounts the
  view**. The search box survives because `query` lives at module scope in a plain `<script>` block.
  If you add state that must survive, put it there too.
- Search matches the category even though there is no category filter. That is the point.
