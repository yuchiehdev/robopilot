import { SiAnalogue } from 'react-icons/si';
import { ReactComponent as AlarmIcon } from '../assets/icons/alarm.svg';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg';
import { ReactComponent as DeviceIcon } from '../assets/icons/device.svg';
import { ReactComponent as EventIcon } from '../assets/icons/event.svg';
import { ReactComponent as LayerGroupIcon } from '../assets/icons/layer-group.svg';
import { ReactComponent as WrenchIcon } from '../assets/icons/wrench.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user-solid.svg';

export type SidebarPageData = {
  id: number;
  title: string;
  path: string;
};

export const iconArray: JSX.Element[] = [
  <DashboardIcon fill="currentColor" />,
  <DeviceIcon fill="currentColor" />,
  <AlarmIcon fill="currentColor" />,
  <EventIcon fill="currentColor" />,
  <WrenchIcon fill="currentColor" />,
  <LayerGroupIcon fill="currentColor" />,
  <UserIcon fill="currentColor" />,
  <SiAnalogue fill="currentColor" fontSize={24} />,
];

const sidebarPagesData: SidebarPageData[] = [
  {
    id: 1,
    title: 'Dashboard',
    path: '/dashboard',
  },
  { id: 2, title: 'Device', path: '/device' },
  {
    id: 3,
    title: 'Alarm',
    path: '/alarm',
  },
  { id: 4, title: 'Event', path: '/event' },
  {
    id: 5,
    title: 'Maintenance',
    path: '/maintenance',
  },
  {
    id: 6,
    title: 'Assembly',
    path: '/assembly',
  },
  {
    id: 7,
    title: 'User',
    path: '/user',
  },
  {
    id: 8,
    title: 'Status',
    path: '/status',
  },
];

export default sidebarPagesData;
