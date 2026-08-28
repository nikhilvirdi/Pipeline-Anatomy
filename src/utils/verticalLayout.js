import diagramData from '../../diagram/diagram-data.json';

/**
 * Top-to-bottom layout for small screens (UI_SPEC.md "Layout Direction").
 *
 * `diagram-data.json`'s x/y are authored for the left-to-right desktop layout —
 * x carries the pipeline sequence, y separates parallel branches into lanes.
 * Transposing those coordinates directly does not work: the lane axis would
 * inherit spacing sized for node *heights* while now having to clear node
 * *widths*, which collides, and scaling it up enough to fix that makes the
 * diagram wider than the LTR version is tall — the opposite of what a narrow
 * screen needs.
 *
 * So positions are recomputed rather than rotated. Nodes are grouped into
 * sequence steps by their LTR x, each step becomes a row, and the nodes within
 * a row are spread across columns in their original lane order. The result is
 * one row per pipeline step, reading top to bottom.
 *
 * Grouping runs per phase, because the desktop layout bands each phase into its
 * own left-to-right lane starting back at x = 0 — clustering on x alone would
 * fold the first step of every phase into a single row.
 */

// Nodes whose x values are within this distance belong to the same pipeline
// step. Within a band, ranks sit >= 208 apart while same-rank nodes differ by
// at most ~37 (they share a centre but not a width), so 60 splits them cleanly.
const STEP_TOLERANCE = 60;

// Fixed pitch rather than per-node measurement: the widest node is 230 and the
// tallest (a decision diamond) is 128, so these gaps guarantee no overlap
// without this file having to track the components' rendered sizes.
const COLUMN_GAP = 270;
const ROW_PITCH = 220;

let cached = null;

/** Map of node id → { x, y } for the vertical layout. Computed once. */
export function getVerticalPositions() {
  if (cached) return cached;

  const phaseRank = new Map(diagramData.phases.map((phase, index) => [phase.id, index]));

  const ordered = [...diagramData.nodes].sort(
    (a, b) =>
      (phaseRank.get(a.phase) ?? 0) - (phaseRank.get(b.phase) ?? 0) ||
      a.x - b.x ||
      a.y - b.y
  );

  const rows = [];
  let currentRow = [ordered[0]];

  for (const node of ordered.slice(1)) {
    const previous = currentRow[currentRow.length - 1];
    // Compare against the last node added, so a run of closely spaced nodes
    // chains into one row instead of splitting at an arbitrary point. A phase
    // change always starts a new row.
    if (node.phase === previous.phase && node.x - previous.x <= STEP_TOLERANCE) {
      currentRow.push(node);
    } else {
      rows.push(currentRow);
      currentRow = [node];
    }
  }
  rows.push(currentRow);

  const positions = new Map();
  const phaseStartY = new Map();

  rows.forEach((row, rowIndex) => {
    const phaseId = row[0].phase;
    const y = rowIndex * ROW_PITCH;
    if (!phaseStartY.has(phaseId)) {
      phaseStartY.set(phaseId, y);
    }

    // Lane order in the LTR layout becomes left-to-right order in the row, so
    // a branch that sat above the main line stays on the same side.
    const lanes = [...row].sort((a, b) => a.y - b.y);
    const centreOffset = (lanes.length - 1) / 2;

    lanes.forEach((node, laneIndex) => {
      positions.set(node.id, {
        x: (laneIndex - centreOffset) * COLUMN_GAP,
        y,
      });
    });
  });

  cached = { positions, phaseStartY };
  return cached;
}
