/**
 * useNodeUrl
 *
 * Syncs the `?node=<id>` query param with the focused node state:
 *  - pushState when a node is focused or cleared
 *  - reads the param on initial mount and returns the startup node id
 *    (caller must verify it actually exists before using it)
 */
import { useCallback, useEffect, useRef } from 'react';

function getNodeParam() {
  return new URLSearchParams(window.location.search).get('node') || null;
}

function setNodeParam(nodeId) {
  const url = new URL(window.location.href);
  if (nodeId) {
    url.searchParams.set('node', nodeId);
  } else {
    url.searchParams.delete('node');
  }
  window.history.pushState({}, '', url.toString());
}

/**
 * @param {string|null} focusedNodeId   currently focused node id
 * @param {Set<string>} validNodeIds    set of all real node ids in the diagram
 * @returns {{ startupNodeId: string|null }}
 */
export function useNodeUrl(focusedNodeId, validNodeIds) {
  // Capture the ?node= param that was present when the page first loaded.
  // We only want to read it once — useRef keeps it stable across re-renders.
  const startupNodeIdRef = useRef(() => {
    const raw = getNodeParam();
    // Validate immediately: if the id doesn't exist in the diagram, ignore it.
    if (raw && validNodeIds.size > 0 && validNodeIds.has(raw)) return raw;
    return null;
  });

  // Evaluate the ref-stored initialiser once.
  const startupNodeId = useRef(null);
  if (startupNodeId.current === null && validNodeIds.size > 0) {
    const raw = getNodeParam();
    startupNodeId.current = raw && validNodeIds.has(raw) ? raw : '__resolved__';
  }

  // Keep the URL in sync whenever focusedNodeId changes.
  const prevFocusRef = useRef(undefined);
  useEffect(() => {
    if (prevFocusRef.current === focusedNodeId) return;
    prevFocusRef.current = focusedNodeId;
    setNodeParam(focusedNodeId);
  }, [focusedNodeId]);

  const resolvedStartup =
    startupNodeId.current && startupNodeId.current !== '__resolved__'
      ? startupNodeId.current
      : null;

  return { startupNodeId: resolvedStartup };
}

export { getNodeParam };
