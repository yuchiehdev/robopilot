import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { eventActions } from '../../store/eventSlice';
import type { TableHeaderItemType } from './SystemEvent';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up.svg';

type EventHeaderProps = {
  item: TableHeaderItemType;
};

const EventHeader = ({ item }: EventHeaderProps) => {
  const dispatch = useAppDispatch();
  const sortStatus = useAppSelector((state) => state.eventQuery.sortStatus);

  const sortHandler = useCallback(
    (name: string) => {
      dispatch(eventActions.sortEvent(name));
    },
    [dispatch],
  );

  return (
    <th className="text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
      <button
        className="flex items-center"
        onClick={() => sortHandler(item.sortBy)}
        onTouchEnd={() => sortHandler(item.sortBy)}
      >
        <span>{item.name}</span>
        <span className="ml-2 inline-block w-3">
          <ArrowIcon
            className={
              sortStatus.orderBy === item.sortBy && !sortStatus.isDesc ? 'rotate-180' : ''
            }
            fill={sortStatus.orderBy === item.sortBy ? 'rgb(0,108,146)' : '#6f6f6f'}
          />
        </span>
      </button>
    </th>
  );
};

export default EventHeader;
