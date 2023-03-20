import React from 'react';

type PanelProps = {
  children: React.ReactNode;
};

const Panel = ({ children }: PanelProps) => {
  return <main className="dashboardWidth  bg-[#fafafa] p-2 pr-10 pl-10">{children}</main>;
};

export default Panel;
