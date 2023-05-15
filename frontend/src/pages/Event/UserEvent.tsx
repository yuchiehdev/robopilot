import React, { useMemo, useState, useEffect } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { eventActions } from '../../store/eventSlice';
import { EventType, TagObjType } from '../../types';
import { USER_EVENT } from '../../data/fetchUrl';
import { TableHeaderItemType } from './SystemEvent';
import { useAppSelector, useAppDispatch } from '../../store';
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery';
import EverythingFine from '../../components/IconText';
import EventBody from './EventBody';
import EventHeader from './EventHeader';
import Paginator from '../../layout/Paginator';
import Selector from '../../components/Selector';
import TagInput from '../../components/TagInput';
import usePagination from '../../hooks/usePagination';
import UpdateAtWithAuth from '../../components/UpdateAt/UpdateAtWithAuth';
import dateToUTCTimestamp, {
  fullStringToUTCTimestamp,
} from '../../utils/dateToUTCTimestamp';

const tableCeil: TableHeaderItemType[] = [
  { name: 'Time', sortBy: 'time' },
  { name: 'Name', sortBy: 'username', ceilWidth: '15%' },
  { name: 'Access Level', sortBy: 'permission' },
  { name: 'Method', sortBy: 'method' },
  { name: 'API', sortBy: 'url', ceilWidth: '30%' },
];
const dropdownItems: TableHeaderItemType[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const filterTagInputResult = (
  tags: { category: string; input: string }[],
  fetchData: EventType[],
) => {
  dayjs.extend(customParseFormat);
  let result = fetchData;
  return tags.map((tagObj: { category: string; input: string }) => {
    let tagStr = 0;
    let tagEnd = 0;
    if (tagObj.category === 'Time') {
      tagStr = dateToUTCTimestamp(
        new Date(tagObj.input.split(' ')[0]),
        `${tagObj.input.split(' ')[1]} ${tagObj.input.split(' ')[2]}`,
      );
      tagEnd = dateToUTCTimestamp(
        new Date(tagObj.input.split(' ')[4]),
        `${tagObj.input.split(' ')[5]} ${tagObj.input.split(' ')[6]}`,
      );
    }
    result = result.filter((item: EventType) => {
      switch (tagObj.category) {
        case 'Search All':
          return (
            item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase()) ||
            item.permission.includes(tagObj.input.trim().toLowerCase()) ||
            item.method.toString().includes(tagObj.input.trim().toLowerCase()) ||
            item.url.toString().includes(tagObj.input.trim().toLowerCase()) ||
            dayjs(item.time)
              .format('YYYY/MM/DD HH:mm:ss')
              .includes(tagObj.input.trim().toLowerCase())
          );
        case 'Name':
          return item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Time': {
          const time = fullStringToUTCTimestamp(String(item.time));
          return time >= tagStr && time <= tagEnd;
        }
        case 'Access Level':
          return item.permission.includes(tagObj.input.trim().toLowerCase());
        case 'Method':
          return item.method.toString() === tagObj.input.trim().toUpperCase();
        case 'API':
          return item.url.toString().includes(tagObj.input.trim().toLowerCase());
        default:
          return item;
      }
    });
    return result;
  });
};

dayjs.extend(utc);

const UserEvent = () => {
  dayjs.extend(utc);
  const dispatch = useAppDispatch();
  const [tagObjs, setTagObjs] = useState<TagObjType[]>([]);
  const [displayData, setDisplayData] = useState<EventType[]>([]);
  const viewRows = useAppSelector((state) => state.eventQuery.viewRows);
  const username = { username: useAppSelector((state) => state.user.name) };
  const userEvent = useAppSelector((state) => state.eventQuery.displayEvent);
  const { data, isLoading } = useAuthenticatedQuery<EventType[]>(
    ['userEvent'],
    USER_EVENT,
    'GET',
    username,
    {
      refetchInterval: 1000,
    },
  );

  const formattedData = useMemo(() => {
    if (data) {
      return data.map((item: EventType) => {
        const {
          _id: { $oid },
          timestamp: { $date },
          response: { message },
        } = item;
        const msgArr = [];
        if (message) {
          msgArr.push(`[Response]\u2003${message}`);
        }
        return {
          ...item,
          id: $oid,
          name: item.username,
          time: dayjs.utc(new Date($date)).format('YYYY-MM-DD HH:mm:ss').toString(),
          msg: msgArr,
        };
      });
    }
    return [];
  }, [data]);
  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(eventActions.changeViewRows(Number(e.target.value)));
  };
  const showDetailHandler = (id: string) => {
    const newEvents = userEvent.map((item) => {
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
      setDisplayData(turnIntoArray(userEvent));
    } else {
      setDisplayData(
        filterTagInputResult(tagObjs, userEvent)[
          filterTagInputResult(tagObjs, userEvent).length - 1
        ],
      );
    }
  }, [tagObjs, userEvent]);
  const { goPrev, goNext, jumpTo, currentData, currentPage, maxPage } = usePagination(
    displayData || [],
    viewRows,
  );
  return (
    <main className="relative flex flex-col overflow-y-scroll bg-white dark:bg-black">
      {userEvent.length > 0 ? (
        <section className="h-auto w-full">
          <section className="mx-auto flex w-11/12 items-center p-2">
            <section className="w-1/3">
              <strong className="text-lg dark:text-white">Last Updated: </strong>
              <UpdateAtWithAuth queryKey={['userEvent']} url={USER_EVENT} method="GET" />
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
                    showErrorMsgHandler={showDetailHandler}
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
        !isLoading && <EverythingFine text="No Event" width=" w-32" />
      )}
    </main>
  );
};

export default UserEvent;
