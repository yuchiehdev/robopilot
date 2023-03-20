import { FaUserAlt } from 'react-icons/fa';
import { RiRemoteControlFill } from 'react-icons/ri';
import { ReactComponent as AlarmIcon } from '../assets/icons/alarm.svg';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg';
import { ReactComponent as DeviceIcon } from '../assets/icons/device.svg';
import { ReactComponent as EventIcon } from '../assets/icons/event.svg';
import { ReactComponent as FlowSettingIcon } from '../assets/icons/flow-setting.svg';
import { ReactComponent as HandIcon } from '../assets/icons/hand.svg';
import { ReactComponent as WrenchIcon } from '../assets/icons/wrench.svg';

export type SidebarPageData = {
  id: number;
  title: string;
  path: string;
};

export const iconArray: JSX.Element[] = [
  <DashboardIcon fill="currentColor" />,
  <DeviceIcon fill="currentColor" />,
  <FlowSettingIcon fill="currentColor" />,
  <AlarmIcon fill="currentColor" />,
  <EventIcon fill="currentColor" />,
  <WrenchIcon fill="currentColor" />,
  <HandIcon fill="currentColor" />,
  <FaUserAlt fill="currentColor" size={30} />,
  <RiRemoteControlFill fill="currentColor" size={30} />,
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
    title: 'Flow',
    path: '/flow',
  },
  {
    id: 4,
    title: 'Alarm',
    path: '/alarm',
  },
  { id: 5, title: 'Event', path: '/event' },
  {
    id: 6,
    title: 'Maintenance',
    path: '/maintenance',
  },
  {
    id: 7,
    title: 'Controller',
    path: '/controller',
  },
  {
    id: 8,
    title: 'User',
    path: '/user',
  },
  {
    id: 9,
    title: 'c',
    path: '/c',
  },
];

export default sidebarPagesData;
