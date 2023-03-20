import { memo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import sidebarPagesData, { iconArray } from '../../data/sidebar-pages';
import type { SidebarPageData } from '../../data/sidebar-pages';
import Notification from '../../components/Notification';

type MiddleSidebarProps = {
  showIconText: boolean;
  alarmCount: number;
  isDashboard: boolean;
};

const MiddleSidebar: React.FC<MiddleSidebarProps> = ({
  showIconText,
  alarmCount,
  isDashboard,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(
    sidebarPagesData.map(() => {
      return false;
    }),
  );
  let timer: any = 0;
  const TIMEOUT = 300;

  function mouseEnter(index: number) {
    timer = setTimeout(() => {
      setTooltipVisible(() => {
        const newState = sidebarPagesData.map(() => {
          return false;
        });
        newState[index] = true;
        return newState;
      });
    }, TIMEOUT);
  }

  function mouseLeave(index: number) {
    setTooltipVisible((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
    clearTimeout(timer);
  }
  return (
    <div>
      <ul>
        {sidebarPagesData.map((page: SidebarPageData, index: number) => {
          return (
            <li
              className="m-4 cursor-pointer text-white-transparent  hover:text-white"
              key={page.id}
            >
              <div
                onMouseEnter={() => mouseEnter(index)}
                onMouseLeave={() => mouseLeave(index)}
                className={`icon ${tooltipVisible[index] ? 'visible' : ''}`}
              >
                <NavLink
                  to={page.path}
                  className="relative flex items-center"
                  style={({ isActive }) => (isActive ? { color: 'white' } : undefined)}
                >
                  <span
                    className={`${
                      showIconText ? 'mr-4' : 'mx-4'
                    } flex w-6 items-center justify-center`}
                  >
                    {iconArray[index]}
                  </span>
                  {showIconText ? (
                    <span className=" font-semibold tracking-wide">{page.title}</span>
                  ) : null}
                  {page.title === 'Alarm' && showIconText && alarmCount > 0 ? (
                    <Notification count={alarmCount} />
                  ) : null}
                  {page.title === 'Alarm' && !showIconText && alarmCount > 0 ? (
                    <span className="absolute top-[-2px] right-[0.875rem] z-20 h-3 w-3">
                      <Notification />
                    </span>
                  ) : null}

                  <span className="tooltip">{page.title}</span>
                </NavLink>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(MiddleSidebar);
