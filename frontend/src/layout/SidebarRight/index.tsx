import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';

import CircularProgressbar from '../../components/CircularProgressbar';
import TimelineItem from '../../components/TimelineItem';
import useShowUI from '../../hooks/useShowUI';
import { getResource } from '../../api/assembly';
import { userAction } from '../../store/userSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import { ReactComponent as TriangleIcon } from '../../assets/icons/triangle.svg';
import type { AlarmType, Resource } from '../../types';
import { useClickOutsideSingle } from '../../hooks/useClickOutside';
import { FETCH_INTERVAL } from '../../data/constant';

type SidebarRightProps = {
  show: boolean;
  alarm: AlarmType[] | undefined;
};

const SidebarRight: React.FC<SidebarRightProps> = ({ show, alarm }) => {
  const dispatch = useAppDispatch();
  const [, showSBR] = useShowUI(show, 500);
  const showRightSidebar = useAppSelector((state) => state.user.showRightSidebar);

  const { domNode } = useClickOutsideSingle<HTMLButtonElement>(() => {
    dispatch(userAction.hideRightSidebar());
  });

  const toggleHandler = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    dispatch(userAction.toggleRightSidebar());
    e.preventDefault();
  };

  const { data } = useQuery<Resource[], Error>({
    queryKey: ['sensor'],
    queryFn: getResource,
    refetchInterval: FETCH_INTERVAL,
  });

  if (!showSBR) return null;
  return (
    <aside
      className={`absolute right-0 bottom-0 z-50 flex h-screen w-2/12 flex-col items-center justify-between bg-gray-100 shadow-md dark:bg-black-80 ${
        showRightSidebar ? 'animate-moveInBottom' : 'animate-moveOutBottom'
      }`}
    >
      <button
        className="h-[8vh] w-full shrink-0 text-xl  font-bold tracking-wider text-white hover:bg-gray-80 dark:hover:bg-gray-220"
        onClick={toggleHandler}
        onTouchEnd={toggleHandler}
      >
        Alarm
      </button>

      <section className=" flex h-5/6 w-11/12 flex-col items-end justify-start overflow-auto bg-transparent dark:bg-black-80">
        {alarm?.map((item) => {
          // eslint-disable-next-line no-underscore-dangle
          const id = item._id.$oid;
          return (
            <TimelineItem
              key={id}
              id={id}
              errorCode={item.error_code}
              severity={item.severity}
              name={item.name}
              time={item.time}
            />
          );
        })}
      </section>

      <section className="performance h-1/12">
        <h1 className="m-4 text-xl font-bold tracking-wider text-white">Performance</h1>
        <section className="performance__progress-circle-group mt-8 mb-12 flex justify-around gap-1 ">
          {data?.map((item) => {
            return (
              <CircularProgressbar key={item.name} text={item.name} value={item.value} />
            );
          })}
        </section>
      </section>

      <button
        ref={domNode}
        className="h-1/12 flex w-full justify-center bg-gray-120 hover:bg-gray-80 dark:bg-gray-220 dark:hover:bg-gray-180"
        onClick={toggleHandler}
        onTouchEnd={toggleHandler}
      >
        <TriangleIcon className="w-6 rotate-180" fill="#d8d8d8" />
      </button>
    </aside>
  );
};

export default memo(SidebarRight);
