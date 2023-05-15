/* eslint-disable camelcase */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { userAction } from '../../store/userSlice';
import { alarmAction } from '../../store/alarmSlice';
import './timelineItem.scss';

type TimelineItemProps = {
  id: string;
  errorCode: number;
  severity: 'critical' | 'error' | 'warning' | 'info' | 'debug';
  name: string;
  time: string | undefined;
};

const borderColor = {
  critical: 'border-red-dark before:bg-red-dark',
  error: 'border-red before:bg-red',
  warning: 'border-yellow before:bg-yellow',
  info: 'border-wiwynn-green before:bg-wiwynn-green',
  debug: 'border-wiwynn-blue before:bg-wiwynn-blue',
};

const TimelineItem: React.FC<TimelineItemProps> = (props) => {
  const { id, errorCode, severity, name, time } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickItem = (input: string) => {
    dispatch(userAction.toggleRightSidebar());
    dispatch(alarmAction.setFilterTag(input));
    navigate('/alarm');
  };

  return (
    <button
      key={id}
      className={`timeline-item before:content=[''] my-2 w-10/12 rounded-md  border-l-4 bg-white p-4 text-left font-mono text-xs drop-shadow-sm transition-all hover:-translate-y-1 hover:cursor-pointer hover:drop-shadow-md dark:bg-black-20 dark:text-light-80 ${borderColor[severity]}`}
      onClick={() => onClickItem(id)}
    >
      <section className="flex justify-between ">
        <span>{time}</span>
      </section>
      <section className="my-2 text-sm font-bold">{name}</section>
      <section className="flex justify-between">
        <span> #{severity}</span>
        <span>#{errorCode}</span>
      </section>
    </button>
  );
};

export default React.memo(TimelineItem);
