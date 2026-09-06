# Docs index

**Audience: the owner and any AI agent working in this repo. Nothing here is public.**
Write bluntly. Record what is actually true, including the broken and the temporary.

Read `STATE.md` first, always. Come here to find what else to open.

---

## Route by task

Find the row that matches what you were asked to do. Read only those files.

| You were asked to | Read, in order |
|---|---|
| Anything at all | `STATE.md` |
| Touch `/login`, `/lounge`, `/dashboard` | `reference/members-lounge.md` |
| Touch `/documents` or the reader | `reference/document-library.md` |
| Touch `/events` or the reel | `reference/events-reel.md` |
| Add or change a colour | `reference/theme.md` |
| Add a route, component or data file | `conventions.md` |
| Understand why something is the way it is | `decisions.md` |
| Change something a spec covers | `specs/` |
| Know what happened on a given day | `sessions/` |

## Everything, by file

| File | What it is | Shape |
|---|---|---|
| `STATE.md` | Current state, what is next, hard constraints, gotchas | Rewritten each checkpoint |
| `INDEX.md` | This file | Rewritten when the map changes |
| `conventions.md` | The rules for working in this repo | Rewritten when a rule changes |
| `decisions.md` | Why load-bearing choices were made | **Append only.** Never edit or delete an entry |
| `reference/` | One deep dive per subsystem | Rewritten when the subsystem changes |
| `specs/` | Numbered plans for complex features (`/spec`) | Per feature |
| `reports/` | Audit artifacts and evidence | Dated, immutable |
| `sessions/` | One log per working day | **Append only.** One file per date |
| `old_context.md` | Pre-tracking backstory, reconstructed at adoption | Historical, do not update |
| `../CONTEXT.md` | Domain glossary: people, roles, content lifecycle | As needed |

## Reference docs

| File | Covers |
|---|---|
| `reference/members-lounge.md` | The private portal: guarding, identity, tokens, the five lounge bands, the dashboard widgets, sign-in, known gaps |
| `reference/document-library.md` | `/documents`: the dataset, the five viewer strategies and which URLs each was verified against, the index and reader |
| `reference/events-reel.md` | The Past Events film reel: the loop, the geometry, the two variants, hover and reduced motion |
| `reference/theme.md` | The colour system and the dark theme lock |

## Specs and reports

| File | Covers |
|---|---|
| `specs/001-codebase-overhaul.md` | Spec 001 goals, phases, constraints |
| `specs/001-tickets.md` | Spec 001 ticket board (T-01 to T-29), closed |
| `reports/sundarbans-rag-chatbot-audit-2026-09-03.md` | Live RAG chatbot audit + graph-ready CSV |

---

## Writing rules for these docs

- **State what is true, not what was intended.** A placeholder is a placeholder.
- **Mark what was verified and how.** "Measured 3.3:1" beats "looked low".
- **Paths, not descriptions.** An agent can open `src/data/events.js`; it cannot open "the events data".
- **Say the constraint, not the wish.** "Never bulk-reformat" is actionable; "keep diffs clean" is not.
- **Do not write prose an agent has to parse.** Tables and short imperatives.
