import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function DecisionNode({ id, data }) {
  const { label, icons, theme } = data;
  const isLight = theme === 'light';
  const { dimClass, accentClass } = useNodeHighlight(id);

  return (
    <div className={`relative w-32 h-32 flex items-center justify-center ${dimClass}`}>
      {/* Target Handle on Left point */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={false}
        className="!bg-amber-400 w-2.5 h-2.5 z-20 cursor-default"
      />

      {/* Source Handle on Top point (No / Pass / Approved) */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={false}
        className="!bg-amber-400 w-2.5 h-2.5 z-20 cursor-default"
      />

      {/* Source Handle on Bottom point (Yes / Fail / Rejected) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={false}
        className="!bg-amber-400 w-2.5 h-2.5 z-20 cursor-default"
      />

      {/* Source Handle on Right point */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={false}
        className="!bg-amber-400 w-2.5 h-2.5 z-20 cursor-default"
      />

      {/* Rotated Diamond Background with Glassmorphism */}
      <div
        className={`absolute w-24 h-24 rotate-45 border-2 border-amber-500 rounded-sm flex items-center justify-center transition-all ${
          isLight ? 'bg-amber-100/70 shadow-md backdrop-blur-md' : 'bg-slate-900/80 backdrop-blur-md shadow-lg'
        } ${accentClass}`}
      />

      {/* Content rotated back */}
      <div
        className={`relative z-10 p-2 text-center text-xs font-semibold max-w-[90px] leading-tight select-none ${
          isLight ? 'text-amber-950' : 'text-amber-300'
        }`}
      >
        {icons && icons.length > 0 && (
          <div className="flex justify-center items-center gap-1 mb-1">
            {icons.map((icon, idx) => (
              <img key={idx} src={icon} alt="decision-icon" className="w-4 h-4 object-contain" />
            ))}
          </div>
        )}
        {label}
      </div>
    </div>
  );
}
