import diagramData from '../../diagram/diagram-data.json';
import { edgeId } from './transformDiagramData';

/**
 * Retry/recovery edges (EDGE_RULES.md). They are real connections — a node's
 * *direct* relations include them — but chain traversal deliberately does not
 * cross them. Following a loop-back backwards would report the entire CI stage
 * as "upstream" of the commit that triggers it, which inverts the pipeline's
 * actual direction and leaves nothing dimmed for almost every node.
 */
const LOOPBACK_EDGE_IDS = new Set([
  edgeId('developer-fixes-ci', 'commit-push-code'),
  edgeId('rollback', 'notify-developer-team'),
]);

// Adjacency is derived from the raw source data, not from the transformed
// nodes/edges, so it stays stable across theme toggles and re-renders.
const outgoing = new Map();
const incoming = new Map();

for (const edge of diagramData.edges) {
  const link = {
    edge: edgeId(edge.from, edge.to),
    isLoopback: LOOPBACK_EDGE_IDS.has(edgeId(edge.from, edge.to)),
  };

  if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
  outgoing.get(edge.from).push({ ...link, node: edge.to });

  if (!incoming.has(edge.to)) incoming.set(edge.to, []);
  incoming.get(edge.to).push({ ...link, node: edge.from });
}

const ALWAYS_VISIBLE = () => true;

function linksOf(nodeId) {
  return [...(outgoing.get(nodeId) || []), ...(incoming.get(nodeId) || [])];
}

/**
 * Immediate connections only — the set click-to-focus highlights.
 * Loop-back edges are included: they are genuine direct connections.
 */
export function getDirectRelations(nodeId, isVisible = ALWAYS_VISIBLE) {
  const nodes = new Set();
  const edges = new Set();
  if (!nodeId || !isVisible(nodeId)) return { nodes, edges };

  for (const link of linksOf(nodeId)) {
    if (!isVisible(link.node)) continue;
    nodes.add(link.node);
    edges.add(link.edge);
  }

  return { nodes, edges };
}

/**
 * Breadth-first walk in one direction. `seen` makes it cycle-safe even though
 * skipping loop-backs already breaks the only cycles in the current data.
 */
function walk(startId, adjacency, isVisible) {
  const nodes = new Set();
  const edges = new Set();

  const seen = new Set([startId]);
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift();

    for (const link of adjacency.get(current) || []) {
      // A hidden node stops the chain rather than being walked through.
      if (link.isLoopback || !isVisible(link.node)) continue;

      edges.add(link.edge);
      if (seen.has(link.node)) continue;

      seen.add(link.node);
      nodes.add(link.node);
      queue.push(link.node);
    }
  }

  return { nodes, edges };
}

/**
 * Full upstream + downstream chain — the set hover path-highlighting uses.
 * Returns the two directions separately so they can be styled distinctly.
 * `direct` holds the hovered node's immediate loop-back edges, which are part
 * of its connections but are not traversed through.
 */
export function getChain(nodeId, isVisible = ALWAYS_VISIBLE) {
  const empty = {
    upstream: { nodes: new Set(), edges: new Set() },
    downstream: { nodes: new Set(), edges: new Set() },
    direct: { nodes: new Set(), edges: new Set() },
  };
  if (!nodeId || !isVisible(nodeId)) return empty;

  const direct = { nodes: new Set(), edges: new Set() };
  for (const link of linksOf(nodeId)) {
    if (!link.isLoopback || !isVisible(link.node)) continue;
    direct.nodes.add(link.node);
    direct.edges.add(link.edge);
  }

  return {
    upstream: walk(nodeId, incoming, isVisible),
    downstream: walk(nodeId, outgoing, isVisible),
    direct,
  };
}

/** Neighbour ids in both directions — used by keyboard navigation. */
export function getNeighbourIds(nodeId, isVisible = ALWAYS_VISIBLE) {
  return [...getDirectRelations(nodeId, isVisible).nodes];
}
