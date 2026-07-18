@PROJECT.md
@workplan.md

# Working Notes for Claude Code

This file adds technical/dev detail on top of `PROJECT.md` (scope, features, constraints) and `workplan.md` (execution order), both imported above. Don't restate or contradict either here — if something's unclear, that's a reason to ask, not assume.

## Execution Discipline

Work through `workplan.md` in order, one phase at a time. Do not start a phase before the previous one is verified done against its own "Done when" line. Do not pull work from a later phase into an earlier one, even if it would be more convenient to do it now. Phase 1 is complete; `diagram/diagram-data.json` exists. Start from Phase 2.

## Language

Plain JavaScript. Not TypeScript. Compensate for the lost type-checking with:
- JSDoc annotations (`@param`, `@returns`) on non-trivial functions.
- ESLint on strict settings: `eslint-plugin-react-hooks`, `no-unused-vars` as an error, `eslint-plugin-jsx-a11y` for the accessibility requirements already in `PROJECT.md` (keyboard support).

## Stack

React + Vite. `xyflow` (React Flow) for the diagram itself — nodes, edges, pan/zoom, drag. `motion` (Framer Motion) for the custom animations (build-up sequence, decision branch playback, orientation transition) that xyflow doesn't handle natively. Tailwind CSS for styling. Zustand for shared state (theme, orientation, animation playback, drag positions). `react-markdown` + `remark-gfm` for rendering node-card and doc content. Vitest for light logic-level tests. Prettier + ESLint for formatting/linting.

Typeface: **Source Serif 4**, self-hosted (not a CDN link to Google Fonts, to keep the app working offline and avoid an external font request). Use it for headings and body text per `PROJECT.md`'s Design Constraints.

## Repo Scope

This is `pipeline-anatomy`, the codebase repo. It is not the docs repo (`CICD-pipeline-anatomy`) — don't duplicate doc prose into this repo beyond what's already in `node-cards/` and `cicd-pipeline-anatomy/` (see below).

`cicd-pipeline-anatomy/` at repo root is a local, reference-only copy of the docs repo's prose. Use it to write any doc-derived content faithfully, but don't treat it as something to render directly in the app or ship in the build — it's there for you to read, not for the bundler to include. It can drift from the live docs repo (filenames already lost their numeric prefixes) without needing to be kept in sync.

## Content Folder

`node-cards/` — one Markdown file per node, filename = kebab-case node slug (e.g. `checkout-source-code.md`, `manual-approval-gate.md`). Plain prose, no frontmatter, no heading. This is the resolved, locked source for hover-card content — build-time, not fetched at runtime. Don't write a sync/fetch script for this; the files are already hand-authored and checked in.

## Diagram Data

`diagram/diagram-data.json` is the resolved output of Phase 1: nodes, edges, decision points, phase groupings, and the five floating notes, derived from the draw.io XML with all corrections documented inline via each item's `source` and `note` fields. Read from this file directly. Don't re-parse the XML or invent nodes/edges — if something seems to be missing from the JSON, ask rather than adding it. One item flagged inside the JSON is still an open decision, not yet resolved: see Open Decision Still Live below.

## Open Decisions Still Live

Two, both need resolving before the phases that touch them:

1. Phase 4 (Navigation and Doc Links) depends on a decision `PROJECT.md` doesn't resolve: whether phase/nav links open documentation inside this app or out to `CICD-pipeline-anatomy` on GitHub. `workplan.md` states a working assumption (external link). Confirm it's still correct before building Phase 4, don't just proceed on the assumption silently.
2. `diagram-data.json` draws Monitoring & Observability → End Users as one-directional, matching the source XML. `PROJECT.md` describes it as bidirectional. Whichever is intended, fix the other to match before Phase 2 builds this edge — don't build one and leave the docs contradicting it.

## Commands

Standard Vite project commands apply: `npm run dev`, `npm run build`, `npm run lint`, `npm run test`. Confirm these match `package.json` once it exists rather than assuming.

## Behavioral Notes

- Don't add features, steps, or nodes beyond what's in `PROJECT.md`'s Features, Diagram Structure, Rejected, and On Hold sections. Rejected and On Hold are both deliberate — neither is an invitation to reconsider unasked.
- Scope creep is a known failure mode on this project specifically. `workplan.md`'s small phases exist to catch it early — respect the phase boundaries even when a shortcut looks tempting.
- Ambiguity in `PROJECT.md` or `workplan.md` is a reason to ask, not a reason to guess. A wrong structural assumption here means redoing layout, animation, and orientation-transition work downstream.