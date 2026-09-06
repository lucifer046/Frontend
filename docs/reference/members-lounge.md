# Reference: Members Lounge (the private portal)

**Read this before touching `/login`, `/lounge` or `/dashboard`.**
Internal doc. State what is true.

Everything below is derived from the code as it stands. Where something is a
placeholder or a temporary state, it says so rather than describing the intent
as if it shipped. **Two things in here block production** (sections 8 and 9).

The public site is the House speaking outward. The portal is the same House
seen from the inside, and it is deliberately a **separate visual dialect**, not
a re-skin: its own header, its own footer, its own tokens, its own type scale.
The public rail and footer stand down on all three routes.

---

## 1. Routes and guarding

| Route | View | Guard |
|---|---|---|
| `/login` | `LoginView.vue` | none (it is the entrance) |
| `/lounge` | `MembersLoungeView.vue` | `meta.requiresAuth` |
| `/dashboard` | `DashboardView.vue` | `meta.requiresAuth` |

Two layers, on purpose:

1. **Router guard** (`src/router/index.js`). `beforeEach` reads
   `localStorage.sundarbans_auth_token`; no token sends the visitor to `/login`.
2. **View-level `requireAuth()`** (`usePortalMember`). Each view calls it on
   mount, so a token cleared in another tab is caught on the next paint rather
   than leaving a signed-out member looking at a populated page.

`isRailHiddenFor()` in `navigation.config.js` lists all three routes, which is
what removes the public rail and the public footer inside the portal.

---

## 2. Tech stack

Same stack as the public site; the portal adds no dependencies.

- **Vue 3** SFCs, `<script setup>`, Composition API
- **vue-router 4**, hash history, lazy route chunks
- **Vite 6** build
- **lucide-vue-next** for all iconography
- **Plain CSS** in two layers: `portal.css` (the portal dialect) and
  `dashboard.css` (widget styles), both imported by the views that need them
- **No state library, no backend calls at runtime.** Membership is checked once
  at sign-in; after that the portal reads `localStorage` and static data

### Files

```
src/views/LoginView.vue              entrance, Google OAuth + membership check
src/views/MembersLoungeView.vue      the lounge, five bands
src/views/DashboardView.vue          the dashboard, four tabs of widgets
src/components/portal/PortalNav.vue      header + teleported mobile tab bar
src/components/portal/PortalFooter.vue   private footer
src/components/portal/WhatsAppMark.vue   inline brand glyph
src/components/dashboard/*.vue           eight widgets
src/components/dashboard/widgetIcons.js  icon lookup shared by widgets
src/composables/usePortalMember.js       the member, plus the v-reveal directive
src/composables/useLocalStorage.js       save/load helpers, try/catch wrapped
src/composables/useConfetti.js           canvas confetti for widget rewards
src/assets/portal.css                    portal tokens and shell
src/assets/dashboard.css                 widget styles
src/data/dashboard.json                  widget seed content
src/data/portalImagery.js                House photographs (Cloudinary)
```

---

## 3. Identity: what the portal actually knows

`usePortalMember()` is the single source of truth, and its restraint is the
load-bearing design decision:

> The only thing the app knows about a signed-in member is **the email the
> membership check approved**. Everything else is derived from that string.

- `email` — the token value
- `displayName` — a roll number is left exactly as issued (`23f1000052`),
  because upper-casing it reads as noise; a human-shaped local part is
  title-cased (`priya.nair` → `Priya Nair`)
- `firstName` — first word, used by the greeting
- `initials` — first and last initial, used by the avatar
- `logout()` — clears the token and pushes `/login`

**A field the token cannot support is absent, not faked.** There is no house,
no member number, no join date, no avatar upload, because none of those exist
in the token. This is why the portal has no profile card.

---

## 4. Design system: the portal dialect

All tokens live on `.portal` and `.ptab` in `portal.css`. The mobile bar is
teleported to `<body>`, which is why it needs the token block too, and it is
the only thing besides `.portal` that carries it.

**Ground** is one step warmer than the public black, deliberately by a small
margin: a room inside the same building, not a different site.

| Token | Value | Role |
|---|---|---|
| `--p-ground` | `#050605` | page |
| `--p-ground-forest` | `#060907` | alternating band |
| `--p-ground-deep` | `#000000` | footer |
| `--p-surface` | `#070b09` | card |
| `--p-surface-raised` | `#0b100d` | nested well |
| `--p-gold` / `--p-gold-light` / `--p-gold-deep` | `#d5a63a` / `#e9c873` / `#a97c22` | metal |
| `--p-ink` → `--p-ink-faint` | `#f1e8d0` at 1 / .82 / .62 / .38 | four ink weights |
| `--p-live` / `--p-silver` / `--p-bronze` | `#6fbf8b` / `#c3c7c9` / `#b98149` | status marks, never surfaces |

**Line, not fill.** Three border weights and nothing else; a card is separated
from the page by its hairline, never by its background.

**Rhythm.** `--p-shell: clamp(20rem, 16.5rem + 72vw, 125rem)` opens with about
three quarters of every extra pixel above ~1100px and caps at 2000px, which is
what stops a 27 inch monitor from rendering a narrow strip between two black
margins. `--p-band` and `--p-gutter` are fluid on the same principle, so no
layout needs a fixed corrective margin.

**Motion.** One entrance effect, the `v-reveal` directive. One
`IntersectionObserver` per element, disconnected the moment it fires, so a long
page never keeps dozens alive. Two escape hatches are built in: reduced-motion
reveals immediately, and anything already on screen at mount reveals at once
rather than waiting for an observation that may never arrive in a background
tab. `portal.css` also carries a `prefers-reduced-motion` block.

---

## 5. The Lounge, band by band

Five bands, alternating `p-tone-a` / `p-tone-b`, each with an oversized
watermark and an index number. Section ids are the anchors the header uses.

### 01 · Opening spread (no id, the route itself)
Asymmetric: type left, crest right, nothing centred and nothing boxed. Greets
`firstName`. Below it, **Today at the House** states three facts read off the
clock and the calendar, set as type on a rule rather than as metric boxes.

### 02 · Events (`#events`)
Five recurring weekly sessions, defined in the view:

| Day | Session | Time |
|---|---|---|
| Monday | Technical Session | 8:00 PM IST |
| Tuesday | Doubt Session | 8:00 PM IST |
| Thursday | Cultural Night | 8:00 PM IST |
| Friday | Sports and Fitness | 8:00 PM IST |
| Sunday | Talk with Senior | 8:00 PM IST |

`isToday` compares `new Date().getDay()`; an event is marked past after 22:00.
`nextEvent` picks the nearest session still to come by `(day - today + 7) % 7`,
skipping tonight's if it has finished, and `nextEventWhen` renders it as
"Tonight" / "Tomorrow" / the weekday name.

> **Placeholder:** every `GMEET_LINKS` value is
> `https://meet.google.com/placeholder-*`. These must be replaced with the real
> recurring links before the portal is useful to a member.

### 03 · Reading lounge (`#reading`)
Two rooms, English and Hindi, each with a genre that rotates by weekday
(`GENRES[new Date().getDay() % length]`). A countdown ticks to 21:30 daily;
`isNightOwlTime` is true between 21:00 and 23:00. One House book pick.

> **Placeholder:** both `NIGHT_OWL_LINKS` are placeholder Meet URLs.

### 04 · Community (`#community`)
The main House WhatsApp group, then one card per regional coordinator across
nine regions (Bengaluru, Chandigarh, Chennai, Delhi, Hyderabad, Kolkata,
Lucknow, Mumbai, Patna), alphabetical.

Two facts are kept apart on purpose: **the sign-up link belongs to the portal**
(`REGION_FORMS`), **who coordinates a region belongs to the roster**
(`src/data/council.js`, the same source Teams and Leaderboard render). A change
of coordinator reaches all three pages at once, and this view never keeps its
own copy of a name.

Mumbai has two coordinators, so it renders two cards and neither overwrites the
other. A region with no coordinator in the roster still renders, because its
group link exists and dropping the card would remove a way in; it says
"Coordinator to be announced" rather than borrowing a name.

### 05 · Recognition (`#recognition`)
A three-seat podium in reading order (second, first, third) and a full ranking.
The signed-in member's row is marked "You" by matching `member.roll === email`.

> **Placeholder:** `leaderboard` is five hardcoded names and point totals in the
> view. There is no points backend. `myStanding` is only rendered when the
> member is genuinely on that list, so a real member currently never matches.

---

## 6. Navigation

`PortalNav` carries three things and nothing else: where you are (crest), where
you can go (six words), who you are (account control). The active item is a
short gold rule under the word: no pill, no fill, no glow.

Items: Home, Events, Reading, Community, Leaderboard, Dashboard. The first five
are `/lounge` anchors that mirror the section ids exactly; the sixth is a route.

On `/dashboard` the active item is fixed. On `/lounge` it follows reading
position, so the header always names the room the member is in.

**Mobile** gets a bottom tab bar, `Teleport`ed to `<body>` because the router's
page transition would otherwise take it along when the view changes.

`PortalFooter` is deliberately not a sitemap: a member already inside needs a
signature, two links, the public site, and a way out.

---

## 7. The Dashboard

Four tabs, switched with `v-show` so widget state survives tab changes:

| Tab | Purpose | Widgets |
|---|---|---|
| Focus | Rhythm and rooms | StudyStreak, PomodoroRoom |
| Practice | Challenges and points | DailyChallenge, HousePoints |
| Community | Mood, wall and buddies | MoodWall, ConfessionWall, BuddyMatcher |
| Fun | House moments | MemeOfWeek |

Every widget takes its seed content as a prop from `src/data/dashboard.json`
and keeps its own state in `localStorage` via `useLocalStorage`'s `save`/`load`,
both try/catch wrapped so private mode degrades to defaults instead of throwing.

Keys in use: `sb_streak`, `sb_last`, `sb_best`, `sb_hist`, `sb_mood_date`,
`sb_mood_mine`, `sb_mood_tally`, `sb_confs`, `sb_conf_id`, `sb_conf_rx`,
`sb_ch_date`, `sb_ch_solved`, `sb_ch_solvers`, `sb_pomo_room`,
`sb_pomo_people`, `sb_meme_votes`.

Three widgets emit `confetti`, which the view forwards to `useConfetti` and
paints on a single full-viewport canvas.

> **Important:** all dashboard state is **per-browser, not per-member.** Nothing
> is shared, nothing syncs, and clearing site data resets it. The mood tallies,
> confession counts and solver counts are seeded numbers from
> `dashboard.json` plus the local member's own contribution. They are not real
> House-wide aggregates.

---

## 8. Sign-in, and the bypass currently in place

Intended flow in `LoginView.vue`:

1. Google Identity Services popup, using `VITE_GOOGLE_CLIENT_ID`
2. Decode the credential, take the email, normalise it (`trim().toLowerCase()`)
3. `GET ${VITE_MEMBERSHIP_CHECK_URL}?email=...`, an Apps Script over the council
   Sheet, and read `allowed` off the JSON
4. On approval, write that same normalised email to `localStorage.sundarbans_auth_token`
5. Push `/lounge`

The email is normalised once and the normalised form is what both the check and
the token use, so a member who signs in with different capitalisation is the
same member.

> **Live state:** a **temporary dev bypass is active.** `loginWithGoogle()`
> currently writes `sundarbans-sec@study.iitm.ac.in` straight to the token and
> navigates, with no Google popup and no Sheet check. The original OAuth block
> is preserved in comments directly beneath it.
>
> **To restore before production:** uncomment the OAuth block, delete the
> bypass block, and confirm both env vars are set. The steps are listed in the
> file at the `GOOGLE SIGN-IN & TEMPORARY DEV BYPASS` comment.

There is no session expiry and no refresh: the token is a plain email string in
`localStorage` and it is the whole session. It is a convenience gate over a
membership roster, not a security boundary; nothing behind it is secret.

---

## 9. Known gaps

Grouped so they can be picked up in order of consequence.

**Blocks real use**
- The dev login bypass (section 8)
- Seven placeholder Google Meet links across Events and Reading

**Fabricated content that should become real or go**
- The five-name leaderboard, which no real member can appear on
- Dashboard tallies that read as House-wide but are local

**Structural**
- No shared state: two members see different dashboards, and neither sees the
  other's contribution
- `houseBookPick` is a single hardcoded title

---

## 10. Working on the portal

- Everything is scoped under `.portal`, so no portal rule can reach a public
  page. Keep it that way.
- Take colour from the `--p-*` tokens; do not reintroduce raw hexes.
- New sections need an id that matches a `PortalNav` item, or they cannot be
  reached from the header.
- Content that belongs to the House (people, regions, events) should come from
  `src/data/`, not be declared in a view. Sections 5 gets this right for
  coordinators and wrong for the leaderboard.
- The public site's dark theme lock (`src/assets/theme-lock.css`) is loaded
  globally in `main.js` and applies here too.
