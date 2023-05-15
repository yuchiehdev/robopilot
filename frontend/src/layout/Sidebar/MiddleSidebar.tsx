import { memo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import sidebarPagesData, { iconArray } from '../../data/sidebar-pages';
import { useAppSelector } from '../../store';
import type { SidebarPageData } from '../../data/sidebar-pages';
import Notification from '../../components/Notification';
import { useSessionExpiration } from '../../hooks/useSessionExpiration';
// import useTooltip from '../../hooks/useTooltip';
import AUTHORIZATION from '../../data/authorization';
import Tooltip from '../../pages/Assembly/Tooltip';

const authList: Record<string, Record<string, Set<string>>> = AUTHORIZATION;

type MiddleSidebarProps = {
  showIconText: boolean;
  alarmCount: number;
  isDashboard: boolean;
  activeMaintenanceCount: number;
};

const MiddleSidebar: React.FC<MiddleSidebarProps> = ({
  showIconText,
  alarmCount,
  activeMaintenanceCount,
}) => {
  // const { tooltipVisible, mouseEnter, mouseLeave } = useTooltip(sidebarPagesData.length);
  const permission = useAppSelector((state) => state.user.permission);
  const navigate = useNavigate();
  const location = useLocation();

  const resetSessionExpiration = useSessionExpiration(() => {
    navigate('/signin', { state: { from: location.pathname } });
  });
  return (
    <div>
      <ul>
        {sidebarPagesData.map((page: SidebarPageData, index: number) => {
          if (!authList[page.title]?.read.has(permission)) return null;
          return (
            <li
              className="relative m-3 cursor-pointer text-white-transparent hover:text-white"
              key={page.id}
            >
              {/* <div
                onMouseEnter={() => mouseEnter(index)}
                onMouseLeave={() => mouseLeave(index)}
                className={`icon ${tooltipVisible[index] ? 'visible' : ''}`}
              > */}

              <NavLink
                onClick={() => resetSessionExpiration()}
                to={page.path}
                className="relative flex items-center"
                style={({ isActive }) => (isActive ? { color: 'white' } : undefined)}
              >
                <Tooltip
                  label={page.title}
                  position="right"
                  marginLeft="-5px"
                  backgroundColor="black"
                >
                  <span
                    className={`${showIconText ? 'mr-4' : 'mx-4'} mx-6 inline-block w-6`}
                  >
                    {iconArray[index]}
                  </span>
                  {showIconText ? (
                    <span className="font-semibold tracking-wide">{page.title}</span>
                  ) : null}
                  {(page.title === 'Alarm' && !showIconText && alarmCount > 0) ||
                  (page.title === 'Maintenance' &&
                    !showIconText &&
                    activeMaintenanceCount > 0) ? (
                    <span className="absolute top-[-2px] right-[0.875rem] z-20 h-3 w-3">
                      <Notification />
                    </span>
                  ) : null}

                  {/* <span className="tooltip">{page.title}</span> */}
                </Tooltip>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(MiddleSidebar);
