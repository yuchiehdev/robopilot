import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';

import Modal from '../../layout/Modal';
import Selector from '../../components/Selector';
import SearchBar from '../../components/SearchBar';
import EverythingFine from '../../components/IconText';
import Paginator from '../../layout/Paginator';
import useModal from '../../hooks/useModal';
import usePagination from '../../hooks/usePagination';
import { useAppSelector, useAppDispatch } from '../../store';
import { alarmActions, fixAlarm, fetchAlarmData } from '../../store/alarmSlice';
import { maintenanceActions } from '../../store/maintenanceSlice';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';
import { ReactComponent as WrenchIcon } from '../../assets/icons/wrench.svg';
import { ReactComponent as RecordIcon } from '../../assets/icons/write-record.svg';
import type { SortBy } from '../../store/alarmSlice';

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

const tableCeil: TableHeaderItem[] = [
  { name: 'Time', sortBy: 'time' },
  { name: 'Name', sortBy: 'name' },
  { name: 'Severity', sortBy: 'severity' },
  { name: 'Error Code', sortBy: 'errorCode' },
  { name: 'Function', sortBy: 'function' },
];

const Alarm = () => {
  const fetchDataInterval = useRef<NodeJS.Timeout>();
  // const [openModel, setOpenModel] = useState(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const [fixItem, setFixItem] = useState<fixItemType | null>(null);
  const [clickFixAlarm, setClickFixAlarm] = useState<boolean>(false);
  const { isOpen, toggleModal } = useModal();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const theme = useAppSelector((state) => state.user.theme);
  const sortStatus = useAppSelector((state) => state.alarm.sortStatus);
  const viewRows = useAppSelector((state) => state.alarm.viewRows);
  const alarmCount = useAppSelector((state) => state.alarm.alarmCount);
  const fixResult = useAppSelector((state) => state.alarm.fixAlarm);
  const displayAlarm = useAppSelector((state) => state.alarm.displayAlarm);
  const fetchTime = useAppSelector((state) => state.alarm.fetchTime);
  const displayErrorMsg = useAppSelector((state) => state.alarm.displayErrorMsg);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    goPrev,
    goNext,
    jumpTo,
    currentData: currentPageData,
    currentPage,
    maxPage,
  } = usePagination(displayAlarm, viewRows);

  const showErrorMsgHandler = useCallback(
    (id: string) => {
      dispatch(alarmActions.showErrorMsg(id));
    },
    [dispatch],
  );

  const sortHandler = useCallback(
    (name: SortBy) => {
      dispatch(alarmActions.sortAlarm(name));
    },
    [dispatch],
  );

  const changeViewRowsHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(alarmActions.changeViewRows(Number(e.target.value)));
    },
    [dispatch],
  );

  const filterEventHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchInput(e.target.value);
      dispatch(alarmActions.filterAlarm(e.target.value));
    },
    [dispatch],
  );

  const fixAlarmHandler = (id: string, device: string, errorCode: number) => {
    dispatch(fixAlarm({ id, device, errorCode }));
    dispatch(fetchAlarmData());
    setClickFixAlarm(true);
    setSearchInput('');
    setFixItem(null);
  };

  const navigateToMaintenance = useCallback(
    (name: string) => {
      dispatch(maintenanceActions.setFilterKeyword(name));
      navigate('/maintenance');
    },
    [dispatch, navigate],
  );

  const clearSearchInputHandler = useCallback(() => {
    setSearchInput('');
    dispatch(fetchAlarmData());
  }, [dispatch]);

  useEffect(() => {
    if (searchInput === '' && !displayErrorMsg.length) {
      fetchDataInterval.current = setInterval(() => {
        dispatch(fetchAlarmData());
      }, 1000);
    }

    return () => {
      clearInterval(fetchDataInterval.current);
    };
  }, [searchInput, displayErrorMsg.length, dispatch]);

  useEffect(() => {
    if (searchInput) {
      clearInterval(fetchDataInterval.current);
    }
  }, [searchInput]);

  useEffect(() => {
    if (clickFixAlarm && fixResult.status !== undefined) {
      toast(fixResult.message, {
        autoClose: 1000,
        type: fixResult.status === 200 ? 'success' : 'error',
      });
      setTimeout(() => {
        dispatch(fetchAlarmData());
      }, 1000);

      setTimeout(() => {
        setClickFixAlarm(false);
      }, 2000);
    }
  }, [clickFixAlarm, fixResult.message, fixResult.status, dispatch]);

  return (
    <main className="relative flex overflow-scroll bg-white dark:bg-black">
      <ToastContainer />
      <section className="absolute top-3 left-16 mt-2">
        <strong className="text-lg dark:text-white">Last Updated: </strong>
        <span className="dark:text-white">{fetchTime}</span>
      </section>
      {alarmCount > 0 ? (
        <div className="flex h-max w-full flex-col">
          <section className="absolute right-14 top-3 inline-block h-10 w-min">
            <SearchBar
              searchInput={searchInput}
              onChange={filterEventHandler}
              onClear={clearSearchInputHandler}
            />
          </section>
          <table className="mx-auto mb-5 mt-20 w-11/12">
            <thead>
              <tr className="bg-gray-80 dark:bg-gray-220">
                <th>{null}</th>
                {tableCeil.map((item) => {
                  return (
                    <th
                      key={item.name}
                      className="text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60"
                    >
                      <button
                        className="flex items-center"
                        onClick={() => sortHandler(item.sortBy as SortBy)}
                        onTouchEnd={() => sortHandler(item.sortBy as SortBy)}
                      >
                        <span>{item.name}</span>
                        <span className="ml-2 inline-block w-3">
                          <ArrowIcon
                            className={
                              sortStatus.orderBy === item.sortBy && !sortStatus.isDesc
                                ? 'rotate-180'
                                : ''
                            }
                            fill={
                              sortStatus.orderBy === item.sortBy
                                ? 'rgb(0,108,146)'
                                : '#6f6f6f'
                            }
                          />
                        </span>
                      </button>
                    </th>
                  );
                })}
                <th className="text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                  Fix
                </th>
              </tr>
            </thead>

            <tbody>
              {currentPageData.map((item) => {
                const time = dayjs(new Date(item.timestamp.$date))
                  .format('YYYY/MM/DD HH:mm:ss')
                  .toString();
                return (
                  <>
                    <tr
                      key={item.id}
                      className="event-row border-b border-light-120 text-sm leading-[3rem] dark:border-gray-200 dark:text-light-100"
                    >
                      <td>
                        <button
                          className="z-50 rounded-full p-3 hover:bg-gray-80"
                          onClick={() => showErrorMsgHandler(item.id)}
                        >
                          <ToggleIcon
                            fill={theme === 'dark' ? '#fff' : 'black'}
                            className={`h-3 w-3 ${item.showMsg && 'rotate-90'}`}
                          />
                        </button>
                      </td>
                      <td>{time}</td>
                      <td>{item.name}</td>
                      <td>{item.severity}</td>
                      <td>{item.error_code}</td>
                      <td>{item.function}</td>
                      <td>
                        {item.name === 'maintenance expired' ? (
                          <button
                            className="flex w-5 cursor-pointer items-center transition hover:scale-125"
                            onClick={() => navigateToMaintenance(item.msg[0])}
                          >
                            <RecordIcon
                              fill={
                                theme === 'light' ? 'rgb(0,108,146)' : 'rgb(142, 211, 0)'
                              }
                            />
                          </button>
                        ) : (
                          <button
                            className="flex w-5 cursor-pointer items-center transition hover:scale-125 disabled:hover:scale-100 disabled:hover:cursor-not-allowed"
                            disabled={clickFixAlarm || !isSignIn}
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
                              fill={
                                clickFixAlarm || !isSignIn
                                  ? '#979797'
                                  : 'rgb(142, 211, 0)'
                              }
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                    {item.showMsg && (
                      <tr className=" bg-light-120 dark:bg-gray-220 dark:text-gray-60">
                        {item.showMsg && (
                          <td colSpan={7} className="w-full rounded-b-lg p-4 pl-10">
                            {item.desc && (
                              <p className="text-sm">
                                <span className="font-semibold">Description: </span>
                                {item.desc}
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
                  </>
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
        </div>
      ) : (
        <EverythingFine text="No Alarm" width=" w-32" />
      )}
    </main>
  );
};

export default memo(Alarm);
