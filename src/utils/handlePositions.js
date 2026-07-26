import { Position } from '@xyflow/react';

/**
 * Which sides a node's handles sit on for the current layout direction.
 * Must stay in step with the `sourcePosition`/`targetPosition` that
 * `transformDiagramData` puts on the node itself.
 */
export function getHandlePositions(orientation) {
  return orientation === 'vertical'
    ? { target: Position.Top, source: Position.Bottom }
    : { target: Position.Left, source: Position.Right };
}
