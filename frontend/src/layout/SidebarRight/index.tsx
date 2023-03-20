import React from 'react';
import CircularProgressbar from '../../components/CircularProgressbar';
import TimelineItem from '../../components/TimelineItem';
import useShowUI from '../../hooks/useShowUI';
import { useAppSelector, useAppDispatch } from '../../store';
import { userAction } from '../../store/userSlice';
import { type Alarm } from '../../types';
import { ReactComponent as TriangleIcon } from '../../assets/icons/triangle.svg';

type SidebarRightProps = {
  show: boolean;
  alarm: Alarm[];
};

const SidebarRight: React.FC<SidebarRightProps> = ({ show, alarm }) => {
  const [, showSBR] = useShowUI(show, 500);
  const showRightSidebar = useAppSelector((state) => state.user.showRightSidebar);

  const dispatch = useAppDispatch();

  const toggleHandler = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    dispatch(userAction.toggleRightSidebar());
    e.preventDefault();
  };

  const sensorData = useAppSelector((state) => state.sensor);

  if (!showSBR) return null;
  return (
    <aside
      className={`absolute right-0 bottom-0 z-50 flex h-screen w-2/12 flex-col items-center justify-between bg-gray-100 dark:bg-black-80 ${
        showRightSidebar ? 'animate-moveInBottom' : 'animate-moveOutBottom'
      }`}
    >
      <button
        className="h-[8vh] w-full shrink-0 text-xl  font-bold tracking-wider text-white hover:bg-gray-80 dark:hover:bg-gray-220"
        onClick={toggleHandler}
        onTouchEnd={toggleHandler}
      >
        Real time
      </button>
      <section className=" flex h-5/6 w-11/12 flex-col items-end justify-start overflow-auto bg-transparent dark:bg-black-80">
        {alarm.map((item) => (
          <TimelineItem {...item} key={item.id} />
        ))}
      </section>
      <section className="performance h-1/12">
        <h1 className="m-4 text-xl font-bold tracking-wider text-white">Performance</h1>
        <section className="performance__progress-circle-group mt-8 mb-12 flex justify-around gap-1 ">
          {sensorData.sensor.map((item) => {
            return <CircularProgressbar text={item.name} value={item.value} />;
          })}
        </section>
      </section>
      <button
        className="h-1/12 flex w-full justify-center bg-gray-120 hover:bg-gray-80 dark:bg-gray-220 dark:hover:bg-gray-180"
        onClick={toggleHandler}
        onTouchEnd={toggleHandler}
      >
        <TriangleIcon className="w-6 rotate-180" fill="#d8d8d8" />
      </button>
    </aside>
  );
};

export default React.memo(SidebarRight);
