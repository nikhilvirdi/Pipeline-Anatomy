# Acceptance Criteria

Checklist form of every locked decision. Use this to verify nothing was dropped during implementation.

## Scope
- [ ] Single page, no routes, no nav links
- [ ] No backend, no auth, static build only
- [ ] Hosted on GitHub Pages

## Stack
- [ ] React (functional components + hooks), JavaScript (not TypeScript)
- [ ] React Flow for the diagram
- [ ] Tailwind CSS for all styling
- [ ] Vite build tool
- [ ] Data sourced from `diagram-data.json` + `node-cards.json`

## Diagram Correctness
- [ ] Phase 0 sequence present: ideation → architecture → tech-stack-locked-in → writing-the-code
- [ ] Execute Tests split into run-unit-tests → run-integration-tests
- [ ] Docker Hub split into package-container-image → push-image-docker-hub
- [ ] Run Smoke Tests/Health Check split into run-smoke-tests → run-health-check
- [ ] Pull-request-merged split resolved or explicitly left as single node (confirm with project owner — currently unresolved, see `DIAGRAM_FIXES.md`)
- [ ] No floating nodes — clean lanes per phase
- [ ] Pipeline Stops (CI + CD) same shape/color
- [ ] Post-Production Health Check rendered as decision (diamond), not rectangle
- [ ] Mirrored CI/CD pairs visually matched
- [ ] Docker Hub self-loop removed
- [ ] 5 dangling decorative lines removed
- [ ] Monitoring & Observability ↔ End Users edge is bidirectional
- [ ] Loop-back edges (developer-fixes-ci→commit-push-code, rollback→notify-developer-team) styled dashed + muted/red

## Layout & Navigation
- [ ] Default view: fit-to-view, compact, entire diagram visible on load
- [ ] Ctrl+scroll (desktop) / pinch (mobile) zooms into pannable detail view
- [ ] Default flow direction: left-to-right (desktop)
- [ ] Mobile flow direction: top-to-bottom
- [ ] Curved edges with appropriate arrowheads throughout

## Node Interaction
- [ ] Nodes freely draggable
- [ ] Edges cannot be detached/reconnected by the user (graph structure immutable)
- [ ] Connected edges auto-stretch/reroute as nodes move, staying attached to same endpoints
- [ ] Hover (desktop) / tap (mobile) shows tooltip populated from `node-cards.json`
- [ ] All 45 diagram nodes have a matching card entry

## Interactivity Features
- [ ] Click-to-focus: pan/zoom to node, dim unrelated nodes, highlight direct connections
- [ ] Path highlighting: hover highlights full upstream/downstream chain
- [ ] Phase filter/toggle to show/hide a phase
- [ ] Search/jump to node by name
- [ ] Minimap present
- [ ] Reset view button present
- [ ] Keyboard navigation between connected nodes

## Visual Design
- [ ] Glassmorphism aesthetic: transparent/translucent panels, subtle black accents
- [ ] Dark canvas with subtle dot-grid background pattern
- [ ] Node cards: dark, semi-transparent, soft border, rounded corners
- [ ] Accent color: electric green (~`#22c55e`) used consistently for active states
- [ ] Light/dark theme toggle implemented across all UI chrome
- [ ] Theme-dependent icons swap correctly (GitHub logo light/dark)

## Floating Toolbar
- [ ] Vertical pill shape, dark translucent, icon-only buttons
- [ ] Default position: left, vertical
- [ ] Repositionable to all 4 edges (top/bottom = horizontal layout, left/right = vertical layout)
- [ ] Repositioning works via dedicated button (tap to cycle/snap)
- [ ] Repositioning works via drag-to-snap
- [ ] Contains: search, theme toggle, reset view, phase filter, minimap toggle

## Mobile Behavior
- [ ] Toolbar auto-docks to top on small screens
- [ ] Diagram flow switches to top-to-bottom
- [ ] Tap-to-show/tap-elsewhere-to-dismiss tooltip pattern
- [ ] Smooth blur/fade zoom transition focusing the explored area

## Icons
- [ ] All node-to-icon mappings applied per `NODE_TYPES.md`
- [ ] Multi-tool nodes (local-testing, monitoring-observability) show icon clusters
- [ ] CI/CD system nodes default to GitHub Actions icon
