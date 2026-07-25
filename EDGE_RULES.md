# Edge Rules

## Immutability

- **Graph structure is fixed. Layout is interactive.**
- Users can freely drag and reposition nodes anywhere on the canvas.
- Users **cannot** detach an edge from its node or reconnect it to a different node. Disable React Flow's default edge-reconnect/handle-drag-to-new-target behavior entirely.
- As a node moves, all connected edges must automatically re-render — stretching, contracting, and re-routing their curve — while staying attached to the same two endpoints.

## Default Edge Style

- **Curve type**: curved (bezier or smoothstep with rounded corners) — not straight/angular lines.
- **Arrowheads**: styled appropriately per connection type (standard arrow for normal flow; consider a distinct arrow style for decision branches vs. straight process-to-process edges, if it aids readability).
- **Labels**: edges carrying a decision outcome (`Yes`/`No`, `Approved`/`Rejected`, `Fail`) display that label inline on the edge, per `diagram-data.json`'s `edges[].label` field.

## Loop-Back Edges (Distinct Styling)

These edges represent a failure/retry loop rather than normal forward progress:

- `developer-fixes-ci` → `commit-push-code`
- `rollback` → `notify-developer-team`

Style rule: **dashed stroke, muted/red-tinted color** (e.g. a desaturated red or orange, distinct from the default edge color and from the accent green). This visually separates "the pipeline is retrying/recovering" from "the pipeline is moving forward normally."

## Removed Edges (Do Not Implement)

Per `diagram-data.json`'s `excludedFromSource` log, these are **not** real edges and should not appear in the rebuilt diagram:

- Docker Hub → Docker Hub self-loop (leftover editing artifact)
- 5 dangling point-to-point lines with no source/target cell (decorative phase-divider lines from the original draw.io file)

## Corrected Edge

- `monitoring-observability` ↔ `end-users`: render as **bidirectional** (arrowheads on both ends), overriding the one-directional arrow in the original source diagram. See `DIAGRAM_FIXES.md` for reasoning.

## Path Highlighting Interaction

- On node hover (desktop) or tap (mobile), highlight that node's full upstream and downstream edge chain — not just its immediate connections — using the accent color. Non-highlighted edges/nodes dim per the click-to-focus behavior in `UI_SPEC.md`.
