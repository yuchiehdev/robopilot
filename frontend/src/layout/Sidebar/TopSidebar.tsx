import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import wiwynnLogo from '../../assets/icons/wiwynn_logo_white.svg';
import wiwynnCircleLogo from '../../assets/icons/wiwynn_logo_white_circle.svg';

type TopSidebarProps = { showIconText: boolean };

const TopSidebar: React.FC<TopSidebarProps> = ({ showIconText }) => {
  return (
    <div className="mt-2">
      <NavLink to="/">
        {showIconText ? (
          <img src={wiwynnLogo} alt="Wiwynn Logo" className="m-auto w-9/12" />
        ) : (
          <img
            src={wiwynnCircleLogo}
            alt="Wiwynn Small Logo"
            className="m-auto h-[6rem] w-9/12"
          />
        )}
      </NavLink>
    </div>
  );
};

export default memo(TopSidebar);
