import { Handle, Position } from '@xyflow/react';
import developerIcon from '../../icons/developer.png';

const hiddenHandleStyle = {
  opacity: 0,
  width: 1,
  height: 1,
  border: 'none',
  background: 'transparent',
  pointerEvents: 'none',
};

function FlowHandles() {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} style={hiddenHandleStyle} />
      <Handle type="source" position={Position.Right} isConnectable={false} style={hiddenHandleStyle} />
    </>
  );
}

export function RectNode({ data }) {
  return (
    <div className="flex h-full min-h-[70px] w-[170px] items-center justify-center border-2 border-black bg-white p-2 text-center font-serif text-[11px] leading-tight text-black">
      <FlowHandles />
      {data.label}
    </div>
  );
}

export function DecisionNode({ data }) {
  return (
    <div className="relative h-[140px] w-[140px]">
      <FlowHandles />
      <div className="absolute inset-0 rotate-45 border-2 border-black bg-white" />
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-[11px] leading-tight text-black">
        {data.label}
      </div>
    </div>
  );
}

export function CircleNode({ data }) {
  return (
    <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-black bg-white p-3 text-center font-serif text-[11px] leading-tight text-black">
      <FlowHandles />
      {data.label}
    </div>
  );
}

export function ActorNode({ data }) {
  return (
    <div className="flex w-[90px] flex-col items-center gap-1">
      <FlowHandles />
      <img src={developerIcon} alt="" className="h-12 w-12 object-contain" />
      <span className="text-center font-serif text-[11px] text-black">{data.label}</span>
    </div>
  );
}

export function PhaseGroupNode({ data }) {
  return (
    <div className="pointer-events-none h-full w-full border border-black/40">
      <div className="px-3 py-1 font-serif text-xs uppercase tracking-wide text-black/70">{data.label}</div>
    </div>
  );
}

