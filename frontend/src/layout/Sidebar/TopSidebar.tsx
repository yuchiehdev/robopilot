import { memo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSessionExpiration } from '../../hooks/useSessionExpiration';
import wiwynnCircleLogo from '../../assets/icons/wiwynn_logo_white_circle.svg';

type TopSidebarProps = { showIconText: boolean };

const TopSidebar: React.FC<TopSidebarProps> = ({ showIconText }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetSessionExpiration = useSessionExpiration(() => {
    navigate('/signin', { state: { from: location.pathname } });
  });
  return (
    <div className="mt-2">
      <NavLink to="/" onClick={() => resetSessionExpiration()}>
        <img
          src={wiwynnCircleLogo}
          alt="Wiwynn Small Logo"
          className="m-auto h-[6rem] w-12"
        />
      </NavLink>
    </div>
  );
};

export default memo(TopSidebar);
