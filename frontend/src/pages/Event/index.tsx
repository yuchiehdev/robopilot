/* eslint-disable camelcase */
import { useState, useEffect, useRef, CSSProperties, useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQuery } from '@tanstack/react-query';
import BeatLoader from 'react-spinners/BeatLoader';
import { ToastContainer, toast } from 'react-toastify';
import Paginator from '../../layout/Paginator';
import usePagination from '../../hooks/usePagination';
import { useAppSelector, useAppDispatch } from '../../store';
import { eventActions } from '../../store/eventQuerySlice';
import Selector from '../../components/Selector';
import TagInput from '../../components/TagInput';
import EverythingFine from '../../components/IconText';
import EventTableHeader from './EventHeader';
import EventBody from './EventBody';
import type { EventType } from '../../types';
import dateToUTCTimestamp from '../../utils/dateToUTCTimestamp';
import { getEvent } from '../../api/event';
import UpdateAt from './UpdateAt';
import 'react-toastify/dist/ReactToastify.css';

const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: '0 auto',
};

export type tagObjType = {
  category: string;
  input: string;
};

export type TableHeaderItem = {
  name: string;
  sortBy: string;
};

const tableCeil: TableHeaderItem[] = [
  { name: 'Time', sortBy: 'time' },
  {
    name: 'Deactivated Time',
    sortBy: 'deactivatedTime',
  },
  { name: 'Name', sortBy: 'name' },
  { name: 'Severity', sortBy: 'severity' },
  { name: 'Error Code', sortBy: 'errorCode' },
  { name: 'Activation', sortBy: 'activation' },
];

const dropdownItems: TableHeaderItem[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const Event = () => {
  const dispatch = useAppDispatch();
  const forwardRef = useRef<HTMLInputElement>(null);
  const [tagObjs, setTagObjs] = useState<tagObjType[]>([]);
  const [displayData, setDisplayData] = useState<string[]>([]);
  const viewRows = useAppSelector((state) => state.eventQuery.viewRows);
  const filterTag = useAppSelector((state) => state.eventQuery.filterTag);
  const events = useAppSelector((state) => state.eventQuery.displayEvent);
  const { data, isLoading, isError, error } = useQuery<EventType[], Error>({
    queryKey: ['events'],
    queryFn: getEvent,
    refetchInterval: 1000,
    onError: (err) => {
      toast.error(err.message);
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
          showMsg: false,
        };
      });
    }
    return [];
  }, [data]);
  useEffect(() => {
    dispatch(eventActions.setEvents(formattedData));
  }, [dispatch, formattedData]);

  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(eventActions.changeViewRows(Number(e.target.value)));
  };

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
          case 'Time':
            return (
              Math.round(dayjs(new Date(item.time)).valueOf() / 1000) >= tagStr &&
              Math.round(dayjs(new Date(item.time)).valueOf() / 1000) <= tagEnd
            );
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
    if (tagObjs.length === 0) {
      const turnIntoArray = (items: EventType[]) => {
        return items.map((item: any) => {
          return item;
        });
      };
      // console.log('turnIntoArray(events)', turnIntoArray(events));
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

  // if (isError) {
  //   if (error instanceof Error) {
  //     return <div>{error.message}</div>;
  //   }
  //   return <div>Unknown error occurred</div>;
  // }

  return (
    <main className="relative flex flex-col overflow-y-scroll bg-white dark:bg-black">
      <ToastContainer />
      {isLoading && (
        <div className="absolute top-0 left-0 h-full w-full bg-[rgba(232,232,232,0.7)]">
          <BeatLoader
            size={50}
            color="rgb(142,211,0)"
            loading
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <section className="absolute top-0 left-16 mt-2 hidden">
        <strong className="text-lg dark:text-white">Last Updated: </strong>
        <UpdateAt />
      </section>
      {events.length > 0 ? (
        <>
          <section className=" mx-auto mt-6 w-11/12">
            <TagInput
              dropdownItems={dropdownItems}
              tagObjs={tagObjs}
              setTagObjs={setTagObjs}
              forwardRef={forwardRef}
            />
          </section>
          <table className="mx-auto mt-5 mb-8 w-11/12">
            <thead>
              <tr className="border-2 border-table-border bg-table-bg text-table-font">
                <th>{null}</th>
                {tableCeil.map((item) => {
                  return <EventTableHeader item={item} key={item.name} />;
                })}
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => {
                return (
                  <EventBody
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
        </>
      ) : (
        !isLoading && <EverythingFine text="No Event" width=" w-32" />
      )}
    </main>
  );
};

export default Event;
