# Pipeline Anatomy — Interactive Diagram

An interactive, single-page visualization of a CI/CD pipeline, built to replace the static PNG diagram in [`nikhilvirdi/CICD-pipeline-anatomy`](https://github.com/nikhilvirdi/CICD-pipeline-anatomy). This app exists purely to let you explore the diagram — pan, zoom, drag nodes, inspect details — instead of viewing a flat image. The full written explanations live in the linked docs repo; this is a visual companion, not a duplicate of that content.

## What it does

- Renders the full CI/CD pipeline — Local Development → Continuous Integration → Continuous Delivery/Deployment → Production — as a draggable, zoomable node diagram.
- Hover (or tap, on mobile) any node for a short explanation of what it does and why it matters.
- Nodes can be freely repositioned; the underlying connections are fixed and can't be rewired.
- Filter by phase, search for a node by name, or click a node to focus on its direct flow.

## Stack

- React (JavaScript) + Vite
- React Flow
- Tailwind CSS

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static build suitable for GitHub Pages.

## Project structure

See `FOLDER_STRUCTURE.md`.

## Data sources

- `diagram/diagram-data.json` — node positions, edges, phase groupings
- `node-cards.json` — tooltip content per node (compiled from `node-cards/*.md`)

## Reference docs

Full spec and locked decisions behind this build:

- `PROJECT_BRIEF.md` — scope and stack
- `UI_SPEC.md` — UI/UX decisions
- `THEME_TOKENS.md` — concrete color/spacing/typography values
- `DIAGRAM_FIXES.md` — corrections applied vs. the original hand-made diagram
- `NODE_TYPES.md` — shape and icon mapping
- `EDGE_RULES.md` — edge behavior and styling rules
- `ACCEPTANCE_CRITERIA.md` — checklist of everything this build must satisfy

## License

Same as the parent docs repo (confirm/add license if not already set).
