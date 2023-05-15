import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { useSessionExpiration } from '../../hooks/useSessionExpiration';
import { userAction } from '../../store/userSlice';
import Notification from '../../components/Notification';
import './sidebarRightTag.scss';

type SidebarRightProps = {
  show: boolean;
  alarmCount: number;
};

const SidebarRightTag: React.FC<SidebarRightProps> = ({ show, alarmCount }) => {
  const showRightSidebar = useAppSelector((state) => state.user.showRightSidebar);
  const navigate = useNavigate();
  const location = useLocation();
  const resetSessionExpiration = useSessionExpiration(() => {
    navigate('/signin', { state: { from: location.pathname } });
  });
  const dispatch = useAppDispatch();
  const toggleHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(userAction.toggleRightSidebar());
    resetSessionExpiration();
  };

  if (!show) return null;
  return (
    <button
      onClick={toggleHandler}
      onTouchEnd={toggleHandler}
      className={`sidebar-right-tag  absolute right-0 bottom-0 z-50 hidden h-12 items-center justify-center bg-wiwynn-blue md:flex md:w-1/4 lg:w-2/12 ${
        showRightSidebar ? 'animate-moveOutBottom' : 'animate-moveInBottom'
      }`}
    >
      <h1 className="text-center text-xl font-bold tracking-wider text-white">Alarm</h1>
      {alarmCount > 0 ? (
        <Notification count={alarmCount} animate="animate-bounce" />
      ) : null}
    </button>
  );
};

export default SidebarRightTag;
