import { ReactFlow, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildFlow } from './buildFlow';
import { nodeTypes } from './flowConfig';

const { nodes, edges } = buildFlow();

const styledEdges = edges.map((edge) => ({
  ...edge,
  markerEnd: { type: MarkerType.ArrowClosed, color: '#000000', width: 18, height: 18 },
  style: { stroke: '#000000', strokeWidth: 1.5 },
  labelStyle: { fill: '#000000', fontFamily: 'Source Serif 4, serif', fontSize: 11 },
  labelBgStyle: { fill: '#ffffff' },
}));

/**
 * Static, non-interactive render of the pipeline diagram from diagram-data.json.
 * Pan/zoom/drag/hover/click are intentionally disabled — those are later phases.
 */
export default function DiagramView() {
  return (
    <div className="h-screen w-screen bg-white">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#000000" gap={24} size={0.5} style={{ opacity: 0.05 }} />
      </ReactFlow>
    </div>
  );
}
