import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Selector from '../../components/Selector';
import SearchBar from '../../components/SearchBar';
import EverythingFine from '../../components/IconText';
import Paginator from '../../layout/Paginator';
import usePagination from '../../hooks/usePagination';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  maintenanceActions,
  fetchMaintenanceData,
  checkActiveItem,
  checkInactiveItem,
} from '../../store/maintenanceSlice';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up.svg';
import type { SortBy } from '../../store/maintenanceSlice';

type TableHeaderItem = {
  name: string;
  sortBy: string;
};

const tableCeil: TableHeaderItem[] = [
  { name: 'Inspection Point', sortBy: 'InspectionPoint' },
  { name: 'Cycle', sortBy: 'Cycle' },
  { name: 'Last Check', sortBy: 'timeStamp' },
  { name: 'Active', sortBy: 'isActive' },
];

const Maintenance = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [clickCheckbox, setClickCheckbox] = useState<boolean>(false);
  const inputRef = useRef<HTMLElement>();
  const fetchDataInterval = useRef<NodeJS.Timeout>();
  const dispatch = useAppDispatch();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const checkMaintenance = useAppSelector((state) => state.maintenance.checkMaintenance);
  const sortStatus = useAppSelector((state) => state.maintenance.sortStatus);
  const viewRows = useAppSelector((state) => state.maintenance.viewRows);
  const maintenanceCount = useAppSelector((state) => state.maintenance.maintenanceCount);
  const fetchTime = useAppSelector((state) => state.maintenance.fetchTime);
  const filterKeyword = useAppSelector((state) => state.maintenance.filterKeyword);
  const displayMaintenance = useAppSelector(
    (state) => state.maintenance.displayMaintenance,
  );

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (filterKeyword.length) {
      dispatch(maintenanceActions.directFromAlarm(filterKeyword));
      setSearchInput(filterKeyword);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      id = setTimeout(() => {
        dispatch(maintenanceActions.clearFilterKeyword());
      }, 1000 * 60 * 30);
    } else dispatch(fetchMaintenanceData());

    return () => {
      dispatch(maintenanceActions.clearFilterKeyword());
      if (id) {
        clearTimeout(id);
      }
    };
  }, [dispatch, filterKeyword]);

  useEffect(() => {
    if (searchInput === '') {
      fetchDataInterval.current = setInterval(() => {
        dispatch(maintenanceActions.clearFilterKeyword());
        dispatch(fetchMaintenanceData());
      }, 1000 * 60 * 60 * 12);
    }
    return () => clearInterval(fetchDataInterval.current);
  }, [dispatch, searchInput]);

  useEffect(() => {
    if (clickCheckbox && checkMaintenance.status !== undefined) {
      toast(checkMaintenance.message, {
        autoClose: 1000,
        type: checkMaintenance.status === 200 ? 'success' : 'error',
      });
      setTimeout(() => {
        dispatch(fetchMaintenanceData());
      }, 1000);

      setTimeout(() => {
        setClickCheckbox(false);
      }, 2000);
    }
  }, [clickCheckbox, checkMaintenance.message, checkMaintenance.status, dispatch]);

  const {
    goPrev,
    goNext,
    jumpTo,
    currentData: currentPageData,
    currentPage,
    maxPage,
  } = usePagination(displayMaintenance, viewRows);

  const sortHandler = useCallback(
    (name: SortBy) => {
      dispatch(maintenanceActions.sortData(name));
    },
    [dispatch],
  );

  const changeViewRowsHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(maintenanceActions.changeViewRows(Number(e.target.value)));
    },
    [dispatch],
  );

  const filterEventHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchInput(e.target.value);
      dispatch(maintenanceActions.setFilterKeyword(e.target.value));
      dispatch(maintenanceActions.filterMaintenance(e.target.value));
    },
    [dispatch],
  );

  const fixItemHandler = (deviceName: string, isActive: boolean) => {
    if (isActive) {
      dispatch(checkActiveItem(deviceName));
    } else {
      dispatch(checkInactiveItem(deviceName));
    }
    dispatch(fetchMaintenanceData());
    setClickCheckbox(true);
    setSearchInput('');
  };

  const clearSearchInputHandler = useCallback(() => {
    setSearchInput('');
    dispatch(maintenanceActions.clearFilterKeyword());
    dispatch(fetchMaintenanceData());
  }, [dispatch]);

  return (
    <main className="relative flex overflow-scroll bg-white dark:bg-black">
      <ToastContainer />
      <section className="absolute top-3 left-16 mt-2">
        <strong className="text-lg dark:text-white">Last Updated: </strong>
        <span className="dark:text-white">{fetchTime}</span>
        <span className="ml-3 text-sm text-gray-140 dark:text-white">
          (updated each 12 hours)
        </span>
      </section>
      {maintenanceCount > 0 ? (
        <div className="flex w-full flex-col">
          <section className="absolute right-14 top-3 inline-block h-10 w-min">
            <SearchBar
              searchInput={searchInput}
              onChange={filterEventHandler}
              onClear={clearSearchInputHandler}
              ref={inputRef}
            />
          </section>
          <table className="mx-auto mb-5 mt-20 w-11/12">
            <thead>
              <tr className="bg-gray-80 dark:bg-gray-220 ">
                {tableCeil.map((item) => {
                  return (
                    <th
                      key={item.name}
                      className="pl-3 text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60"
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
                return (
                  <tr
                    key={item.id}
                    className="event-row border-b border-light-120 text-sm leading-[3rem] dark:border-gray-200 dark:text-light-100"
                  >
                    <td className={`pl-3 ${item.active ? 'font-bold' : undefined}`}>
                      {item.InspectionPoint}
                    </td>
                    <td className={`${item.active ? 'font-bold' : undefined}`}>
                      {item.Cycle}
                    </td>
                    <td className={`${item.active ? 'font-bold' : undefined}`}>
                      {item.time}
                    </td>
                    <td>
                      {item.active ? (
                        <span className="mr-2 flex h-6 w-20 items-center justify-center rounded-full bg-red font-bold text-white">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="mr-2 flex h-6 w-20 items-center justify-center rounded-full bg-gray-80 font-bold text-white dark:text-black">
                          inactive
                        </span>
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        id={item.id}
                        key={`${item.id}-${item.timeStamp}`}
                        disabled={!isSignIn || clickCheckbox}
                        className="scale-150 cursor-pointer focus-visible:outline-0"
                        onClick={() => fixItemHandler(item.InspectionPoint, item.active)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <section className="relative mb-16 flex justify-center">
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
        </div>
      ) : (
        <EverythingFine text="No Maintenance Report" width=" w-32" />
      )}
    </main>
  );
};

export default memo(Maintenance);
