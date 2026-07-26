import React, { createContext, useContext } from 'react';

import { INACTIVE_HIGHLIGHT } from '../utils/highlightState';

/**
 * Carries per-node/per-edge highlight state (Phase 7) down to the node and edge
 * components. Kept in context rather than in each node's `data` so a hover
 * doesn't rebuild all 46 node objects — the nodes array identity stays stable,
 * which is what lets dragged positions survive highlight changes.
 */
const DiagramInteractionContext = createContext(INACTIVE_HIGHLIGHT);

export function DiagramInteractionProvider({ value, children }) {
  return (
    <DiagramInteractionContext.Provider value={value}>
      {children}
    </DiagramInteractionContext.Provider>
  );
}

export function useDiagramInteraction() {
  return useContext(DiagramInteractionContext);
}

/**
 * Highlight classes for a node shape. `dimClass` goes on the outermost element
 * of every node component; `accentClass` goes on whichever element actually
 * draws the border (the diamond, not its wrapper, for DecisionNode).
 */
export function useNodeHighlight(nodeId) {
  const { nodeStates, active, keyboardNodeId } = useDiagramInteraction();
  const state = active ? nodeStates.get(nodeId) || 'dimmed' : 'normal';
  const keyboard = keyboardNodeId === nodeId ? ' rf-node-keyboard' : '';

  return {
    state,
    dimClass: `rf-node-state${state === 'dimmed' ? ' rf-node-dim' : ''}${keyboard}`,
    accentClass:
      state === 'focused'
        ? 'rf-node-focus'
        : state === 'neighbor'
          ? 'rf-node-neighbor'
          : '',
  };
}

/** Edge highlight state: 'downstream' | 'upstream' | 'direct' | 'dimmed' | 'normal'. */
export function useEdgeHighlight(id) {
  const { edgeStates, active } = useDiagramInteraction();
  return active ? edgeStates.get(id) || 'dimmed' : 'normal';
}
