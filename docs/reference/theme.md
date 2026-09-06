# Reference: Colour system and the dark theme lock

**Read this before adding or changing any colour.**
Internal doc. State what is true.

---

## Files

```
src/assets/style.css        the tokens (:root block at the top)
src/assets/theme-lock.css   the lock. Imported LAST in main.js
index.html                  three head signals
e2e/theme-lock.spec.js      guards all of the above
```

## The rule

**The site has one theme. There is no light mode and no toggle.** Never add a
`prefers-color-scheme: light` block, never add a theme switcher.

Take colour from a token. Do not write a raw hex in a component when a token exists.

## Tokens

Declared once on `:root` in `style.css`. Legacy aliases (`--bg`, `--text`, `--accent`) point at the
semantic names, so there is a single source.

| Token | Value | Role |
|---|---|---|
| `--color-bg-black` | `#050605` | tone A, the page |
| `--color-bg-forest` | `#060907` | tone B, alternating band |
| `--color-bg-footer` | `#000000` | footer only |
| `--color-card` | `#070b09` | card surface |
| `--color-card-raised` | `#0c110e` | nested well |
| `--color-cream` | `#f1e8d0` | primary ink |
| `--color-cream-muted` | `#c7bda3` | secondary ink |
| `--color-cream-faint` | `#8e7e5d` | tertiary ink |
| `--color-gold` | `#d5a63a` | accent |
| `--color-gold-light` | `#e9c873` | accent, lit |
| `--color-gold-muted` | `#a97c22` | antique gold, quiet rules |

Borders are one family in four weights (`--border-subtle` to `--border-gold`). A card is separated
from the page by its **hairline, not its fill**: the surfaces are within a few points of each other
on purpose.

### Contrast floor

`--color-cream-faint` was `#6e6248` and measured **3.2 to 3.5:1** against the page tones, failing
WCAG AA for body text before any extension was involved. It is now `#8e7e5d`: same hue (41deg) and
saturation (21%), lifted only until it cleared 4.5:1 on every ground (worst case 4.80:1 on the
raised card).

**Any new ink token must clear 4.5:1 against `--color-card-raised`**, which is the lightest ground.
Check it before shipping; there is a contrast audit pattern in the session log for 2026-09-06.

## The lock

`theme-lock.css` contains **no new design decisions**. Every value is a token restated where a
colour can otherwise be lost. It loads last, which is why it needed **no `!important` anywhere**.

What it does:

1. **`color-scheme: dark`** on `:root`, `html` and all form controls. This is what stops Chrome's
   own auto-dark pass and what makes native scrollbars, spellcheck and widgets render dark.
2. **Restates the pair.** An audit found 40 selectors painting an opaque background while
   inheriting their text colour. That is the exact path by which one rewritten ancestor turns every
   card dark-on-dark. The 20 text-bearing ones now restate `color`.
3. **Form controls**: explicit background, colour, border, caret, `::placeholder`, `accent-color`,
   and a `-webkit-autofill` override (Chrome paints autofilled fields pale and ignores
   `background-color`; the inset-shadow trick is the documented fix).
4. **`::selection`**, which is otherwise a system blue belonging to no part of the palette.
5. **Media**: `forced-color-adjust: none` on `img/video/picture/canvas` so Windows High Contrast
   keeps a photograph a photograph. Text and controls are left to the OS palette on purpose.
6. **`@media (forced-colors: active)`**: restates borders in system colours, since borders are the
   site's main separator and the first thing to vanish there.

## Head signals

```html
<meta name="color-scheme" content="dark" />
<meta name="theme-color" content="#050605" />
<meta name="darkreader-lock" />
```

`darkreader-lock` is **Dark Reader's own published opt-out** for sites that already ship a dark
theme. It asks the extension to stand down.

**Never detect, block, or interfere with an extension.** The defence is to leave no colour unstated,
plus these cooperative signals. That is the whole strategy.

## When you add a surface

If a new component paints its own opaque background and contains text:

1. Use tokens for both the background and the colour.
2. If it relies on inherited text colour, **add its selector to the restatement block** in
   `theme-lock.css` rather than adding `!important` locally.

## Deliberate exceptions

Do not "fix" these:

- `.dv-iframe` has a **white** background. It is Google's own document paper, by design. The
  no-light-surface test excludes `.dv-frame` for this reason.
- Three text inputs are transparent (`#searchInput`, `.fsubscribe-input`, `.vc-input`). They are
  bare fields inside styled wrappers and each already states an explicit `color`. Forcing a
  background puts a rectangle inside a rounded pill.
- Ghost and outline buttons are transparent on purpose.

## Guard

`e2e/theme-lock.spec.js` asserts the three head signals, that `html` and `body` each paint both a
background and a colour, and sweeps 11 routes for any surface over 12000px squared with a
background luminance above 0.5. Run it after any colour change.
