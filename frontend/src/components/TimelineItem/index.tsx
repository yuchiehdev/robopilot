import React from 'react';
import type { Alarm } from '../../types';
import './timelineItem.scss';

const TimelineItem: React.FC<Alarm> = (props) => {
  const { id, errorCode, severity, name, time } = props;

  const borderColor = {
    critical: 'border-red-dark before:bg-red-dark',
    error: 'border-red before:bg-red',
    warning: 'border-yellow before:bg-yellow',
    info: 'border-wiwynn-green before:bg-wiwynn-green',
    debug: 'border-wiwynn-blue before:bg-wiwynn-blue',
  };

  return (
    <section
      key={id}
      className={`timeline-item before:content=[''] my-2 w-10/12 rounded-md  border-l-4 bg-white p-4 font-mono text-xs drop-shadow-md dark:bg-black-20 dark:text-light-80 ${borderColor[severity]}`}
    >
      <section className="flex justify-between ">
        <span>{time}</span>
      </section>
      <section className="my-2 text-sm font-bold">{name}</section>
      <section className="flex justify-between">
        <span> #{severity}</span>
        <span>#{errorCode}</span>
      </section>
    </section>
  );
};

export default React.memo(TimelineItem);
