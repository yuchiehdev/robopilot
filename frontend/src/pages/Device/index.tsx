/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, memo, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BeatLoader from 'react-spinners/BeatLoader';

import AUTHORIZATION, { type PermissionType } from '../../data/authorization';
import DeviceForm from './DeviceForm';
import IconText from '../../components/IconText';
import Modal from '../../layout/Modal';
import Selector from '../../components/Selector';
import TableHeader from '../../components/Table/TableHeader';
import Paginator from '../../layout/Paginator';
import useModal from '../../hooks/useModal';
import usePagination from '../../hooks/usePagination';
import useSpinnerTimer from '../../hooks/useSpinnerTimer';
import TagInput from '../../components/TagInput';
import UpdateAt from '../../components/UpdateAt';
import { getDevice, getDeviceStatus } from '../../api/device';
import { deviceActions, deleteDevice, fetchDeviceSetting } from '../../store/deviceSlice';
import { ReactComponent as EditIcon } from '../../assets/icons/pen.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/trash-can.svg';
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg';
import { ReactComponent as LockOpenIcon } from '../../assets/icons/lock-open.svg';
import { useAppSelector, useAppDispatch } from '../../store';
import type { DeviceType } from '../../types';
import { override, FETCH_INTERVAL } from '../../data/constant';

export type TagObjType = {
  category: string;
  input: string;
};

type ActionType = 'update' | 'delete';
type TableHeaderItem = {
  name: string;
  sortBy: string;
};

type StatusColorMap = {
  [key: string]: string;
};

const tableCeil: TableHeaderItem[] = [
  { name: 'Name', sortBy: 'name' },
  {
    name: 'Status',
    sortBy: 'status',
  },
  { name: 'Type', sortBy: 'type' },
  { name: 'Connector', sortBy: 'connector' },
  { name: 'Action', sortBy: 'action' },
  { name: 'Receiver Ip', sortBy: 'receiverIp' },
  { name: 'Receiver Port', sortBy: 'receiverPort' },
  { name: 'Controller Ip', sortBy: 'controllerIp' },
  { name: 'Controller Port', sortBy: 'controllerPort' },
];

const dropdownItems: TableHeaderItem[] = [
  ...tableCeil,
  { name: 'Search All', sortBy: 'searchAll' },
];

const statusColorMap: StatusColorMap = {
  Fail: 'bg-red',
  NotReady: 'bg-yellow text-black-100 dark:text-black-100',
  Ready: 'bg-wiwynn-green text-black-100 dark:text-black-100',
  Running: 'bg-wiwynn-blue',
  Complete: 'bg-blue-dark',
  Disconnected: 'bg-gray-180',
  default: 'bg-gray-60 text-black',
};

const getIconColor = (
  theme: string,
  locked: boolean,
  action: ActionType,
  permission: PermissionType,
) => {
  if (locked || !AUTHORIZATION.Device[action].has(permission)) {
    return '#a8aaae';
  }
  return theme === 'light' ? 'rgb(0, 108, 146)' : 'rgb(142,211,0)';
};

const filterTagInputResult = (
  tags: { category: string; input: string }[],
  fetchData: DeviceType[],
) => {
  let result = fetchData;
  return tags.map((tagObj: { category: string; input: string }) => {
    result = result.filter((item: any) => {
      switch (tagObj.category) {
        case 'id':
          return item.id.toString().includes(tagObj.input.trim().toLowerCase());
        case 'Search All':
          return (
            item.id.toString().includes(tagObj.input.trim().toLowerCase()) ||
            item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase()) ||
            item.type.toLowerCase().includes(tagObj.input.trim().toLowerCase()) ||
            item.connector.toLowerCase().includes(tagObj.input.trim().toLowerCase()) ||
            item.receiverIp?.toString().includes(tagObj.input.trim()) ||
            item.receiverPort?.toString().includes(tagObj.input.trim()) ||
            item.controllerIp?.toString().includes(tagObj.input.trim()) ||
            item.controllerPort?.toString().includes(tagObj.input.trim()) ||
            item.status?.toLowerCase() === tagObj.input.toLowerCase()
          );

        case 'Name':
          return item.name.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Status':
          return item.status?.toLowerCase() === tagObj.input.toLowerCase();
        case 'Type':
          return item.type.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Connector':
          return item.connector.toLowerCase().includes(tagObj.input.trim().toLowerCase());
        case 'Receiver Ip':
          return item.receiverIp.toString().includes(tagObj.input.trim());
        case 'Receiver Port':
          return item.receiverPort.toString().includes(tagObj.input.trim());
        case 'Controller Ip':
          return item.controllerIp.toString().includes(tagObj.input.trim());
        case 'Controller Port':
          return item.controllerPort.toString().includes(tagObj.input.trim());
        default:
          return item;
      }
    });
    return result;
  });
};

const Device = () => {
  const [tagObjs, setTagObjs] = useState<TagObjType[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const [deleteItem, setDeleteItem] = useState<string>('');
  const [updateItem, setUpdateItem] = useState<DeviceType>();
  const [displayData, setDisplayData] = useState<DeviceType[]>([]);
  const [isExpanded, setIsExpanded] = useState(Array(16).fill(false));
  const reduxDevice = useAppSelector((state) => state.device.displayDevice);
  const permission = useAppSelector((state) => state.user.permission);
  const theme = useAppSelector((state) => state.user.theme);
  const viewRows = useAppSelector((state) => state.device.viewRows);
  const { showSpinner, setShowSpinner } = useSpinnerTimer(1.3);
  const { isOpen: isAddModalOpen, toggleModal: toggleAddModal } = useModal();
  const { isOpen: isUpdateModalOpen, toggleModal: toggleUpdateModal } = useModal();
  const { isOpen: isDeleteModalOpen, toggleModal: toggleDeleteModal } = useModal();
  const dispatch = useAppDispatch();

  const { goPrev, goNext, jumpTo, currentData, currentPage, maxPage } = usePagination(
    displayData || [],
    viewRows,
  );

  const { data: deviceStatus } = useQuery({
    queryKey: ['deviceStatus'],
    queryFn: getDeviceStatus,
    refetchInterval: FETCH_INTERVAL,
    onError: (err) => {
      throw err;
    },
    suspense: true,
  });

  const { data } = useQuery<DeviceType[], Error>({
    queryKey: ['device'],
    queryFn: getDevice,
    refetchInterval: FETCH_INTERVAL,
    onError: (err) => {
      throw err;
    },
    suspense: true,
  });

  const formattedDeviceData = useMemo(() => {
    if (data) {
      return data.map((item: DeviceType) => {
        const {
          _id: { $oid },
          connector,
        } = item;
        return {
          ...item,
          id: $oid,
          connector: connector.replaceAll('_', ' '),
          receiverIp: item.receiver.ip.replaceAll('.', ''),
          receiverPort: item.receiver.port,
          controllerIp: item.controller?.ip.replaceAll('.', '') || null,
          controllerPort: item.controller?.port || null,
          action:
            deviceStatus?.find((status: any) => status.device === item.name)
              ?.entity_name ?? 'Pending...',
        };
      });
    }
    return [];
  }, [data]);

  useEffect(() => {
    dispatch(deviceActions.setDevice(formattedDeviceData));
  }, [dispatch, formattedDeviceData]);

  useEffect(() => {
    if (tagObjs.length === 0) {
      const turnIntoArray = (items: DeviceType[]) => {
        return items.map((item: any) => {
          return item;
        });
      };
      setDisplayData(turnIntoArray(reduxDevice));
    } else {
      setDisplayData(
        filterTagInputResult(tagObjs, reduxDevice)[
          filterTagInputResult(tagObjs, reduxDevice).length - 1
        ],
      );
    }
  }, [tagObjs, reduxDevice]);

  const changeViewRowsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch(deviceActions.changeViewRows(Number(e.target.value)));
  };

  const addDeviceHandler = () => {
    dispatch(fetchDeviceSetting());
    toggleAddModal();
  };

  const deleteHandler = (name: string) => {
    dispatch(deleteDevice(name));
    setDeleteItem('');
    setShowSpinner(true);
  };

  const sortHandler = (name: string) => {
    dispatch(deviceActions.sortDevice(name));
  };

  const handleTdClick = (index: number) => {
    setIsExpanded((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return (
    <main className="relative flex flex-col overflow-auto bg-white dark:bg-black">
      {reduxDevice.length > 0 ? (
        <section className="h-auto w-full">
          <section className="mx-auto flex w-11/12 items-center p-2">
            <section className="flex w-1/3 items-center gap-2">
              <strong className="text-lg dark:text-white">Last Updated: </strong>
              <UpdateAt
                queryKey={['device']}
                queryFn={getDevice}
                refetchInterval={FETCH_INTERVAL}
              />
            </section>

            <section className="w-1/2">
              <TagInput
                dropdownItems={dropdownItems}
                tagObjs={tagObjs}
                setTagObjs={setTagObjs}
                forwardRef={ref}
                statusItems={[
                  'Complete',
                  'Disconnected',
                  'Fail',
                  'NotReady',
                  'Ready',
                  'Running',
                ]}
              />
            </section>

            <section className="flex w-1/6 justify-end">
              <button
                className={`ml-8 h-8 w-28 rounded-full px-8 py-1 text-white ${
                  AUTHORIZATION.Device.create.has(permission) ? 'bg-red' : 'bg-gray-80'
                } `}
                disabled={!AUTHORIZATION.Device.create.has(permission)}
                onClick={addDeviceHandler}
              >
                + Add
              </button>
            </section>
          </section>

          <table className="relative mx-auto mb-8 mt-5 w-11/12">
            <thead className="sticky top-0 z-20">
              <tr className="border-2 border-table-border bg-table-bg text-table-font">
                <th className="dark:bg-gray-220 dark:text-light-60">{null}</th>
                {tableCeil.map((item) => {
                  let tdWidth = {};
                  if (item.name === 'Receiver Port' || item.name === 'Controller Port') {
                    tdWidth = {
                      whiteSpace: 'wrap',
                      display: 'inline-block',
                      width: '3rem',
                    };
                  }
                  return (
                    <TableHeader
                      item={item}
                      key={item.name}
                      sortHandler={sortHandler}
                      tdWidth={tdWidth}
                    />
                  );
                })}
                <th className="pl-3 text-start text-sm leading-10 tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                  Fix
                </th>
              </tr>
            </thead>

            <tbody className="relative z-10">
              {currentData.map((item, index) => {
                const statusColor = statusColorMap[item.status ?? 'default'];
                return (
                  <tr
                    key={item.id}
                    className="border-2 border-table-border text-sm leading-[3rem] hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100 dark:hover:text-black"
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
                    <td
                      className="pl-2 pr-1 leading-6"
                      style={{
                        width: '20%',
                        lineHeight: '1.5rem',
                        paddingRight: '0.5rem',
                      }}
                    >
                      {item.name.replaceAll('_', ' ')}
                    </td>
                    <td>
                      <span
                        className={`text-white ${statusColor} mr-4 flex h-8 items-center justify-center rounded-full font-semibold`}
                      >
                        {item.status || 'unknown'}
                      </span>
                    </td>
                    <td className="">{item.type}</td>
                    <td className="pl-4">{item.connector}</td>
                    <td
                      onClick={handleTdClick.bind(null, index)}
                      className={`max-w-[6rem] overflow-hidden hover:cursor-pointer ${
                        isExpanded[index]
                          ? 'max-w-[14rem] break-words pr-6 leading-6'
                          : 'text-ellipsis whitespace-nowrap'
                      } px-1 text-start`}
                    >
                      {item.action}
                    </td>
                    <td className="">{item.receiver.ip}</td>
                    <td className="pl-3">{item.receiver.port}</td>
                    <td className="">{item.controller?.ip || ''}</td>
                    <td className="pl-5">{item.controller?.port || ''}</td>
                    <td className="inline-flex items-center gap-5">
                      <button
                        disabled={
                          item.locked || !AUTHORIZATION.Device.update.has(permission)
                        }
                        onClick={() => {
                          // dispatch(fetchDeviceSetting());
                          toggleUpdateModal();
                          setUpdateItem(item);
                        }}
                      >
                        <EditIcon
                          className="right-2 top-2 w-4"
                          fill={getIconColor(theme, item.locked, 'update', permission)}
                        />
                      </button>
                      <button
                        disabled={
                          item.locked || !AUTHORIZATION.Device.delete.has(permission)
                        }
                        onClick={() => {
                          toggleDeleteModal();
                          setDeleteItem(item.name);
                        }}
                      >
                        <DeleteIcon
                          className="right-2 top-2 w-4"
                          fill={getIconColor(theme, item.locked, 'delete', permission)}
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
            tailwindClass="flex flex-col items-start p-10 dark:bg-black dark:text-white"
            width="w-fit"
            height="h-fit"
          >
            <h1 className="mb-2 self-center text-2xl font-bold text-gray-200">
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
        </section>
      ) : (
        <IconText text="No Device Report" width=" w-32" />
      )}
    </main>
  );
};

export default memo(Device);
