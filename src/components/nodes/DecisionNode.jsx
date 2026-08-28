import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function DecisionNode({ id, data }) {
  const { label, icons } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);

  const getHandleClass = (handleId) => {
    const isUsed = data?.usedHandles?.[handleId];
    return isUsed
      ? '!bg-text-muted border-none w-2.5 h-2.5 z-20 cursor-default'
      : '!opacity-0 !w-0 !h-0 !border-none !p-0 pointer-events-none';
  };

  return (
    <div className={`relative w-40 h-40 flex items-center justify-center ${dimClass}`}>
      {/* Target Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={false}
        className={getHandleClass('left')}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={false}
        className={getHandleClass('target-top')}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        isConnectable={false}
        className={getHandleClass('target-bottom')}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        isConnectable={false}
        className={getHandleClass('target-right')}
      />

      {/* Source Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={false}
        className={getHandleClass('top')}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={false}
        className={getHandleClass('bottom')}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={false}
        className={getHandleClass('right')}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        isConnectable={false}
        className={getHandleClass('source-left')}
      />



      {/* Rotated Diamond Background */}
      <div
        className={`diamond-bg absolute w-[113px] h-[113px] rotate-45 border transition-all bg-node border-node rounded-[4px] ${accentClass}`}
      />

      {/* Content rotated back */}
      <div
        className="diamond-text relative z-10 p-2.5 text-center text-[17px] font-serif font-semibold italic max-w-[115px] leading-tight select-none text-primary"
      >
        {icons && icons.length > 0 && (
          <div className="flex justify-center items-center gap-1 mb-1">
            {icons.map((icon, idx) => (
              <img key={idx} src={icon} alt="decision-icon" className="w-5 h-5 object-contain" />
            ))}
          </div>
        )}
        {label}
      </div>
    </div>
  );
}

