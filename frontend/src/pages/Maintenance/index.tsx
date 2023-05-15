import React, { memo, useState, useEffect, useMemo, useRef, CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import BeatLoader from 'react-spinners/BeatLoader';
import dayjs from 'dayjs';

import AUTHORIZATION from '../../data/authorization';
import IconText from '../../components/IconText';
import Paginator from '../../layout/Paginator';
import Selector from '../../components/Selector';
import TableHeader from '../../components/Table/TableHeader';
import TagInput from '../../components/TagInput';
import UpdateAt from '../../components/UpdateAt';
import usePagination from '../../hooks/usePagination';
import useSpinnerTimer from '../../hooks/useSpinnerTimer';
import { getMaintenance } from '../../api/maintenance';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  maintenanceActions,
  checkActiveItem,
  checkInactiveItem,
} from '../../store/maintenanceSlice';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';
import type { MaintenanceType } from '../../types';

type TableHeaderItem = {
  name: string;
  sortBy: string;
};

type tagObjType = {
  category: string;
  input: string;
};

const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: '0 auto',
};

const tableCeil: TableHeaderItem[] = [
  { name: 'Item', sortBy: 'Item' },
  { name: 'Duration', sortBy: 'Duration' },
  { name: 'Last Check', sortBy: 'timeStamp' },
  { name: 'Active', sortBy: 'isActive' },
];

const dropdownItems: TableHeaderItem[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const refetchInterval = 1000 * 60 * 60 * 12;

const Maintenance = () => {
  const [clickCheckbox, setClickCheckbox] = useState<boolean>(false);
  const [tagObjs, setTagObjs] = useState<tagObjType[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const permission = useAppSelector((state) => state.user.permission);
  const theme = useAppSelector((state) => state.user.theme);
  const viewRows = useAppSelector((state) => state.maintenance.viewRows);
  const displayMaintenance = useAppSelector(
    (state) => state.maintenance.displayMaintenance,
  );
  const { showSpinner, setShowSpinner } = useSpinnerTimer(1.3);

  const {
    goPrev,
    goNext,
    jumpTo,
    currentData: currentPageData,
    currentPage,
    maxPage,
  } = usePagination(displayMaintenance, viewRows);

  const { data, refetch } = useQuery<MaintenanceType[], Error>({
    queryKey: ['maintenance'],
    queryFn: getMaintenance,
    refetchInterval: 1000 * 60 * 60 * 12,
    suspense: true,
  });

  const formattedData = useMemo(() => {
    if (data) {
      return data.map((item: MaintenanceType) => {
        const {
          _id: { $oid },
          LastCheck: { $date },
          active,
          Item,
        } = item;
        const activation: 1 | 0 = active ? 1 : 0;
        return {
          ...item,
          id: $oid,
          time: dayjs($date).format('YYYY-MM-DD HH:mm:ss'),
          showMsg: false,
          isActive: activation,
          InspectionPoint: Item.replaceAll('_', ' '),
          timeStamp: $date,
          showDescription: false,
        };
      });
    }
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(maintenanceActions.setMaintenances(formattedData));
  }, [dispatch, formattedData]);

  const showDescriptionHandler = (id: string) => {
    dispatch(maintenanceActions.showDescription(id));
  };

  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(maintenanceActions.changeViewRows(Number(e.target.value)));
  };

  const sortHandler = (name: string) => {
    dispatch(maintenanceActions.sortData(name));
  };

  const fixItemHandler = (deviceName: string, isActive: boolean) => {
    if (isActive) {
      dispatch(checkActiveItem(deviceName));
    } else {
      dispatch(checkInactiveItem(deviceName));
    }
    setShowSpinner(true);
    setClickCheckbox(true);
    refetch();
    setTimeout(() => {
      setClickCheckbox(false);
      setShowSpinner(false);
    }, 1300);
  };

  return (
    <main className="relative flex flex-col overflow-auto bg-white dark:bg-black">
      {currentPageData.length > 0 ? (
        <>
          <section className="mx-auto flex h-auto w-11/12 items-center p-2">
            <section className="flex w-1/3 flex-col">
              <section>
                <strong className="text-lg dark:text-white">Last Updated: </strong>
                <UpdateAt
                  queryKey={['maintenance']}
                  queryFn={getMaintenance}
                  refetchInterval={refetchInterval}
                />
              </section>
              <p className="text-sm text-gray-100">(updated each 12 hours)</p>
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
            <thead className="sticky top-[-1px] z-20">
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
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      key={item.id}
                      className="event-row border-2 border-table-border text-sm leading-[3rem] hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100 dark:hover:text-black"
                    >
                      <td>
                        <button
                          className="z-50 rounded-full p-3 hover:bg-blue-exlight"
                          onClick={() => showDescriptionHandler(item.id)}
                        >
                          <ToggleIcon
                            fill={theme === 'dark' ? '#fff' : 'black'}
                            className={`h-3 w-3 ${item.showDescription && 'rotate-90'}`}
                          />
                        </button>
                      </td>
                      <td
                        className={`pl-3 ${item.active ? 'font-bold' : undefined}`}
                        style={{
                          width: '30%',
                          lineHeight: '1.5rem',
                          paddingRight: '0.5rem',
                        }}
                      >
                        {item.InspectionPoint}
                      </td>
                      <td className={`${item.active ? 'font-bold' : undefined}`}>
                        {item.Duration}
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
                            Inactive
                          </span>
                        )}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          id={item.id}
                          key={`${item.id}-${item.timeStamp}`}
                          disabled={
                            !AUTHORIZATION.Assembly.update.has(permission) ||
                            clickCheckbox
                          }
                          className="scale-150 cursor-pointer focus-visible:outline-0"
                          onClick={() =>
                            fixItemHandler(item.InspectionPoint, item.active)
                          }
                        />
                      </td>
                    </tr>

                    {item.showDescription && (
                      <tr className="border-2 border-table-border bg-table-hover dark:bg-gray-220 dark:text-gray-60">
                        <td colSpan={7} className="w-full p-4 pl-10">
                          <p className="text-sm">
                            <span className="font-semibold">Description: </span>
                            {item.Description}
                          </p>
                          {item['Refer to'] && (
                            <p className="mt-1 text-sm">
                              <span className="font-semibold">Refer to: </span>
                              {item['Refer to']}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
        </>
      ) : (
        <IconText text="No Maintenance Report" width=" w-32" />
      )}
    </main>
  );
};

export default memo(Maintenance);
