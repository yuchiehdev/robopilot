import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchSensorData } from '../store/sensorSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import SidebarRight from './SidebarRight';
import SidebarRightTag from './SidebarRight/SidebarRightTag';
import { fetchAlarmData } from '../store/alarmSlice';
import { auth } from '../store/userSlice';
import '../css/app.scss';
import { component } from '../data/featureFlag';

const App = () => {
  const showSidebarRight = useAppSelector((state) => state.user.showRightSidebar);
  const alarmCount = useAppSelector((state) => state.alarm.alarmCount);
  const alarm = useAppSelector((state) => state.alarm.alarm);
  const location = useLocation();
  const dispatch = useAppDispatch();

  dispatch(auth());

  // fetch alarm data first due to sidebar tag
  useEffect(() => {
    dispatch(fetchAlarmData());
  }, [dispatch]);

  // fetch sensor data first due to right sidebar
  useEffect(() => {
    const fetchData = setInterval(() => {
      dispatch(fetchSensorData());
    }, 100000);

    return () => {
      clearInterval(fetchData);
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen w-screen bg-light-100">
      <Sidebar alarmCount={alarmCount} />
      <section className="flex w-full grow flex-col">
        <Header />
        {location.pathname === '/' ? component : <Outlet />}
      </section>
      <SidebarRight show={showSidebarRight} alarm={alarm} />
      <SidebarRightTag show={!showSidebarRight} alarmCount={alarmCount} />
    </div>
  );
};

export default App;
