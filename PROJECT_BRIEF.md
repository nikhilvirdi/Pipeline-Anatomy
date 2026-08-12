# Pipeline Anatomy — Project Brief

## What This Is

An interactive, single-page web app that visualizes a CI/CD pipeline as a draggable node diagram. It is a supporting page for the GitHub repo `nikhilvirdi/CICD-pipeline-anatomy`, which contains structured markdown docs explaining a CI/CD pipeline in depth. The repo currently has a hand-made draw.io diagram exported as static PNG/HTML that doesn't render well on GitHub. This app replaces that static image with an interactive diagram.

## Purpose

Let users explore and learn the CI/CD pipeline diagram interactively instead of viewing a static PNG. The focus is entirely on interactivity — pan, zoom, drag nodes, inspect node details on hover/tap, and understand the flow. This page does not attempt to duplicate the documentation itself; the GitHub repo remains the full learning resource. This page is a visual companion to it.

## Scope — Deliberately Tight

- **Single page.** No routes, no navigation links, no multi-page structure.
- **No backend.** Fully static.
- **No auth.**
- **No CMS or database.** All content is sourced from local JSON/data files bundled with the build.
- Hosting: GitHub Pages, linked from the repo README.

## Stack (Locked)

- **React** — functional components + hooks
- **JavaScript** (not TypeScript)
- **React Flow** — diagram engine: draggable nodes, zoom/pan, fitView, custom node types, custom edges
- **Tailwind CSS** — all styling; theme toggle via `dark:` variants
- **Vite** — build tool / dev server
- **diagram-data.json** — single source of truth for nodes, edges, phases (already built, see `/data`)
- **node-cards.json** — tooltip content per node, keyed by node id (converted from 44 markdown cards)
- **GitHub Pages** — static hosting

## Core Interaction Model

- Diagram loads fit-to-view, fully visible, compact nodes.
- Ctrl+scroll (or pinch on touch) zooms into a pannable detail view.
- Nodes are freely draggable; the graph structure (edges) is immutable — users cannot detach or reconnect an edge to a different node.
- Hovering (desktop) or tapping (mobile) a node shows a tooltip/popup populated from `node-cards.json`.

See `UI_SPEC.md`, `NODE_TYPES.md`, `EDGE_RULES.md`, and `DIAGRAM_FIXES.md` for full detail specs before implementing.

## Out of Scope

- No editing of diagram structure by the end user (add/remove nodes or edges).
- No user accounts, saved state, or persistence across sessions.
- No content duplication from the repo's markdown docs beyond the short node-card blurbs used for tooltips.
