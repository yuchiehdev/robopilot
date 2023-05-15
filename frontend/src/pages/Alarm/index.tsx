/* eslint-disable camelcase */
import React, { memo, useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import BeatLoader from 'react-spinners/BeatLoader';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import AUTHORIZATION from '../../data/authorization';
import dateToUTCTimestamp from '../../utils/dateToUTCTimestamp';
import IconText from '../../components/IconText';
import Modal from '../../layout/Modal';
import Paginator from '../../layout/Paginator';
import Selector from '../../components/Selector';
import TableHeader from '../../components/Table/TableHeader';
import TagInput from '../../components/TagInput';
import UpdateAt from '../../components/UpdateAt';
import useModal from '../../hooks/useModal';
import usePagination from '../../hooks/usePagination';
import useSpinnerTimer from '../../hooks/useSpinnerTimer';
import { getAlarm } from '../../api/alarm';
import { useAppSelector, useAppDispatch } from '../../store';
import { alarmAction, fixAlarm } from '../../store/alarmSlice';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';
import { ReactComponent as WrenchIcon } from '../../assets/icons/wrench.svg';
import type { AlarmType, TagObjType } from '../../types';
import { override } from '../../data/constant';

type PermissionType = 'Guest' | 'Engineer' | 'Site Vender' | 'Developer';
type TableHeaderItem = {
  name: string;
  sortBy: string;
};

type fixItemType = {
  id: string;
  name: string;
  device: string;
  errorCode: number;
};

const refetchInterval = 1000;

const tableCeil: TableHeaderItem[] = [
  { name: 'Time', sortBy: 'time' },
  { name: 'Name', sortBy: 'name' },
  { name: 'Severity', sortBy: 'severity' },
  { name: 'Error Code', sortBy: 'errorCode' },
  { name: 'Function', sortBy: 'function' },
];

const dropdownItems: TableHeaderItem[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const getIconColor = (theme: string, pending: boolean, permission: PermissionType) => {
  if (!AUTHORIZATION.Device.update.has(permission) || pending) return '#a8aaae';
  return theme === 'light' ? 'rgb(0, 108, 146)' : 'rgb(142,211,0)';
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
        case 'Severity':
          return item.severity.includes(tagObj.input.trim().toLowerCase());
        case 'Error Code':
          return item.errorCode.toString() === tagObj.input.trim().toLowerCase();
        case 'Function':
          return item.function.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Activation':
          return item.activation.toString().includes(tagObj.input.trim().toLowerCase());
        default:
          return item;
      }
    });
    return result;
  });
};

const Alarm = () => {
  const dispatch = useAppDispatch();
  const [displayData, setDisplayData] = useState<AlarmType[]>([]);
  const [tagObjs, setTagObjs] = useState<TagObjType[]>([]);
  const [fixItem, setFixItem] = useState<fixItemType | null>(null);
  const [clickFixAlarm, setClickFixAlarm] = useState<boolean>(false);
  const { isOpen, toggleModal } = useModal();
  const ref = useRef<HTMLInputElement>(null);
  const alarm = useAppSelector((state) => state.alarm.alarm);
  const displayAlarm = useAppSelector((state) => state.alarm.displayAlarm);
  const permission = useAppSelector((state) => state.user.permission);
  const theme = useAppSelector((state) => state.user.theme);
  const viewRows = useAppSelector((state) => state.alarm.viewRows);
  const { showSpinner, setShowSpinner } = useSpinnerTimer(1.3);

  const {
    goPrev,
    goNext,
    jumpTo,
    currentData: currentPageData,
    currentPage,
    maxPage,
  } = usePagination(displayData || [], viewRows);

  const { data, isLoading } = useQuery<AlarmType[], Error>({
    queryKey: ['alarms'],
    queryFn: getAlarm,
    refetchInterval,
    onError: (err) => {
      throw err;
    },
    suspense: true,
  });

  const formattedData = useMemo(() => {
    if (data) {
      return data.map((item: AlarmType) => {
        const {
          _id: { $oid },
          timestamp: { $date },
          name,
          severity,
          error_code,
        } = item;
        return {
          ...item,
          id: $oid,
          time: dayjs($date).format('YYYY-MM-DD HH:mm:ss'),
          name,
          severity,
          errorCode: error_code,
          showMsg: false,
        };
      });
    }
    return [];
  }, [data]);

  const sortHandler = (name: string) => {
    dispatch(alarmAction.sortAlarm(name));
  };

  const showErrorMsgHandler = (id: string) => {
    dispatch(alarmAction.showErrorMsg(id));
  };

  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(alarmAction.changeViewRows(Number(e.target.value)));
  };

  const fixAlarmHandler = (id: string, device: string, errorCode: number) => {
    dispatch(fixAlarm({ id, device, errorCode }));
    setClickFixAlarm(true);
    setShowSpinner(true);
    setFixItem(null);

    setTimeout(() => {
      setClickFixAlarm(false);
    }, 1300);
  };

  useEffect(() => {
    dispatch(alarmAction.setAlarms(formattedData));
  }, [dispatch, formattedData]);

  useEffect(() => {
    if (tagObjs.length === 0) {
      const turnIntoArray = (items: AlarmType[]) => [...items];
      setDisplayData(turnIntoArray(displayAlarm));
    } else {
      setDisplayData(
        filterTagInputResult(tagObjs, displayAlarm)[
          filterTagInputResult(tagObjs, displayAlarm).length - 1
        ],
      );
    }
  }, [tagObjs, displayAlarm]);

  useEffect(() => {
    const turnIntoArray = (items: AlarmType[]) => {
      return items.map((item: any) => {
        return item;
      });
    };
    setDisplayData(turnIntoArray(alarm));
  }, [dispatch, alarm]);

  return (
    <main className="relative flex flex-col overflow-scroll bg-white dark:bg-black">
      {displayAlarm.length > 0 ? (
        <section className="f-auto w-full">
          <section className="mx-auto flex w-11/12 items-center p-2">
            <section className="flex w-1/3 items-center gap-2">
              <strong className="text-lg dark:text-white">Last Updated: </strong>
              <UpdateAt
                queryKey={['alarm']}
                queryFn={getAlarm}
                refetchInterval={refetchInterval}
              />
            </section>

            <section className="w-2/3">
              <TagInput
                dropdownItems={dropdownItems}
                tagObjs={tagObjs}
                setTagObjs={setTagObjs}
                forwardRef={ref}
              />
            </section>
          </section>

          <table className="relative mx-auto mb-8 mt-5 w-11/12">
            <thead className="sticky top-0 z-20">
              <tr className="border-2 border-table-border bg-table-bg text-table-font">
                <th className="dark:bg-gray-220 dark:text-light-60">{null}</th>
                {tableCeil.map((item) => {
                  return (
                    <TableHeader item={item} key={item.name} sortHandler={sortHandler} />
                  );
                })}
                <th className="text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                  Fix
                </th>
              </tr>
            </thead>

            <tbody className="relative z-10">
              {currentPageData.map((item) => {
                const time = dayjs(new Date(item.timestamp.$date))
                  .format('YYYY/MM/DD HH:mm:ss')
                  .toString();
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      key={item.id}
                      className="event-row border-2 border-table-border text-sm leading-[3rem] hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100 dark:hover:text-black"
                    >
                      <td>
                        <button
                          className="z-50 rounded-full p-3 hover:bg-blue-exlight"
                          onClick={() => showErrorMsgHandler(item.id)}
                        >
                          <ToggleIcon
                            fill={theme === 'dark' ? '#fff' : 'black'}
                            className={`h-3 w-3 ${item.showMsg && 'rotate-90'}`}
                          />
                        </button>
                      </td>
                      <td>{time}</td>
                      <td
                        style={{
                          width: '30%',
                          lineHeight: '1.5rem',
                          paddingRight: '0.5rem',
                        }}
                      >
                        {item.name}
                      </td>
                      <td>{item.severity}</td>
                      <td>{item.error_code}</td>
                      <td
                        style={{
                          width: '30%',
                          lineHeight: '1.5rem',
                          paddingRight: '0.5rem',
                        }}
                      >{`${item.function}`}</td>
                      <td>
                        <button
                          className="flex w-5 cursor-pointer items-center transition hover:scale-125 disabled:hover:scale-100 disabled:hover:cursor-not-allowed"
                          disabled={
                            clickFixAlarm || !AUTHORIZATION.Alarm.update.has(permission)
                          }
                          key={item.id}
                          id={item.id}
                          onClick={() => {
                            toggleModal();
                            setFixItem({
                              id: item.id,
                              device: item.device,
                              errorCode: item.errorCode,
                              name: item.name,
                            });
                          }}
                        >
                          <WrenchIcon
                            fill={getIconColor(theme, clickFixAlarm, permission)}
                          />
                        </button>
                      </td>
                    </tr>
                    {item.showMsg && (
                      <tr className="border-2 border-table-border bg-table-hover dark:bg-gray-220 dark:text-gray-60">
                        {item.showMsg && (
                          <td colSpan={7} className="w-full rounded-b-lg p-4 pl-10">
                            {item.desc && (
                              <p className="text-sm">
                                <span className="font-semibold">Description: </span>
                                {item.desc}
                              </p>
                            )}
                            {item.function && (
                              <p className="text-sm">
                                <span className="font-semibold">Function: </span>
                                {item.function}
                              </p>
                            )}
                            {item.solution && (
                              <p className="text-sm">
                                <span className="font-semibold">Solution: </span>
                                {item.solution}
                              </p>
                            )}
                            {item.msg &&
                              item.msg.length &&
                              item.msg.map((errorMsg: string, index: number) => {
                                return (
                                  <p
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${errorMsg}-${index}`}
                                    className="mb-1 text-sm"
                                  >
                                    <span className="font-semibold">Message: </span>
                                    {errorMsg.replaceAll('_', ' ')}
                                  </p>
                                );
                              })}
                          </td>
                        )}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <section className="relative mb-10 flex justify-center">
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

          {showSpinner && (
            <div className="absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.7)]">
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

          <Modal
            isOpen={isOpen}
            onClick={toggleModal}
            tailwindClass="flex flex-col items-center justify-center p-8 dark:bg-black dark:text-white"
            width="w-full md:w-1/2 lg:w-1/3"
            height="h-full md:h-1/2 lg:h-1/3"
          >
            <>
              <h5 className="text-md">
                Fixed
                <span className="px-2 font-semibold">{fixItem?.name}</span>
                already ?
              </h5>

              <section className="flex gap-6">
                <button
                  onClick={() => {
                    if (fixItem) {
                      toggleModal();
                      fixAlarmHandler(fixItem.id, fixItem.device, fixItem.errorCode);
                    }
                  }}
                  className="mx-auto mt-8 rounded-xl bg-wiwynn-blue px-6 py-2 font-semibold tracking-wide text-white"
                >
                  Fixed
                </button>

                <button
                  onClick={() => {
                    toggleModal();
                    setFixItem(null);
                  }}
                  className="mx-auto mt-8 rounded-xl bg-gray-80 px-6 py-2 font-semibold tracking-wide text-white"
                >
                  Cancel
                </button>
              </section>
            </>
          </Modal>
        </section>
      ) : (
        !isLoading && <IconText text="No Alarm Report" width=" w-32" />
      )}
    </main>
  );
};

export default memo(Alarm);
