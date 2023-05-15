/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAppSelector } from '../../store';
import { getEventByTime } from '../../api/event';
import { stringToUTCTimestamp } from '../../utils/dateToUTCTimestamp';
import type { EventType } from '../../types';
import quickSort from '../../utils/quickSort';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
}
const List = <T,>({ items, renderItem }: ListProps<T>) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{renderItem(item)}</li>
    ))}
  </ul>
);

const QueryTest = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [input, setInput] = useState('');
  const startDateTime = useAppSelector((state) => state.dashboard.startDateTime);
  const endDateTime = useAppSelector((state) => state.dashboard.endDateTime);
  const utcTimestamp = {
    gte: stringToUTCTimestamp(startDateTime.date, startDateTime.time) || 0,
    lte: stringToUTCTimestamp(endDateTime.date, endDateTime.time) || 0,
  };
  const { data, dataUpdatedAt } = useQuery(
    ['eventsByTime', startDateTime, endDateTime],
    () => getEventByTime(utcTimestamp),
    {
      keepPreviousData: true,
    },
  );

  const formattedData = useMemo(() => {
    if (data) {
      return data.map((item: EventType) => {
        const {
          _id: { $oid },
          timestamp: { $date },
          deactivate_timestamp,
          name,
          severity,
          error_code,
          activation,
        } = item;
        return {
          ...item,
          id: $oid,
          time: dayjs($date).format('YYYY-MM-DD HH:mm:ss'),
          deactivatedTime: deactivate_timestamp
            ? dayjs(new Date(deactivate_timestamp.$date))
                .format('YYYY/MM/DD HH:mm:ss')
                .toString()
            : '',
          name,
          severity,
          errorCode: error_code,
          activation: activation.toString(),
        };
      });
    }
    return [];
  }, [data]);

  const sortHandler = (e: any) => {
    e.preventDefault();
    const sortedData = quickSort(formattedData, input, false);
    setEvents(sortedData);
  };

  useEffect(() => {
    setEvents(formattedData);
  }, [formattedData]);

  return (
    <div>
      <h1>QueryTest</h1>
      <p>dataUpdatedAt: {dataUpdatedAt}</p>
      <form onSubmit={sortHandler}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
      <List
        items={['a', 'b', 'c']}
        renderItem={(item) => (
          <div>
            <h1 className="text-[gold]">{item}</h1>
          </div>
        )}
      />
    </div>
  );
};

export default QueryTest;
