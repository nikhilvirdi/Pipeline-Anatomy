# Diagram Fixes — Issues & Solutions

The original hand-made draw.io diagram (`CICDPipeline.png` in the repo) has known issues. `diagram-data.json` already reflects most of these corrections — this doc exists so the agent builds from the *corrected* model, not the raw original image, and understands why each correction was made.

## 1. Wrong Shapes / Visual Inconsistencies

| Issue | Fix |
|---|---|
| "Pipeline Stops" is a circle on the CI side, a rectangle on the CD side | Use one consistent shape (stadium/circle) for both instances |
| "Post-Production Health Check" drawn as a rectangle, but functions as a decision (has a Fail branch) | Redraw as a diamond (decision shape) |
| CI-side and CD-side mirrored pairs (developer-fixes-ci/cd, notify-team nodes, pipeline-stops-ci/cd) are not visually matched | Use the same shape and color for each mirrored pair |
| Nodes float inconsistently above/below the main flow line | Redraw on clean, consistent horizontal lanes per phase — no floating nodes |

## 2. Nodes That Bundle Multiple Concepts (Split)

| Original bundled node | Split into |
|---|---|
| Pull Request is Merged | `pull-request-merged` → `pull-request-ci-trigger` |
| Execute Tests | `run-unit-tests` → `run-integration-tests` |
| Docker Hub | `package-container-image` → `push-image-docker-hub` |
| Run Smoke Tests / Health Check | `run-smoke-tests` → `run-health-check` |

## 3. Missing Nodes

| Gap | Fix |
|---|---|
| No pre-development sequence before "Writing the Code" | Add `ideation` → `architecture` → `tech-stack-locked-in`, wired before `writing-the-code`, after `developer` |

## 4. Edge/Connection Issues

| Issue | Fix |
|---|---|
| Stray self-loop: Docker Hub → Docker Hub | Remove — leftover editing artifact, not a real connection |
| 5 dangling lines with no real source/target cell | Remove — these were decorative vertical phase-divider lines, not flow edges |
| `monitoring-observability` → `end-users` drawn one-directional in source, but written docs describe it as an ongoing two-way relationship | Render as **bidirectional** in the rebuilt diagram |
| `developer-fixes-ci` → `commit-push-code` had a broken/dangling target reference in the source XML | Repair — already corrected in `diagram-data.json`, positions matched closely enough to confirm intended target |

## 5. Loop-Back Edges (Visual Treatment)

Certain edges represent a "failure → retry" loop rather than normal forward flow:

- `developer-fixes-ci` → `commit-push-code`
- `rollback` → `notify-developer-team`

These should be styled distinctly from the main forward-flow edges: **dashed line, muted/red-tinted color**. See `EDGE_RULES.md` for full styling spec.

## Source of Truth

All of the above corrections are already encoded into `diagram-data.json` (nodes, edges, `excludedFromSource` log). Build directly from that file — do not re-derive node positions or wiring from `CICDPipeline.png`.
