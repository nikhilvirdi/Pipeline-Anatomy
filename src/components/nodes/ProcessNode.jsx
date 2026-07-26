import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useNodeHighlight } from '../../context/DiagramInteractionContext';

export default function ProcessNode({ id, data }) {
  const { label, icons, mirroredStyle, theme } = data;
  const glassClass = theme === 'light' ? 'glass-card-light' : 'glass-card-dark';
  const { dimClass, accentClass } = useNodeHighlight(id);

  return (
    <div
      className={`px-4 py-3 min-w-[150px] max-w-[230px] text-center transition-all ${
        mirroredStyle || glassClass
      } ${dimClass} ${accentClass}`}
    >
      <Handle type="target" position={Position.Left} id="left" isConnectable={false} className="!bg-accent w-2.5 h-2.5 cursor-default" />
      <Handle type="target" position={Position.Top} id="top" isConnectable={false} className="!bg-accent w-2.5 h-2.5 opacity-0 pointer-events-none" />
      <Handle type="target" position={Position.Bottom} id="bottom" isConnectable={false} className="!bg-accent w-2.5 h-2.5 opacity-0 pointer-events-none" />
      {icons && icons.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mb-1.5">
          {icons.map((icon, idx) => (
            <img key={idx} src={icon} alt="node-icon" className="w-5 h-5 object-contain" />
          ))}
        </div>
      )}
      <div className="text-xs font-medium leading-tight select-none">{label}</div>
      <Handle type="source" position={Position.Right} id="right" isConnectable={false} className="!bg-accent w-2.5 h-2.5 cursor-default" />
    </div>
  );
}
