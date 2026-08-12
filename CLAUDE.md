# CLAUDE.md

Context file for Claude Code working in this repo. Read this first, every session.

## What this project is

A single-page, interactive React app that visualizes a CI/CD pipeline as a draggable, zoomable node diagram (React Flow). It replaces a static PNG diagram in a companion GitHub docs repo (`nikhilvirdi/CICD-pipeline-anatomy`). Pure frontend — no backend, no auth, no routing, one page only.

## Stack

React (JavaScript, not TypeScript) + React Flow (`@xyflow/react`) + Tailwind CSS + Vite.

## Source of truth — do not hardcode content

- `diagram/diagram-data.json` — all node/edge/phase structure and positions
- `node-cards.json` — tooltip content per node, keyed by node id

Never hardcode node labels, positions, or tooltip text into components. Read from these files.

## Reference docs (read before making design decisions)

- `PROJECT_BRIEF.md` — scope and constraints
- `DIAGRAM_FIXES.md` — corrections applied vs. the original hand-drawn diagram (explains why the data doesn't match old screenshots)
- `NODE_TYPES.md` — shape-to-component mapping, icon-to-node mapping
- `EDGE_RULES.md` — edge immutability rules, curve style, loop-back styling
- `UI_SPEC.md` — all locked UI/UX decisions (glassmorphism, toolbar, theme, interactions, mobile behavior)
- `THEME_TOKENS.md` — concrete color/spacing/typography values — use these exact values, don't approximate
- `FOLDER_STRUCTURE.md` — intended repo layout
- `WORKFLOW.md` — the phased build plan this project follows. Check this to see what phase is current.
- `ACCEPTANCE_CRITERIA.md` — full checklist of what "done" means for the whole project

## Build status

Phases 1–8 of `WORKFLOW.md` are complete (scaffold, data wiring, custom node/edge components with icons, full glassmorphism theme with dark/light toggle, core interactions, floating toolbar, advanced interactivity, and responsive/mobile — LTR↔TTB layout switch, toolbar auto-dock, touch tap interactions, depth-of-field zoom). Phase 9 (polish & QA) is next. Check `WORKFLOW.md` and recent git history for the current phase before starting new work.

## Established conventions — follow these, don't reinvent

- Theme state lives in `src/context/ThemeContext.jsx` (React context). Any new themed component consumes this, doesn't create its own theme logic.
- Custom node components live in `src/components/nodes/` — one file per shape type (`ProcessNode`, `DecisionNode`, `TerminalNode`, `ActorNode`).
- Custom edge component: `src/components/CurvedEdge.jsx`.
- Data transform: `src/utils/transformDiagramData.js` converts `diagram-data.json` into React Flow's `nodes`/`edges` shape. Extend this rather than writing a second transform path.
- Icon mapping: `src/utils/iconMap.js`, includes theme-aware swapping (e.g. GitHub logo light/dark).
- Tooltip: `src/components/NodeTooltip.jsx`, reads from `node-cards.json`.
- Layout direction: `src/utils/verticalLayout.js` recomputes node positions for the top-to-bottom mobile layout (it does not rotate the LTR coordinates — see the comment in that file for why). `transformDiagramData` takes an `orientation` argument and emits matching `sourcePosition`/`targetPosition`; node components read `data.orientation` via `src/utils/handlePositions.js`. Breakpoint lives in `src/hooks/useMediaQuery.js`.
- Graph structure is immutable by design: `edgesReconnectable={false}`, `edgesFocusable={false}`, `connectOnClick={false}`, and node handles use `isConnectable={false}`. Do not relax these — dragging nodes is allowed, rewiring edges is not.

## Working style expectations

- Run the dev server and actually test interactive behavior (drag, dock, hover, click) rather than reporting untested assumptions.
- Match existing file organization and naming patterns instead of introducing new structure.
- If a locked decision in the docs is ambiguous or conflicts with something already built, flag it and ask rather than guessing.
- Stop at phase check gates (defined in `WORKFLOW.md`) and report status rather than continuing into the next phase unprompted.
