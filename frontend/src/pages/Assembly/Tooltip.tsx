import React, { ReactNode } from 'react';
import './assembly.scss';

type Position = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  children: ReactNode;
  label: string;
  position?: Position;
  enabled?: boolean;
  marginLeft?: string;
  backgroundColor?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  label,
  position = 'top',
  enabled = true,
  marginLeft,
  backgroundColor = '#555',
}) => {
  return (
    <div className="tooltip-container">
      {children}
      <span
        className={`tooltip-text tooltip-${position} ${
          enabled ? 'inline-block' : 'hidden'
        }`}
        style={{ marginLeft, backgroundColor } as React.CSSProperties}
      >
        {label}
      </span>
    </div>
  );
};

export default Tooltip;
