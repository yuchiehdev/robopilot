import { memo } from 'react';

import TopSidebar from './TopSidebar';
import MiddleSidebar from './MiddleSidebar';
import BottomSidebar from './BottomSidebar';
import './sidebar.scss';

type SidebarProps = {
  alarmCount: number;
  activeMaintenanceCount: number;
};

const Sidebar: React.FC<SidebarProps> = ({ alarmCount, activeMaintenanceCount }) => {
  return (
    <aside
      className={`relative flex h-screen w-[6.5%] shrink-0 flex-col items-center justify-between
     bg-black-100`}
    >
      <TopSidebar showIconText={false} />
      <MiddleSidebar
        showIconText={false}
        alarmCount={alarmCount}
        activeMaintenanceCount={activeMaintenanceCount}
        isDashboard={false}
      />
      <BottomSidebar showIconText={false} />
    </aside>
  );
};

export default memo(Sidebar);
