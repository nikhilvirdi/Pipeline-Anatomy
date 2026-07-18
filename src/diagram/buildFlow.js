import diagramData from '../../diagram/diagram-data.json';

/** Approximate render footprint per shape, used only for phase-group bounding boxes. */
export const NODE_SIZE = {
  rect: { width: 170, height: 80 },
  decision: { width: 140, height: 140 },
  circle: { width: 120, height: 120 },
  actor: { width: 90, height: 110 },
};

const PHASE_PADDING = 60;
const PHASE_LABEL_HEIGHT = 40;

/**
 * Converts diagram-data.json into xyflow nodes/edges, plus one background
 * "phaseGroup" node per phase sized to its members' bounding box.
 * @returns {{ nodes: import('@xyflow/react').Node[], edges: import('@xyflow/react').Edge[] }}
 */
export function buildFlow() {
  const flowNodes = diagramData.nodes.map((node) => ({
    id: node.id,
    type: node.shape,
    position: { x: node.x, y: node.y },
    data: { label: node.label },
    draggable: false,
    selectable: false,
    connectable: false,
    focusable: false,
  }));

  const flowEdges = diagramData.edges.map((edge, index) => ({
    id: `${edge.from}-${edge.to}-${index}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'default',
    selectable: false,
    focusable: false,
  }));

  const phaseGroupNodes = diagramData.phases.map((phase) => {
    const members = diagramData.nodes.filter((n) => n.phase === phase.id);
    const bounds = members.reduce(
      (acc, n) => {
        const size = NODE_SIZE[n.shape];
        return {
          minX: Math.min(acc.minX, n.x),
          minY: Math.min(acc.minY, n.y),
          maxX: Math.max(acc.maxX, n.x + size.width),
          maxY: Math.max(acc.maxY, n.y + size.height),
        };
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );

    return {
      id: `phase-${phase.id}`,
      type: 'phaseGroup',
      position: { x: bounds.minX - PHASE_PADDING, y: bounds.minY - PHASE_PADDING - PHASE_LABEL_HEIGHT },
      data: { label: phase.label },
      style: {
        width: bounds.maxX - bounds.minX + PHASE_PADDING * 2,
        height: bounds.maxY - bounds.minY + PHASE_PADDING * 2 + PHASE_LABEL_HEIGHT,
      },
      draggable: false,
      selectable: false,
      connectable: false,
      focusable: false,
      zIndex: -1,
    };
  });

  return { nodes: [...phaseGroupNodes, ...flowNodes], edges: flowEdges };
}
