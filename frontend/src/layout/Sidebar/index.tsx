import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/index';
import TopSidebar from './TopSidebar';
import MiddleSidebar from './MiddleSidebar';
import BottomSidebar from './BottomSidebar';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { ReactComponent as ToggleIcon } from '../../assets/icons/toggle.svg';
import { userAction } from '../../store/userSlice';

type SidebarProps = {
  alarmCount: number;
};

const Sidebar: React.FC<SidebarProps> = ({ alarmCount }) => {
  const dispatch = useAppDispatch();
  const window = useWindowDimensions();
  const windowWidth = window.width;
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  useEffect(() => {
    if (windowWidth < 900) {
      dispatch(userAction.toggleSidebar(false));
    } else if (!isDashboard) dispatch(userAction.toggleSidebar(true));
  }, [windowWidth, dispatch]);

  // const toggleSidebar = useAppSelector((state) => state.user.toggleSidebar);
  const toggleSidebar = false;

  const toggleSidebarHandler = () => {
    dispatch(userAction.toggleSidebar(!toggleSidebar));
  };

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col  items-center justify-between bg-black-100
      ${!isDashboard && toggleSidebar ? 'w-2/12 max-w-[240px] border-2' : 'w-[8%]'}`}
    >
      <button
        className={`absolute top-5 right-[-0.8rem] hidden h-8 w-8 
        ${toggleSidebar ? 'rotate-[-90deg]' : 'rotate-90'} ${
          isDashboard ? 'hidden' : null
        }`}
      >
        <ToggleIcon
          fill="#fff"
          filter="drop-shadow(0px 2px 2px rgb(0 0 0 / 0.3))"
          onClick={toggleSidebarHandler}
          onTouchEnd={toggleSidebarHandler}
        />
      </button>
      <TopSidebar showIconText={toggleSidebar} />
      <MiddleSidebar
        showIconText={toggleSidebar}
        alarmCount={alarmCount}
        isDashboard={isDashboard}
      />
      <BottomSidebar showIconText={toggleSidebar} />
    </aside>
  );
};

export default memo(Sidebar);
