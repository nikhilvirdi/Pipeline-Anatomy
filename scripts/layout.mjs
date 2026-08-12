/**
 * Recomputes node positions in `diagram/diagram-data.json` as clean, consistent
 * horizontal lanes per phase (DIAGRAM_FIXES.md: "Redraw on clean, consistent
 * horizontal lanes per phase — no floating nodes").
 *
 * Each phase is laid out as its own left-to-right band with dagre, and the four
 * bands are stacked in pipeline order. Laying the whole graph out as a single
 * left-to-right run instead produces an 8200x320 ribbon — the chain is ~40
 * nodes deep and almost unbranched — which fits to roughly a third of the node
 * size on screen. Banding trades that for ~3000x1200, and gives the phase lanes
 * the docs ask for.
 *
 * Authoring-time only: the result is baked back into the JSON, so dagre is a
 * devDependency and never ships in the bundle.
 *
 *   node scripts/layout.mjs [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import dagre from '@dagrejs/dagre';

const here = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(here, '..', 'diagram', 'diagram-data.json');

/**
 * Rendered sizes measured from the running app, so the layout reserves the
 * space each shape actually occupies rather than a guess. Re-measure with:
 *   document.querySelectorAll('.react-flow__node').forEach(n =>
 *     console.log(n.dataset.id, n.offsetWidth, n.offsetHeight))
 */
const NODE_SIZES = {
  developer: [130, 81], ideation: [150, 41], architecture: [150, 41],
  'tech-stack-locked-in': [150, 41], 'writing-the-code': [150, 67],
  'local-testing': [230, 82], fail: [128, 128], 'debug-fix-code': [153, 41],
  'commit-push-code': [171, 67], github: [150, 67], 'open-pull-request': [150, 41],
  'pull-request-merged': [158, 41], 'pull-request-ci-trigger': [150, 41],
  'checkout-source-code': [157, 41], 'ci-system': [230, 82],
  'install-dependencies': [150, 41], 'build-the-application': [150, 41],
  'security-scan-sast': [150, 41], 'run-unit-tests': [150, 41],
  'run-integration-tests': [150, 41], 'code-coverage-check': [152, 41],
  'store-artifact-in-registry': [167, 41], 'task-failed': [128, 128],
  'pipeline-stops-ci': [128, 38], 'developer-fixes-ci': [230, 54],
  'cd-system': [230, 82], 'manual-approval-gate': [128, 128],
  'pipeline-stops-cd': [128, 38], 'fetch-build-artifacts': [150, 41],
  'inject-config-secrets': [157, 41], 'package-container-image': [197, 67],
  'push-image-docker-hub': [180, 67], 'pull-image-and-deploy': [176, 41],
  'staging-server': [150, 41], 'run-smoke-tests': [150, 41],
  'run-health-check': [150, 41], 'all-checks-pass': [128, 128],
  'notify-developer-team': [157, 39], 'developer-fixes-cd': [150, 39],
  'deployment-strategy': [230, 56],
  'automated-manual-deployment-production': [230, 56],
  'post-production-health-check': [128, 128], rollback: [150, 41],
  'end-users': [150, 41], 'notify-team-success': [165, 38],
  'monitoring-observability': [182, 67],
};

// Retry edges. Excluded from ranking so they don't drag a stage backwards into
// the step that triggers it — they are drawn as loop-backs, and a loop-back is
// meant to travel against the flow.
const LOOPBACK_EDGES = [
  ['developer-fixes-ci', 'commit-push-code'],
  ['rollback', 'notify-developer-team'],
];

const RANK_SEP = 80;
const NODE_SEP = 44;

// Vertical clearance between one phase band and the next.
const BAND_GAP = 150;

// Centres closer than this belong on the same lane and get snapped level.
const LANE_TOLERANCE = 40;

// Minimum clear space required between any two node boxes.
const MIN_GAP = 24;

const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const sizeOf = (id) => NODE_SIZES[id] ?? [150, 41];

const isLoopback = (edge) =>
  LOOPBACK_EDGES.some(([from, to]) => edge.from === from && edge.to === to);

const phaseOf = new Map(data.nodes.map((node) => [node.id, node.phase]));
const phaseOrder = data.phases.map((phase) => phase.id);

const placed = new Map();
let bandTop = 0;

for (const phase of phaseOrder) {
  const ids = data.nodes.filter((node) => node.phase === phase).map((node) => node.id);
  if (ids.length === 0) continue;

  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR', ranksep: RANK_SEP, nodesep: NODE_SEP, marginx: 0, marginy: 0 });
  graph.setDefaultEdgeLabel(() => ({}));

  for (const id of ids) {
    const [width, height] = sizeOf(id);
    graph.setNode(id, { width, height });
  }

  // Only edges inside the band shape it. Cross-phase edges are drawn as the
  // connectors between bands, and ranking on them would flatten the bands back
  // into one long run.
  for (const edge of data.edges) {
    if (isLoopback(edge)) continue;
    if (phaseOf.get(edge.from) === phase && phaseOf.get(edge.to) === phase) {
      graph.setEdge(edge.from, edge.to);
    }
  }

  dagre.layout(graph);

  const boxes = ids.map((id) => ({ id, ...graph.node(id) }));
  const minX = Math.min(...boxes.map((box) => box.x - box.width / 2));
  const minY = Math.min(...boxes.map((box) => box.y - box.height / 2));
  const bandHeight =
    Math.max(...boxes.map((box) => box.y + box.height / 2)) - minY;

  for (const box of boxes) {
    placed.set(box.id, {
      cx: box.x - minX,
      cy: box.y - minY + bandTop,
      width: box.width,
      height: box.height,
      phase,
    });
  }

  bandTop += bandHeight + BAND_GAP;
}

/* ------------------------------------------------------------ lane snapping */

// Within a band, pull near-equal centres onto a shared lane so rows read as
// straight lines. Skipped for any node whose rank neighbours would collide.
for (const phase of phaseOrder) {
  const entries = [...placed.entries()].filter(([, box]) => box.phase === phase);
  if (entries.length === 0) continue;

  const centres = entries.map(([, box]) => box.cy).sort((a, b) => a - b);
  const lanes = [];
  let bucket = [centres[0]];
  for (const value of centres.slice(1)) {
    if (value - bucket[bucket.length - 1] <= LANE_TOLERANCE) bucket.push(value);
    else {
      lanes.push(bucket.reduce((sum, v) => sum + v, 0) / bucket.length);
      bucket = [value];
    }
  }
  lanes.push(bucket.reduce((sum, v) => sum + v, 0) / bucket.length);

  const nearestLane = (value) =>
    lanes.reduce((best, lane) =>
      Math.abs(lane - value) < Math.abs(best - value) ? lane : best
    );

  for (const [id, box] of entries) {
    const target = nearestLane(box.cy);
    const collides = entries.some(([otherId, other]) => {
      if (otherId === id) return false;
      const sameRank = Math.abs(other.cx - box.cx) < (other.width + box.width) / 2 + MIN_GAP;
      return sameRank && Math.abs(other.cy - target) < (other.height + box.height) / 2 + MIN_GAP;
    });
    if (!collides) box.cy = target;
  }
}

/* ------------------------------------------------------------- verify + save */

const positions = new Map();
for (const [id, box] of placed) {
  positions.set(id, {
    x: Math.round(box.cx - box.width / 2),
    y: Math.round(box.cy - box.height / 2),
  });
}

const overlaps = [];
const ids = [...positions.keys()];
for (let i = 0; i < ids.length; i += 1) {
  for (let j = i + 1; j < ids.length; j += 1) {
    const a = positions.get(ids[i]);
    const b = positions.get(ids[j]);
    const [aw, ah] = sizeOf(ids[i]);
    const [bw, bh] = sizeOf(ids[j]);
    const overlapX = Math.min(a.x + aw, b.x + bw) - Math.max(a.x, b.x) + MIN_GAP;
    const overlapY = Math.min(a.y + ah, b.y + bh) - Math.max(a.y, b.y) + MIN_GAP;
    if (overlapX > 0 && overlapY > 0) overlaps.push(`${ids[i]} <-> ${ids[j]}`);
  }
}

for (const node of data.nodes) {
  const position = positions.get(node.id);
  if (!position) continue;
  node.x = position.x;
  node.y = position.y;
}

const xs = data.nodes.map((n) => n.x + sizeOf(n.id)[0]);
const ys = data.nodes.map((n) => n.y + sizeOf(n.id)[1]);
const width = Math.max(...xs) - Math.min(...data.nodes.map((n) => n.x));
const height = Math.max(...ys) - Math.min(...data.nodes.map((n) => n.y));

console.log(`nodes: ${data.nodes.length}`);
console.log(`extent: ${width} x ${height}  (aspect ${(width / height).toFixed(1)})`);
console.log(`overlaps: ${overlaps.length}`);
for (const pair of overlaps) console.log(`  ${pair}`);
for (const phase of phaseOrder) {
  const band = data.nodes.filter((n) => n.phase === phase);
  if (!band.length) continue;
  const lanes = new Set(band.map((n) => n.y));
  console.log(
    `  ${phase.padEnd(34)} y ${Math.min(...band.map((n) => n.y))}..${Math.max(
      ...band.map((n) => n.y + sizeOf(n.id)[1])
    )}  lanes=${lanes.size}  n=${band.length}`
  );
}

if (!process.argv.includes('--dry')) {
  writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`\nwrote ${DATA_PATH}`);
} else {
  console.log('\n--dry: not written');
}
