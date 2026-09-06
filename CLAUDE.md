# Agent entry — Sundarbans House

BEFORE doing anything in this repo:

1. Read `docs/STATE.md`. It carries the hard constraints, what is blocking production, and a table
   telling you which further doc your task needs.
2. Read only the doc that table points at. Do not scan the repo blindly; the docs exist so you
   do not have to.

`docs/INDEX.md` is the full map if `STATE.md` does not cover your task.

## Subsystem references

Read the matching one before touching that area:

| Area | Doc |
|---|---|
| `/login` `/lounge` `/dashboard` | `docs/reference/members-lounge.md` |
| `/documents` and the reader | `docs/reference/document-library.md` |
| `/events` and the Past Events reel | `docs/reference/events-reel.md` |
| Colours, tokens, the dark theme lock | `docs/reference/theme.md` |

## Also

- Rules for adding routes, components, data files, CSS: `docs/conventions.md`
- Why something is the way it is: `docs/decisions.md` (append-only; never edit an entry)
- Complex features are planned in `docs/specs/` (see `/spec`)

## The docs are internal

They are for the owner and for you, not for publication. Write them accordingly: record what is
actually true, including what is broken, temporary, or a placeholder. Do not soften it.

At the END of a work session run `/checkpoint`: rewrite `docs/STATE.md`, append to
`docs/decisions.md`, add `docs/sessions/YYYY-MM-DD.md`.
