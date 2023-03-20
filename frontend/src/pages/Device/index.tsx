/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  fetchDeviceData,
  fetchDeviceStatusData,
  deviceActions,
  fetchDeviceSetting,
  deleteDevice,
} from '../../store/deviceSlice';
import Selector from '../../components/Selector';
import Paginator from '../../layout/Paginator';
import usePagination from '../../hooks/usePagination';
import Modal from '../../layout/Modal';
import useModal from '../../hooks/useModal';
import useSpinnerTimer from '../../hooks/useSpinnerTimer';
import DeviceForm from './DeviceForm';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/pen.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/trash-can.svg';
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg';
import { ReactComponent as LockOpenIcon } from '../../assets/icons/lock-open.svg';
import type { SortBy } from '../../store/deviceSlice';
import type { DeviceTypes } from '../../types';
import TagInput from '../../components/TagInput';

type TableHeaderItem = {
  name: string;
  sortBy: string;
};

const tableCeil: TableHeaderItem[] = [
  { name: 'Name', sortBy: 'name' },
  {
    name: 'Status',
    sortBy: 'status',
  },
  { name: 'Type', sortBy: 'type' },
  { name: 'Connector', sortBy: 'connector' },
  { name: 'Receiver Ip', sortBy: 'receiverIp' },
  { name: 'Receiver Port', sortBy: 'receiverPort' },
  { name: 'Controller Ip', sortBy: 'controllerIp' },
  { name: 'Controller Port', sortBy: 'controllerPort' },
];

// spinner style
const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: '0 auto',
};

const dropdownItems: TableHeaderItem[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

export type tagObjType = {
  category: string;
  input: string;
};

const getIconColor = (theme: string, locked: boolean) => {
  if (locked) {
    return '#a8aaae';
  }
  return theme === 'light' ? 'rgb(0, 108, 146)' : 'rgb(142,211,0)';
};

const Device = () => {
  const fetchDataInterval = useRef<NodeJS.Timeout>();
  const [tagObjs, setTagObjs] = useState<tagObjType[]>([]);
  const [displayData, setDisplayData] = useState<string[]>([]);
  const [deleteItem, setDeleteItem] = useState<string>('');
  const [updateItem, setUpdateItem] = useState<DeviceTypes>();
  const { isOpen: isAddModalOpen, toggleModal: toggleAddModal } = useModal();
  const { isOpen: isUpdateModalOpen, toggleModal: toggleUpdateModal } = useModal();
  const { isOpen: isDeleteModalOpen, toggleModal: toggleDeleteModal } = useModal();
  const { showSpinner, setShowSpinner } = useSpinnerTimer(1.3);
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const theme = useAppSelector((state) => state.user.theme);
  const deviceStatus = useAppSelector((state) => state.device.status);
  const sortStatus = useAppSelector((state) => state.device.sortStatus);
  const viewRows = useAppSelector((state) => state.device.viewRows);
  const displayDevice = useAppSelector((state) => state.device.displayDevice);
  const fetchTime = useAppSelector((state) => state.device.fetchTime);
  const dispatch = useAppDispatch();
  const forwardRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchDeviceData());
    dispatch(fetchDeviceStatusData());
  }, [dispatch]);

  useEffect(() => {
    fetchDataInterval.current = setInterval(() => {
      dispatch(fetchDeviceData());
      dispatch(fetchDeviceStatusData());
    }, 1000);

    return () => {
      clearInterval(fetchDataInterval.current);
    };
  }, [dispatch]);

  useEffect(() => {
    const dataWithStatus = displayDevice.map((item) => {
      const ds = deviceStatus.find((status) => status.device === item.name);
      return { ...item, status: ds?.status };
    });
    if (tagObjs.length > 0) {
      setDisplayData(
        filterTagInputResult(tagObjs, dataWithStatus)[
          filterTagInputResult(tagObjs, dataWithStatus).length - 1
        ],
      );
    } else {
      const turnIntoArray = (data: DeviceTypes[]) => {
        return data.map((item: any) => {
          return item;
        });
      };
      setDisplayData(turnIntoArray(dataWithStatus));
    }
  }, [tagObjs, displayDevice, deviceStatus]);

  const filterTagInputResult = (tags: tagObjType[], fetchData: any) => {
    let data = fetchData;
    return tags.map((tagObj: tagObjType) => {
      data = data.filter((item: any, index: number) => {
        switch (tagObj.category) {
          case 'Name':
            return item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase());
          case 'Status':
            return item.status === tagObj.input.trim();
          case 'Type':
            return item.type.toString().includes(tagObj.input.trim().toLowerCase());
          case 'Connector':
            return item.connector.toString().includes(tagObj.input.trim().toLowerCase());
          case 'Receiver Ip':
            return item.receiverIp.toString().includes(tagObj.input.trim().toLowerCase());
          case 'Receiver Port':
            return item.receiverPort
              .toString()
              .includes(tagObj.input.trim().toLowerCase());
          case 'Controller Ip':
            return item.controllerIp
              .toString()
              .includes(tagObj.input.trim().toLowerCase());
          case 'Controller Port':
            return item.controllerPort
              .toString()
              .includes(tagObj.input.trim().toLowerCase());
          default:
            return item;
        }
      });
      return data;
    });
  };

  const sortHandler = useCallback(
    (name: SortBy) => {
      dispatch(deviceActions.sortDevice(name));
    },
    [dispatch],
  );

  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(deviceActions.changeViewRows(Number(e.target.value)));
  };

  const addDeviceHandler = useCallback(() => {
    dispatch(fetchDeviceSetting());
    toggleAddModal();
  }, [dispatch, toggleAddModal]);

  const deleteHandler = useCallback(
    (name: string) => {
      dispatch(deleteDevice(name));
      setDeleteItem('');
      setShowSpinner(true);
    },
    [dispatch, setShowSpinner],
  );

  const { goPrev, goNext, jumpTo, currentData, currentPage, maxPage } = usePagination(
    displayData,
    viewRows,
  );
  type StatusColorMap = {
    [key: string]: string;
  };

  const statusColorMap: StatusColorMap = {
    Fail: 'bg-red',
    NotReady: 'bg-yellow text-black-100 dark:text-black-100',
    Ready: 'bg-wiwynn-green text-black-100 dark:text-black-100',
    Running: 'bg-wiwynn-blue',
    Complete: 'bg-blue-dark',
    default: 'bg-gray-180',
  };

  return (
    <main className="relative overflow-y-scroll bg-white dark:bg-black">
      <section className="absolute top-0 left-16 mt-2">
        <strong className="text-lg dark:text-white">Last Updated: </strong>
        <span className="dark:text-white">{fetchTime}</span>
      </section>
      <section className="mx-auto mt-12 w-11/12">
        <TagInput
          dropdownItems={dropdownItems}
          tagObjs={tagObjs}
          setTagObjs={setTagObjs}
          forwardRef={forwardRef}
          statusItems={Object.keys(statusColorMap)}
        />
      </section>
      <section className="absolute right-14 top-0 flex items-baseline">
        <button
          className={`ml-8 h-8 w-32 rounded-full px-8 py-1 text-white ${
            isSignIn ? 'bg-red' : 'bg-gray-80'
          } `}
          disabled={!isSignIn}
          onClick={addDeviceHandler}
        >
          + Add
        </button>
      </section>
      <table className="mx-auto mt-5 mb-8 w-11/12">
        <thead>
          <tr className="bg-gray-80 dark:bg-gray-220">
            <th>{null}</th>
            {tableCeil.map((item) => {
              return (
                <th
                  key={item.name}
                  className="py-2 text-start text-sm leading-5 tracking-wide text-gray-220 first:pl-2 dark:bg-gray-220 dark:text-light-60"
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
            <th>{null}</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item) => {
            const statusItem = deviceStatus.find((status) => status.device === item.name);
            const statusColor = statusColorMap[statusItem?.status ?? 'default'];
            return (
              <tr
                key={item._id.$oid}
                className="border-b border-light-120 text-sm leading-[3rem] dark:border-gray-200 dark:text-light-100"
              >
                <td className="first:pl-2">
                  <button disabled>
                    {item.locked ? (
                      <LockIcon
                        className="right-2 top-2 w-4"
                        fill={`${
                          theme === 'light' ? 'rgb(0, 108, 146)' : 'rgb(142,211,0)'
                        }`}
                      />
                    ) : (
                      <LockOpenIcon className="right-2 top-2 w-5" fill="#a8aaae" />
                    )}
                  </button>
                </td>
                <td className="pl-2">{item.name}</td>
                <td className="">
                  <span
                    className={`text-white ${statusColor} mr-4 flex h-8 items-center justify-center rounded-full px-1`}
                  >
                    {statusItem?.status || 'unknown'}
                  </span>
                </td>
                <td>{item.type}</td>
                <td>{item.connector}</td>
                <td>{item.receiver.ip}</td>
                <td className="pl-6">{item.receiver.port}</td>
                <td>{item.controller?.ip || ''}</td>
                <td className="pl-6">{item.controller?.port || ''}</td>
                <td className="inline-flex items-center gap-5 pr-4">
                  <button
                    disabled={item.locked}
                    onClick={() => {
                      dispatch(fetchDeviceSetting());
                      toggleUpdateModal();
                      setUpdateItem(item);
                    }}
                  >
                    <EditIcon
                      className="right-2 top-2 w-4"
                      fill={getIconColor(theme, item.locked)}
                    />
                  </button>
                  <button
                    disabled={item.locked}
                    onClick={() => {
                      toggleDeleteModal();
                      setDeleteItem(item.name);
                    }}
                  >
                    <DeleteIcon
                      className="right-2 top-2 w-4"
                      fill={getIconColor(theme, item.locked)}
                    />
                  </button>
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
        isOpen={isAddModalOpen}
        onClick={toggleAddModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Add Device
        </h1>
        <DeviceForm
          toggleModal={toggleAddModal}
          setIsSpinnerShow={() => setShowSpinner(true)}
        />
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClick={toggleUpdateModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Update Device
        </h1>
        <DeviceForm
          toggleModal={toggleUpdateModal}
          setIsSpinnerShow={() => setShowSpinner(true)}
          updateItem={updateItem}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClick={toggleDeleteModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Delete Device
        </h1>
        <p>
          Confirm to delete device <strong>{deleteItem}</strong> ?
        </p>
        <section className="mt-4 flex w-full justify-center gap-5 font-semibold">
          <button
            className="rounded-md bg-gray-120 px-3 py-1 text-white"
            onClick={toggleDeleteModal}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-red px-3 py-1 text-white"
            onClick={() => {
              toggleDeleteModal();
              deleteHandler(deleteItem);
            }}
          >
            Confirm
          </button>
        </section>
      </Modal>
    </main>
  );
};

export default Device;
