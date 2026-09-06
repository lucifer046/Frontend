# Reference: Past Events reel

**Read this before touching the reel, `/events`, or the homepage Memories band.**
Internal doc. State what is true.

---

## Files

```
src/components/events/PastEventsReel.vue   the component, both variants
src/assets/reel.css                        imported BY the component, travels with it
src/data/events.js                         upcoming + archive, one source
src/views/EventsView.vue                   /events, uses variant="archive"
src/views/HomeView.vue                     homepage, uses variant="compact"
src/assets/events.css                      events page styles (ev- namespace)
e2e/past-events-reel.spec.js               5 behavioural tests
```

**One implementation, two pages.** `reel.css` is imported by the component itself, so mounting it
anywhere brings its styles. Do not add reel CSS to a page stylesheet.

## The loop

The track holds the archive **twice** and slides exactly `-50%`, linear, infinite:

```css
@keyframes reel-scroll { from { translate3d(0,0,0) } to { translate3d(-50%,0,0) } }
```

At the end of a cycle the frame under any pixel is the one that was already there, so the restart
is invisible. One keyframe pair, no timer, no rAF, no JS animation.

**Both variants run the complete archive.** Do not shorten the homepage list: a set narrower than
the viewport leaves a gap at the seam, and closing it would mean measuring and repeating at runtime.
The compact variant shrinks the frames instead.

Duration is derived: `events.length * secondsPerFrame` (default 4.5s), so adding events lengthens
the reel rather than speeding it up.

## Variants

Four custom properties are the entire difference. Declared on `.reel` / `.reel--compact`.

| Property | archive | compact | What it is |
|---|---|---|---|
| `--reel-rz` | `-8deg` | `-6deg` | the slash across the page |
| `--reel-rx` | `18deg` | `14deg` | tilt into depth, which bends the slash |
| `--reel-w` | `300px` | `230px` | poster width |
| `--reel-h` | `clamp(26rem,56vw,52rem)` | `clamp(23rem,39vw,38rem)` | window height |

Breakpoints restate these; the hovered frame's counter-rotation negates them automatically, so
changing a breakpoint needs no other edit.

## The geometry

- `.reel-stage` owns `perspective` and `overflow: hidden`. This is why a strip wider and taller
  than the viewport can never push the page sideways.
- `.reel-plane` carries `rotateZ(var(--reel-rz)) rotateX(var(--reel-rx))` and `preserve-3d`.
- A hovered frame lifts with
  `translateZ(70px) rotateX(calc(-1 * var(--reel-rx))) rotateZ(calc(-1 * var(--reel-rz)))`,
  which **undoes the plane's rotation** so the held frame squares up to the reader while every
  frame around it stays in the reel.
- Sprocket holes are `::before`/`::after` on each **frame**, not on the window, so they travel with
  the film.

## Interaction

| Input | Behaviour |
|---|---|
| Mouse enter a poster | `hold()` — pauses track, opens that frame's detail |
| Mouse leave | `release()` |
| Mouse click | **ignored** (`pointerType === 'mouse'` returns early) so a click cannot close a hover |
| Touch tap | toggles: opens, taps again to close |
| Keyboard focus | `focusin` holds, `focusout` releases |
| Escape | releases |

State is a single `heldKey`. Clone frames get `tabindex="-1"` and `aria-hidden="true"`.

## Pausing when off-screen

One `IntersectionObserver` with `rootMargin: '100% 0px'` toggles `reel--idle`, which pauses the CSS
animation. The homepage carries a reel below the fold; running film nobody is looking at is waste.
No polling, no rAF.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` in `reel.css`: animation off, plane un-rotated, clones
`display: none`, stage becomes `overflow-x: auto`. The strip becomes a hand-scrollable row of the
21 real posters with details still reachable on hover/focus. **Do not hide the reel instead.**

## Data

`src/data/events.js`:

- `upcomingEvents` — currently empty. An entry with `featured: true` claims the highlight slot,
  otherwise the earliest `dateISO` wins
- `pastEvents` — the archive, newest first
- `splitEvents()` — moves an upcoming entry whose `dateISO` has passed into the front of the archive
  at runtime, so the page never advertises a past event
- `FALLBACK_EVENT_IMAGE` — used on missing or failed images, so a broken-image glyph never appears

Both pages call `splitEvents()`. A test asserts the two routes render an identical 21-title archive.

## Content rule in force

The owner's rule: **no em dashes, no emoji** in events/documents copy. Eleven archive titles were
converted from `—` to `:` when this landed. Keep it.

## Gotcha

Playwright's `hover()` waits for an element to stop moving, which a continuously scrolling reel
never does. Tests point the mouse at a poster's box and retry instead. If you write a new reel test,
do the same.
