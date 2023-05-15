import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';
import Header from './Header';
import Assembly from '../pages/Assembly';
import Sidebar from './Sidebar';
import SidebarRight from './SidebarRight';
import SidebarRightTag from './SidebarRight/SidebarRightTag';
import { useAppSelector, useAppDispatch } from '../store';
import '../css/app.scss';
import { getAlarm } from '../api/alarm';
import { getActiveMaintenance } from '../api/maintenance';
import type { AlarmType } from '../types';
import { useSessionExpiration } from '../hooks/useSessionExpiration';
import { userAction } from '../store/userSlice';
import { SESSION_EXPIRATION, FETCH_INTERVAL } from '../data/constant';
import AuthWrapper from '../components/AuthWrapper';

const App = () => {
  const showSidebarRight = useAppSelector((state) => state.user.showRightSidebar);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useQuery<AlarmType[], Error>({
    queryKey: ['alarms'],
    queryFn: getAlarm,
    refetchInterval: FETCH_INTERVAL,
  });
  useEffect(() => {
    if (localStorage.getItem('JWToken')) {
      dispatch(userAction.setSignInStatus(true));
    } else {
      dispatch(userAction.setSignInStatus(false));
      // dispatch(userAction.setUserRole({ permission: '', name: '' }));
    }
  }, [dispatch]);

  const { data: activeMaintenance } = useQuery<AlarmType[], Error>({
    queryKey: ['activeMaintenances'],
    queryFn: getActiveMaintenance,
    refetchInterval: FETCH_INTERVAL,
  });

  const onTokenRemoved = () => {
    navigate('/signin', { state: { from: location.pathname } });
  };
  useSessionExpiration(onTokenRemoved, SESSION_EXPIRATION, true);

  return (
    <div className="flex h-screen w-screen bg-light-100">
      <ToastContainer />
      <Sidebar
        alarmCount={data?.length || 0}
        activeMaintenanceCount={activeMaintenance?.length || 0}
      />
      <section className="flex grow flex-col">
        <Header />
        {location.pathname === '/' ? (
          <AuthWrapper page="Assembly">
            <Assembly />
          </AuthWrapper>
        ) : (
          <Outlet />
        )}
      </section>
      <SidebarRight show={showSidebarRight} alarm={data} />
      <SidebarRightTag
        show={!showSidebarRight && location.pathname !== '/controller'}
        alarmCount={data?.length || 0}
      />
    </div>
  );
};

export default App;
