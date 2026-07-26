import { getChain, getDirectRelations } from './graphTraversal';

export const INACTIVE_HIGHLIGHT = {
  nodeStates: new Map(),
  edgeStates: new Map(),
  active: false,
  keyboardNodeId: null,
};

/**
 * Resolves hover and click-focus into the per-element visual states consumed by
 * the node and edge components. Anything absent from the maps while `active` is
 * true renders dimmed, so only highlighted elements need entries.
 *
 * Hover wins over focus while the pointer is on a node: the path chain is a
 * transient read of "what feeds this / what it feeds", and reverting to the
 * focused node's state on mouse-leave keeps the click-focus selection intact.
 *
 * Node states: 'focused' | 'neighbor' | 'related'
 *  - focused  — the hovered or clicked node itself (accent ring)
 *  - neighbor — a direct connection of the focused node (accent border)
 *  - related  — on the hovered node's chain (undimmed, no accent)
 *
 * Edge states: 'downstream' | 'upstream' | 'direct'
 */
export function computeHighlight({ hoveredNodeId, focusedNodeId, isVisible }) {
  const nodeStates = new Map();
  const edgeStates = new Map();

  const anchor = hoveredNodeId || focusedNodeId;
  if (!anchor || !isVisible(anchor)) return INACTIVE_HIGHLIGHT;

  if (hoveredNodeId) {
    const { upstream, downstream, direct } = getChain(hoveredNodeId, isVisible);

    // Chain nodes stay bright but unringed — with a pipeline this linear the
    // chain covers most of the graph, so the accent lives on the edges where
    // it still reads as a path instead of a wash of green.
    for (const id of upstream.nodes) nodeStates.set(id, 'related');
    for (const id of downstream.nodes) nodeStates.set(id, 'related');
    for (const id of direct.nodes) nodeStates.set(id, 'related');

    for (const id of upstream.edges) edgeStates.set(id, 'upstream');
    for (const id of downstream.edges) edgeStates.set(id, 'downstream');
    for (const id of direct.edges) edgeStates.set(id, 'direct');
  } else {
    const { nodes, edges } = getDirectRelations(focusedNodeId, isVisible);
    for (const id of nodes) nodeStates.set(id, 'neighbor');
    for (const id of edges) edgeStates.set(id, 'direct');
  }

  // The anchor always outranks whatever a cycle may have assigned it.
  nodeStates.set(anchor, 'focused');

  return { nodeStates, edgeStates, active: true };
}
