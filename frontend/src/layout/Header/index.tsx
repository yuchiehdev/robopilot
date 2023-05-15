import React, { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { userAction } from '../../store/userSlice';
import DateTimeInput from '../../components/DateTimeInput';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useClickOutside from '../../hooks/useClickOutside';
import { ReactComponent as MoonOutlineIcon } from '../../assets/icons/moon-line.svg';
import { ReactComponent as SunIcon } from '../../assets/icons/sun.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as QuestionIcon } from '../../assets/icons/question.svg';
import { PAGE_TAB_NAME } from '../../data/constant';

const Header = () => {
  dayjs.extend(customParseFormat);
  const [calendarToggle, setCalendarToggle] = useState(false);

  const theme = useAppSelector((state) => state.user.theme);
  const startDateTime = useAppSelector((state) => state.dashboard.startDateTime);
  const endDateTime = useAppSelector((state) => state.dashboard.endDateTime);
  const activeTab = useAppSelector((state) => state.user.activeTab);
  const isDarkMode = theme === 'dark';
  const dispatch = useAppDispatch();
  const window = useWindowDimensions();
  const showHeader = window.width >= 600;
  const location = useLocation();

  const currentTab = activeTab.find(
    (tab) => tab.page === location.pathname.slice(1),
  )?.tab;

  let title = location.pathname ?? '';
  switch (location.pathname) {
    case '/':
      title = 'Assembly';
      break;
    case '/unauthorized':
      title = '';
      break;
    case '/levelIllustration':
      title = '';
      break;
    default:
      title =
        location.pathname[1].toUpperCase() +
        location.pathname.slice(2, location.pathname.length);
      break;
  }

  const darkModeHandler = () => {
    const html = document.querySelector('html');
    if (theme === 'dark') {
      dispatch(userAction.changeTheme('light'));
      html?.classList.remove('dark');
    } else {
      dispatch(userAction.changeTheme('dark'));
      html?.classList.add('dark');
    }
  };

  const { domNode1, domNode2 } = useClickOutside<HTMLButtonElement, HTMLDivElement>(
    () => {
      setCalendarToggle(false);
    },
  );

  const showPageTab =
    location.pathname === '/event' || location.pathname === '/controller';

  return !showHeader ? null : (
    <>
      <nav className="header flex items-center justify-between bg-white px-8 font-bold  text-gray-140 dark:bg-black">
        <h1
          className={`${
            showPageTab ? 'absolute' : null
          } text-xl tracking-wider dark:text-light-120`}
        >
          {title}
        </h1>
        {showPageTab ? (
          <section className="flex grow items-center justify-center gap-3">
            <button
              className={`${
                currentTab === '1'
                  ? 'border border-[#F3F3F4] bg-white text-wiwynn-blue shadow-sm'
                  : 'bg-white hover:cursor-pointer hover:bg-[#f9f9f9]'
              } min-w-[7rem] rounded-md px-3 py-[0.4rem]`}
              onClick={() =>
                dispatch(
                  userAction.setActiveTab({
                    page: location.pathname.slice(1).toLowerCase(),
                    tab: '1',
                  }),
                )
              }
              disabled={currentTab === '1'}
            >
              {PAGE_TAB_NAME[location.pathname.slice(1).toUpperCase()].tabs[0]}
            </button>
            <button
              className={`${
                currentTab === '2'
                  ? 'border border-[#F3F3F4] bg-white text-wiwynn-blue shadow-sm'
                  : 'bg-white hover:cursor-pointer hover:bg-[#f9f9f9]'
              } min-w-[7rem] rounded-md px-3 py-[0.4rem]`}
              onClick={() =>
                dispatch(
                  userAction.setActiveTab({
                    page: location.pathname.slice(1).toLowerCase(),
                    tab: '2',
                  }),
                )
              }
              disabled={currentTab === '2'}
            >
              {PAGE_TAB_NAME[location.pathname.slice(1).toUpperCase()].tabs[1]}
            </button>
          </section>
        ) : null}
        <section className="button-group flex items-center justify-end">
          <button className="ml-3 mr-4 hidden w-5">
            <QuestionIcon fill="#979797" />
          </button>
          <button className="ml-3 mr-4 hidden w-5" onClick={darkModeHandler}>
            {isDarkMode ? <MoonOutlineIcon fill="#979797" /> : <SunIcon fill="#979797" />}
          </button>
          {location.pathname === '/dashboard' ? (
            <button
              className="ml-3 flex items-center border-l-2 border-current pl-4"
              onClick={() => setCalendarToggle(!calendarToggle)}
              ref={domNode1}
            >
              <section className="mx-2 inline-block w-5">
                <CalendarIcon fill="#979797" />
              </section>
              <span className="ml-3 text-lg tracking-wider">
                <span>
                  {dayjs(startDateTime.date).format('D, MMM')}{' '}
                  {dayjs(`${startDateTime.time}`, 'h:mm A').format('hA')}
                </span>
                <span className="mx-[0.7rem]">-</span>
                <span>
                  {dayjs(endDateTime.date).format('D, MMM')}{' '}
                  {dayjs(`${endDateTime.time}`, 'h:mm A').format('hA')}
                </span>
              </span>
            </button>
          ) : null}
        </section>
      </nav>
      {location.pathname === '/' || location.pathname === '/dashboard' ? (
        <div className="absolute top-14 right-5 z-50 w-[25rem]">
          <DateTimeInput ref={domNode2} calendarToggle={calendarToggle} />
        </div>
      ) : null}
    </>
  );
};

export default React.memo(Header);
