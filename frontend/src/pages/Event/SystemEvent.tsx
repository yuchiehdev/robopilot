/* eslint-disable camelcase */
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import EventBody from './EventBody';
import EventHeader from './EventHeader';
import EverythingFine from '../../components/IconText';
import dateToUTCTimestamp, {
  fullStringToUTCTimestamp,
} from '../../utils/dateToUTCTimestamp';
import Paginator from '../../layout/Paginator';
import Selector from '../../components/Selector';
import TagInput from '../../components/TagInput';
import usePagination from '../../hooks/usePagination';
import UpdateAt from '../../components/UpdateAt';
import { getEvent } from '../../api/event';
import { eventActions } from '../../store/eventSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import type { EventType, TagObjType } from '../../types';

export type TableHeaderItemType = {
  name: string;
  sortBy: string;
  ceilWidth?: string;
};

const tableCeil: TableHeaderItemType[] = [
  { name: 'Time', sortBy: 'time' },
  {
    name: 'Deactivated Time',
    sortBy: 'deactivatedTime',
  },
  { name: 'Name', sortBy: 'name', ceilWidth: '20%' },
  { name: 'Severity', sortBy: 'severity' },
  { name: 'Error Code', sortBy: 'errorCode' },
  { name: 'Activation', sortBy: 'activation' },
];

const dropdownItems: TableHeaderItemType[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const filterTagInputResult = (
  tags: { category: string; input: string }[],
  fetchData: any,
) => {
  dayjs.extend(customParseFormat);
  let result = fetchData;
  return tags.map((tagObj: { category: string; input: string }) => {
    let tagStr = 0;
    let tagEnd = 0;
    if (tagObj.category === 'Time' || tagObj.category === 'Deactivated Time') {
      tagStr = dateToUTCTimestamp(
        new Date(tagObj.input.split(' ')[0]),
        `${tagObj.input.split(' ')[1]} ${tagObj.input.split(' ')[2]}`,
      );
      tagEnd = dateToUTCTimestamp(
        new Date(tagObj.input.split(' ')[4]),
        `${tagObj.input.split(' ')[5]} ${tagObj.input.split(' ')[6]}`,
      );
    }
    result = result.filter((item: any) => {
      switch (tagObj.category) {
        case 'id':
          return item.id.toString().includes(tagObj.input.trim().toLowerCase());
        case 'Search All':
          return (
            item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase()) ||
            item.severity.includes(tagObj.input.trim().toLowerCase()) ||
            item.errorCode.toString().includes(tagObj.input.trim().toLowerCase()) ||
            item.activation.toString().includes(tagObj.input.trim().toLowerCase()) ||
            dayjs(item.time)
              .format('YYYY/MM/DD HH:mm:ss')
              .includes(tagObj.input.trim().toLowerCase()) ||
            dayjs(item.deactivatedTime)
              .format('YYYY/MM/DD HH:mm:ss')
              .includes(tagObj.input.trim().toLowerCase())
          );
        case 'Name':
          return item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Time': {
          const time = fullStringToUTCTimestamp(String(item.time));
          return time >= tagStr && time <= tagEnd;
        }
        case 'Deactivated Time':
          if (!item.deactivate_timestamp) return false;
          return (
            Math.round(
              dayjs(new Date(item.deactivate_timestamp.$date)).valueOf() / 1000,
            ) >= tagStr &&
            Math.round(
              dayjs(new Date(item.deactivate_timestamp.$date)).valueOf() / 1000,
            ) <= tagEnd
          );
        case 'Severity':
          return item.severity.includes(tagObj.input.trim().toLowerCase());
        case 'Error Code':
          return item.errorCode.toString() === tagObj.input.trim().toLowerCase();
        case 'Activation':
          return item.activation.toString().includes(tagObj.input.trim().toLowerCase());
        default:
          return item;
      }
    });
    return result;
  });
};

const SystemEvent = () => {
  dayjs.extend(utc);
  const dispatch = useAppDispatch();
  const [tagObjs, setTagObjs] = useState<TagObjType[]>([]);
  const [displayData, setDisplayData] = useState<EventType[]>([]);
  const viewRows = useAppSelector((state) => state.eventQuery.viewRows);
  const filterTag = useAppSelector((state) => state.eventQuery.filterTag);
  const events = useAppSelector((state) => state.eventQuery.displayEvent);

  const { data } = useQuery<EventType[], Error>({
    queryKey: ['event'],
    queryFn: getEvent,
    suspense: true,
    refetchInterval: 1000,
    onError: (err) => {
      throw err;
    },
  });

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
          time: dayjs(new Date($date)).format('YYYY-MM-DD HH:mm:ss').toString(),
          deactivatedTime: deactivate_timestamp
            ? dayjs(new Date(deactivate_timestamp.$date))
                .format('YYYY/MM/DD HH:mm:ss')
                .toString()
            : '',
          name,
          severity,
          errorCode: error_code,
          activation: activation.toString(),
          showMsg: false,
        };
      });
    }
    return [];
  }, [data]);
  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(eventActions.changeViewRows(Number(e.target.value)));
  };

  const showErrorMsgHandler = (id: string) => {
    const newEvents = events.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          showMsg: !item.showMsg,
        };
      }
      return item;
    });
    dispatch(eventActions.setEvents(newEvents));
  };

  useEffect(() => {
    dispatch(eventActions.sortEvent(''));
    dispatch(eventActions.setEvents(formattedData));
  }, [dispatch, formattedData]);

  useEffect(() => {
    if (tagObjs.length === 0) {
      const turnIntoArray = (items: EventType[]) => [...items];
      setDisplayData(turnIntoArray(events));
    } else {
      setDisplayData(
        filterTagInputResult(tagObjs, events)[
          filterTagInputResult(tagObjs, events).length - 1
        ],
      );
    }
  }, [tagObjs, events]);

  useEffect(() => {
    // for bar chart redirect in dashboard component
    if (filterTag.dashboardTable) {
      setTagObjs([
        {
          category: 'id',
          input: filterTag.dashboardTable,
        },
      ]);
    } else {
      const turnIntoArray = (items: EventType[]) => {
        return items.map((item: any) => {
          return item;
        });
      };
      setDisplayData(turnIntoArray(events));
    }
    return () => {
      dispatch(
        eventActions.filterTag({
          perato: '',
          dashboardTable: '',
        }),
      );
    };
  }, [filterTag, dispatch]);

  const { goPrev, goNext, jumpTo, currentData, currentPage, maxPage } = usePagination(
    displayData || [],
    viewRows,
  );

  return (
    <main className="relative flex flex-col overflow-y-scroll bg-white dark:bg-black">
      {events.length > 0 ? (
        <section className="h-auto w-full">
          <section className="mx-auto flex w-11/12 items-center p-2">
            <section className="w-1/3">
              <strong className="text-lg dark:text-white">Last Updated: </strong>
              <UpdateAt queryKey={['event']} queryFn={getEvent} refetchInterval={1000} />
            </section>

            <section className="w-2/3">
              <TagInput
                dropdownItems={dropdownItems}
                tagObjs={tagObjs}
                setTagObjs={setTagObjs}
              />
            </section>
          </section>

          <table className="relative mx-auto mt-5 mb-8 w-11/12">
            <thead className="sticky top-0 z-20">
              <tr className="border-2 border-table-border bg-table-bg text-table-font">
                <th className="dark:bg-gray-220 dark:text-light-60">{null}</th>
                {tableCeil.map((item: TableHeaderItemType) => {
                  return <EventHeader item={item} key={item.name} />;
                })}
              </tr>
            </thead>

            <tbody className="relative z-10">
              {currentData.map((item) => {
                return (
                  <EventBody<EventType>
                    tableCeil={tableCeil}
                    item={item}
                    key={item.id}
                    showErrorMsgHandler={showErrorMsgHandler}
                  />
                );
              })}
            </tbody>
          </table>
          <section className="relative mb-8 flex justify-center">
            <Paginator
              goPrev={goPrev}
              goNext={goNext}
              jumpTo={jumpTo}
              currentPage={currentPage}
              maxPage={maxPage}
            />
            <section className="absolute bottom-0 left-16 flex items-center text-gray-180 dark:text-light-100">
              View
              <span className="mx-5">
                <Selector
                  viewRows={viewRows}
                  selectorOptions={[10, 30, 50]}
                  onChange={changeViewRowsHandler}
                />
              </span>
              rows per page
            </section>
          </section>
        </section>
      ) : (
        <EverythingFine text="No Event" width=" w-32" />
      )}
    </main>
  );
};

export default SystemEvent;
