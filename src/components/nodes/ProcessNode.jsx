import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function ProcessNode({ id, data }) {
  const { label, icons } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);

  const getHandleClass = (handleId) => {
    const isUsed = data?.usedHandles?.[handleId];
    return isUsed
      ? '!bg-text-muted border-none w-2.5 h-2.5 cursor-default'
      : '!opacity-0 !w-0 !h-0 !border-none !p-0 pointer-events-none';
  };

  return (
    <div
      className={`px-5 py-4 rounded-[6px] min-w-[190px] max-w-[280px] text-center transition-all bg-node border border-node ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position={Position.Left} id="left" isConnectable={false} className={getHandleClass('left')} />
      <Handle type="target" position={Position.Top} id="top" isConnectable={false} className={getHandleClass('top')} />
      <Handle type="target" position={Position.Bottom} id="bottom" isConnectable={false} className={getHandleClass('bottom')} />
      <Handle type="target" position={Position.Right} id="target-right" isConnectable={false} className={getHandleClass('target-right')} />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1.5">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="node-icon" className="w-6 h-6 object-contain" />
          ))}
        </div>
      )}
      <div className="text-[15px] font-sans font-medium leading-snug select-none">{label}</div>
      <Handle type="source" position={Position.Right} id="right" isConnectable={false} className={getHandleClass('right')} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" isConnectable={false} className={getHandleClass('source-bottom')} />
      <Handle type="source" position={Position.Top} id="source-top" isConnectable={false} className={getHandleClass('source-top')} />
      <Handle type="source" position={Position.Left} id="source-left" isConnectable={false} className={getHandleClass('source-left')} />
    </div>
  );

}
