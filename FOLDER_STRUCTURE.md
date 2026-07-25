# Folder Structure

Reflects the actual current repo layout (confirmed from the project explorer), not an idealized proposal.

```
pipeline-anatomy/
├── cicd-pipeline-anatomy/            # reference copy of the docs repo content
│   ├── Continuous Delivery-Deployment.md
│   ├── Continuous Integration.md
│   ├── Deployment Strategies.md
│   ├── Local Development.md
│   ├── Production and Observability.md
│   ├── Tooling Landscape.md
│   └── What is CI-CD pipeline.md
│
├── diagram/
│   └── diagram-data.json             # nodes, edges, phases — single source of truth
│
├── icons/
│   ├── datadog.png
│   ├── developer.png
│   ├── docker.png
│   ├── eslint.png
│   ├── git.webp
│   ├── githubactions.png
│   ├── githubLogoDarkTheme.png
│   ├── githubLogoLightTheme.png
│   ├── gitlab.png
│   ├── grafana.png
│   ├── jenkins.png
│   ├── jest.webp
│   ├── prettier.png
│   └── Prometheus.webp
│
├── node-cards/                       # per-node markdown source files (44 files)
│   └── *.md
│
├── node_modules/                     # Vite/React deps already installed
│
├── ACCEPTANCE_CRITERIA.md
├── DIAGRAM_FIXES.md
├── EDGE_RULES.md
├── NODE_TYPES.md
├── node-cards.json                   # compiled from node-cards/*.md — tooltip data source
├── PROJECT_BRIEF.md
├── UI_SPEC.md
├── THEME_TOKENS.md
├── FOLDER_STRUCTURE.md               # this file
├── README.md
│
└── src/                              # to be scaffolded — not yet present
    ├── data/                         # will likely re-export or import diagram/ and node-cards.json
    ├── components/
    │   ├── DiagramCanvas.jsx
    │   ├── nodes/
    │   ├── edges/
    │   ├── NodeTooltip.jsx
    │   └── Toolbar/
    ├── hooks/
    ├── utils/
    ├── styles/
    ├── App.jsx
    └── main.jsx
```

## Notes

- `icons/` filenames are as-uploaded (mixed case, "Logo"/"Theme" suffixes) — keep as-is or rename for cleanliness before importing into components; either works, just be consistent once decided.
- `node-cards/` (the folder of individual `.md` files) is the authoring source; `node-cards.json` at root is the compiled, code-facing version the app actually imports. Keep both — don't delete the `.md` originals.
- `diagram/diagram-data.json` is nested one level, unlike the flatter proposal — component imports should reference `diagram/diagram-data.json`, not `data/diagram-data.json`.
- `src/` doesn't exist yet — this is the next scaffolding step for Antigravity to generate, following `NODE_TYPES.md` and `EDGE_RULES.md` for component breakdown.
