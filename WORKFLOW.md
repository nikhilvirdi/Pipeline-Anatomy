# Build Workflow — Phases

Sequenced implementation plan for Antigravity. Each phase should be completable and checkable before moving to the next. Reference the linked doc for full detail at each step.

## Phase 1 — Scaffold

- Init Vite + React (JavaScript) project under `src/`
- Install: `reactflow`, `tailwindcss`, plus postcss/autoprefixer
- Set up `tailwind.config.js` with tokens from `THEME_TOKENS.md`
- Basic `App.jsx` rendering an empty React Flow canvas, full viewport
- **Check**: dev server runs, blank canvas renders

## Phase 2 — Data Wiring

- Import `diagram/diagram-data.json` and `node-cards.json` into the app
- Write a small transform util: diagram-data nodes/edges → React Flow's `nodes`/`edges` shape
- Render nodes as default React Flow boxes (no custom styling yet) just to confirm structure and connections are correct
- **Check**: all 45 nodes appear, all edges connect correctly, matches `DIAGRAM_FIXES.md` corrections (no dangling lines, no self-loop, PR-merge decision resolved per current JSON state)

## Phase 3 — Custom Node & Edge Components

- Build node components per `NODE_TYPES.md`: `ProcessNode`, `DecisionNode`, `TerminalNode`, `ActorNode`
- Build `CurvedEdge` component per `EDGE_RULES.md` (curved, labeled, loop-back dashed/red variant)
- Wire icons per the icon-to-node mapping table
- **Check**: shapes match notation, mirrored CI/CD pairs visually match, loop-back edges visually distinct

## Phase 4 — Visual Theme

- Apply glassmorphism styling to node cards (blur, translucency, border, radius)
- Add dot-grid canvas background
- Implement light/dark theme toggle (context or simple state), verify all chrome respects it
- Swap theme-dependent icons (GitHub logo) on toggle
- **Check**: matches `UI_SPEC.md` visual style and `THEME_TOKENS.md` values in both themes

## Phase 5 — Core Interactions

- Default fit-to-view on load, compact nodes
- Ctrl+scroll / pinch zoom into pannable detail view
- Draggable nodes with edges auto-updating; disable edge reconnect/detach
- Hover/tap tooltip using `node-cards.json` content
- **Check**: matches immutability rules in `EDGE_RULES.md`, tooltip content correct per node

## Phase 6 — Floating Toolbar

- Build toolbar shell (pill shape, icon buttons, default left/vertical position)
- Implement reposition: dedicated button (tap-to-cycle) + drag-to-snap to any of 4 edges
- Wire in: theme toggle, reset view button (stub other icons if their features aren't built yet)
- **Check**: toolbar docks correctly to all 4 edges via both interaction methods, horizontal/vertical layout switches correctly

## Phase 7 — Advanced Interactivity

- Click-to-focus: pan/zoom to node, dim unrelated, highlight direct connections
- Path highlighting: hover highlights full upstream/downstream chain
- Phase filter/toggle
- Search/jump to node
- Minimap (React Flow's built-in, styled to match theme)
- Keyboard navigation between connected nodes
- **Check**: every item in the "Interactivity Features" section of `ACCEPTANCE_CRITERIA.md`

## Phase 8 — Responsive / Mobile

- Layout direction switch: LTR (desktop) → TTB (mobile), recompute node/edge positions or handle orientation
- Toolbar auto-docks to top on small screens
- Tap-to-show/tap-elsewhere-to-dismiss tooltip on touch
- Smooth blur/fade zoom transition (depth-of-field effect)
- **Check**: test at common breakpoints, verify no desktop-only interaction (hover, ctrl+scroll) is the only way to access a feature

## Phase 9 — Polish & QA

- Full pass against `ACCEPTANCE_CRITERIA.md`, check every box
- Verify all 45 nodes have correct tooltip content, no placeholder text remains
- Confirm no console errors, no broken edges after repeated drag operations
- Cross-browser check (Chrome, Firefox, Safari at minimum)
- **Check**: acceptance criteria fully satisfied

## Phase 10 — Deploy

- Build production bundle (`npm run build`)
- Deploy to GitHub Pages
- Link from the docs repo README
- **Check**: live URL loads correctly, diagram fully functional in production build (not just dev server)

---

## Notes for the Agent

- Don't skip ahead to polish (Phase 9) before core interactions (Phase 5) work — animation/theme work on top of broken interaction logic wastes effort when the underlying behavior changes later.
- If a locked decision is ambiguous or missing (e.g. the unresolved pull-request-merged split noted in `DIAGRAM_FIXES.md`), flag it rather than guessing — check with the project owner before proceeding past that node in Phase 2.
- Treat `diagram-data.json` and `node-cards.json` as read-only source data; don't hardcode node content into components.
