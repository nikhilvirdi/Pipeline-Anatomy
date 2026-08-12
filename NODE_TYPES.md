# Node Types — Shape & Icon Mapping

## Diagram Notation (Flowchart Standard)

| Shape | Meaning | JSON `shape` value | React Flow custom node |
|---|---|---|---|
| Rectangle | Process/action step | `rect` | `ProcessNode` |
| Diamond | Decision point | `decision` | `DecisionNode` |
| Stadium (rounded pill) | Start/end/terminal event | `circle` * | `TerminalNode` |
| Parallelogram | Input/output | — (none currently used) | `IONode` (reserve for future use) |
| Cylinder | Data store | — (none currently used) | `DataStoreNode` (reserve for future use) |
| Person icon | Actor | `actor` | `ActorNode` |

\* Nodes marked `circle` in `diagram-data.json` (`pipeline-stops-ci`, `pipeline-stops-cd`, `notify-team-success`) represent terminal/end events per the original notation intent. Render them as the **stadium** shape (rounded pill), not a literal circle, to stay consistent with the stated shape notation (stadium = start/end).

## Decision Nodes

Per `decisionPoints` in `diagram-data.json`, these 5 nodes are decisions and must use `DecisionNode` (diamond):

- `fail`
- `task-failed`
- `manual-approval-gate`
- `all-checks-pass`
- `post-production-health-check` (drawn as rectangle in the original source — corrected here; see `DIAGRAM_FIXES.md`)

Decision nodes must explain both branches inline in their hover card (per `node-cards.json` content).

## Mirrored Pair Styling

Mirrored CI/CD pairs must share identical shape + color treatment:

- `pipeline-stops-ci` ↔ `pipeline-stops-cd`
- `developer-fixes-ci` ↔ `developer-fixes-cd`
- `notify-team-success` ↔ `notify-developer-team`

## Icon-to-Node Mapping

Icons live in `/assets/logos/`. Theme-dependent icons swap on theme toggle (see `UI_SPEC.md`).

| Node id | Icon(s) |
|---|---|
| `developer` | `developer.png` |
| `writing-the-code` | `git.webp` (git operations context) |
| `local-testing` | `eslint.png`, `prettier.png`, `jest.webp` (icon row — multiple tools represented in one node) |
| `commit-push-code` | `git.webp` |
| `github` | `githubLogoLightTheme.png` (shown in dark mode) / `githubLogoDarkTheme.png` (shown in light mode) |
| `ci-system` | `githubactions.png` (default/primary icon — node also represents Jenkins/GitLab per card content; consider secondary icons or a small "+2" indicator on hover) |
| `cd-system` | `githubactions.png` (same tool-agnostic treatment as `ci-system`) |
| `package-container-image`, `push-image-docker-hub` | `docker.png` |
| `monitoring-observability` | `Prometheus.webp`, `grafana.png`, `datadog.png` (icon cluster — three tools represented in one node) |

Nodes without a specific icon render as plain shape + label (no icon slot needed) — this covers the majority of process/decision nodes not listed above.

## Custom Node Component Requirements

- Each custom node type accepts: `label`, `phase` (for phase-based coloring/filtering), `icon(s)` (optional), and connection handles positioned per flow direction (right-side output / left-side input for LTR desktop; bottom output / top input for TTB mobile).
- Node cards are glassmorphic per `UI_SPEC.md` — apply consistently across all node types, not just the process rectangles.
- Decision nodes render branch labels (Yes/No, Approved/Rejected, Pass/Fail) directly on their outgoing edges — see `EDGE_RULES.md`.
