import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function DecisionNode({ id, data }) {
  const { label, icons } = data;
  const { dimClass, accentClass } = useNodeHighlight(id);

  const isError = id === 'fail' || id === 'task-failed';
  
  const handleBg = '!bg-text-muted border-none';

  return (
    <div className={`relative w-40 h-40 flex items-center justify-center ${dimClass} ${isError ? 'node-diamond--error' : ''}`}>
      {/* Target Handle on Left point */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={false}
        className={`${handleBg} w-3 h-3 z-20 cursor-default`}
      />

      {/* Source Handle on Top point (No / Pass / Approved) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={false}
        className={`${handleBg} w-3 h-3 z-20 cursor-default`}
      />

      {/* Source Handle on Bottom point (Yes / Fail / Rejected) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={false}
        className={`${handleBg} w-3 h-3 z-20 cursor-default`}
      />

      {/* Source Handle on Right point */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={false}
        className={`${handleBg} w-3 h-3 z-20 cursor-default`}
      />

      {/* Rotated Diamond Background */}
      <div
        className={`diamond-bg absolute w-[113px] h-[113px] rotate-45 border transition-all bg-node rounded-sm ${
          isError ? 'border-accent-error' : 'border-node'
        } ${accentClass}`}
      />

      {/* Content rotated back */}
      <div
        className={`diamond-text relative z-10 p-2.5 text-center text-[17px] font-serif font-semibold italic max-w-[115px] leading-tight select-none ${
          isError ? 'text-accent-error' : 'text-primary'
        }`}
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
