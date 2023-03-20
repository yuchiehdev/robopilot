import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import type { SortBy } from '../../store/eventQuerySlice';
import { eventActions } from '../../store/eventQuerySlice';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up.svg';

const EventHeader = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const sortStatus = useAppSelector((state) => state.eventQuery.sortStatus);
  const sortHandler = useCallback(
    (name: SortBy) => {
      dispatch(eventActions.sortEvent(name));
    },
    [dispatch],
  );
  return (
    <th className="text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
      <button
        className="flex items-center"
        onClick={() => sortHandler(item.sortBy as SortBy)}
        onTouchEnd={() => sortHandler(item.sortBy as SortBy)}
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
