import React from 'react';
import { Position, getBezierPath } from 'reactflow';
import { useAppDispatch } from '../../store';
import { flowActions } from '../../store/flowSlice';
import './Flow.scss';

// this component is for the button on the edge, code from ReactFlow official website

const foreignObjectSize = 40;

type CustomEdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position | undefined;
  targetPosition: Position | undefined;
  style?: React.CSSProperties;
  markerEnd?: string;
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: CustomEdgeProps) => {
  const dispatch = useAppDispatch();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    edgeId: string,
  ) => {
    evt.stopPropagation();

    dispatch(flowActions.setEdgeId(edgeId));
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
