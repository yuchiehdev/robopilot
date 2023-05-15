/* eslint-disable react/no-array-index-key */
import { useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { BsCheck } from 'react-icons/bs';
import { BiCircle } from 'react-icons/bi';

import { useAppSelector } from '../../store';
import Board from '../../components/Board';
import convertToBinary from '../../utils/convertToBinary';
import cryingIcon from '../../assets/crying-1.jpg';
import smileIcon from '../../assets/smile-1.jpg';
import { ReactComponent as BarcodeIcon } from '../../assets/icons/barcode.svg';
import { ReactComponent as PlayIcon } from '../../assets/icons/play.svg';
import { ReactComponent as SquareIcon } from '../../assets/icons/square.svg';
import { ReactComponent as HourglassIcon } from '../../assets/icons/hourglass.svg';
import MotherBoardPic from './MotherBoardPic';
import DimmStatusForm from './DimmStatusForm';
import { getProduction, getControlStatus } from '../../api/assembly';
import { useAuthenticatedMutation } from '../../hooks/useAuthenticatedMutation';
import { DIMMCONTROL, RESETERROR } from '../../data/fetchUrl';
import { FETCH_INTERVAL } from '../../data/constant';
import AUTHORIZATION from '../../data/authorization';
import DimmSupplement from './DimmSupplement';
import Tooltip from './Tooltip';
import './assembly.scss';
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(utc);

const CONTROL_START_SUCCESS_TOAST_ID = 'control_start_success_toast';
const CONTROL_START_FAILED_TOAST_ID = 'control_start_failed_toast';
const RESET_FAILED_TOAST_ID = 'reset_failed_toast';
const RESET_SUCCESS_TOAST_ID = 'reset_success_toast';

const Assembly = () => {
  const permission = useAppSelector((state) => state.user.permission);
  const isAuthorizedForUpdate = AUTHORIZATION.Assembly.update.has(permission);

  const { data: production } = useQuery(['production'], () => getProduction(), {
    refetchInterval: FETCH_INTERVAL,
    useErrorBoundary: true,
    suspense: true,
  });

  const timeDifference =
    dayjs(production?.end_time?.$date).unix() -
    dayjs(production?.start_time?.$date).unix();

  const dimmStatus = useMemo(() => {
    const dimmA1BulbStatus = convertToBinary(production?.RESULT_AREA_A1 ?? -1);
    const dimmA2BulbStatus = convertToBinary(production?.RESULT_AREA_A2 ?? -1);
    const dimmB1BulbStatus = convertToBinary(production?.RESULT_AREA_B1 ?? -1);
    const dimmB2BulbStatus = convertToBinary(production?.RESULT_AREA_B2 ?? -1);

    return [
      ...dimmA1BulbStatus.reverse(),
      ...dimmA2BulbStatus.reverse(),
      ...dimmB1BulbStatus.reverse(),
      ...dimmB2BulbStatus.reverse(),
    ];
  }, [production]);

  const { data: controlStatus } = useQuery(['controlstatus'], () => getControlStatus(), {
    useErrorBoundary: true,
    suspense: true,
    refetchInterval: FETCH_INTERVAL,
  });
  const controlStatusArray = useMemo(() => {
    return [
      [
        {
          name: 'Action',
          status: controlStatus?.actionControl,
          width: 'w-[38%]',
        },
        {
          name: 'DimmFeeder',
          status: controlStatus?.device_kv8000_dimmfeeder,
          width: 'w-[60%]',
        },
      ],
      [
        {
          name: 'Ts5000',
          status: controlStatus?.device_ts5000,
          width: 'w-[40%]',
        },
        {
          name: 'TrayFeeder',
          status: controlStatus?.device_kv8000_trayfeeder,
          width: 'w-[58%]',
        },
      ],
    ];
  }, [controlStatus]);

  const controlDimmMutation = useAuthenticatedMutation(DIMMCONTROL, 'POST', {
    onSuccess: (result) => {
      console.log(result);
      if (!toast.isActive(CONTROL_START_SUCCESS_TOAST_ID)) {
        toast.success(
          <>
            Success! <br />
            {JSON.stringify(result)}
          </>,
          {
            toastId: CONTROL_START_SUCCESS_TOAST_ID,
            autoClose: 2500,
          },
        );
      }
    },
    onError: (result) => {
      if (!toast.isActive(CONTROL_START_FAILED_TOAST_ID)) {
        toast.error(
          <>
            Failed! <br />
            {JSON.stringify(result)}
          </>,
          {
            toastId: CONTROL_START_FAILED_TOAST_ID,
            autoClose: 2500,
          },
        );
      }
    },
  });

  const handleStartBtnClick = (action: 'ON' | 'OFF') => {
    const performMutation = () => {
      try {
        controlDimmMutation.mutate({
          queryParams: {},
          body: {
            ts5000: 'device_ts5000',
            kv8000_dimmfeeder: 'device_kv8000_dimmfeeder_A',
            kv8000_trayfeeder: 'device_kv8000_trayfeeder_A',
            action,
          },
        });
      } catch (error) {
        if (!toast.isActive(CONTROL_START_FAILED_TOAST_ID)) {
          toast.error('Control start failed!', {
            toastId: CONTROL_START_FAILED_TOAST_ID,
            autoClose: 2500,
          });
        }
      }
    };
    performMutation();
  };

  const resetDimmMutation = useAuthenticatedMutation(RESETERROR, 'POST', {
    onSuccess: () => {
      if (!toast.isActive(RESET_SUCCESS_TOAST_ID)) {
        toast.success('Reset success!', {
          toastId: RESET_SUCCESS_TOAST_ID,
          autoClose: 2500,
        });
      }
    },
    onError: () => {
      if (!toast.isActive(RESET_FAILED_TOAST_ID)) {
        toast.error('Reset failed!', {
          toastId: RESET_FAILED_TOAST_ID,
          autoClose: 2500,
        });
      }
    },
  });

  const handleResetBtnClick = () => {
    resetDimmMutation.mutate({
      queryParams: {},
      body: {},
    });
  };

  return (
    <main className="relative flex w-full flex-wrap justify-evenly overflow-auto bg-[#ececec] py-4 dark:bg-black dark:text-white">
      <section className="flex h-max w-full flex-wrap gap-4 px-4 zi:h-[15.5rem] gi:h-1/3 lg:flex-nowrap">
        <Board
          width="w-full lg:w-[36%]"
          className="relative overflow-auto py-3 text-sm lg:h-full"
          title="Main Board"
        >
          <span className=" absolute right-14 top-12 flex h-12 w-24 items-center justify-center rounded-xl bg-green-transparent px-4 shadow">
            <BarcodeIcon fill="#283618" />
            <BarcodeIcon fill="#283618" />
          </span>

          <section className="flex flex-col justify-evenly gap-5">
            <section className="flex flex-col gap-3">
              <section className="flex flex-col items-start pl-3 font-medium">
                <h6 className="mr-4 rounded-full text-xs text-gray-200">CSN</h6>
                <p>{production?.mainboard_csn ?? 'mainboard_csn'}</p>
              </section>

              <section className="flex flex-col items-start pl-3 font-medium">
                <h6 className="mr-4 rounded-full text-xs text-gray-200">USN</h6>
                <p>{production?.mainboard_usn ?? 'mainboard_usn'}</p>
              </section>

              {production?.comment ? (
                <section className="flex flex-col items-start pl-3 font-medium">
                  <h6 className="mr-4 rounded-full text-xs text-gray-200">COMMENT</h6>
                  <p>{production?.comment ?? ' '}</p>
                </section>
              ) : null}
            </section>

            <section className="flex items-center justify-between gap-3 pl-3">
              <section className="flex items-center">
                <h6 className="relative z-auto flex h-7 w-7 items-center justify-center rounded-full bg-green-transparent text-sm font-extrabold text-green-dark shadow outline-2 outline-white">
                  <PlayIcon fill="#283618" className="h-3 w-3" />
                </h6>
                <section className="flex flex-col items-start pl-3 font-medium">
                  <h6 className="mr-4 rounded-full text-xs text-gray-200">Time In</h6>
                  <p>
                    {production
                      ? dayjs.utc(production?.start_time?.$date).format('h:mm:ss')
                      : 'N/A'}
                  </p>
                </section>
              </section>

              <section className="flex items-center">
                <h6 className="relative z-auto flex h-7 w-7 items-center justify-center rounded-full bg-green-transparent text-sm font-extrabold text-green-dark shadow outline-2 outline-white">
                  <SquareIcon fill="#283618" className="h-3 w-3" />
                </h6>
                <section className="flex flex-col items-start pl-3 font-medium">
                  <h6 className="mr-4 rounded-full text-xs text-gray-200">Time Out</h6>
                  <p>
                    {production
                      ? dayjs.utc(production?.end_time?.$date).format('h:mm:ss')
                      : 'N/A'}
                  </p>
                </section>
              </section>

              <section className="flex items-center">
                <h6 className="relative z-auto flex h-7 w-7 items-center justify-center rounded-full bg-green-transparent text-sm font-extrabold text-green-dark shadow outline-2 outline-white">
                  <HourglassIcon fill="#283618" className="h-3 w-3" />
                </h6>
                <section className="flex flex-col items-start pl-3 font-medium">
                  <h6 className="mr-4 rounded-full text-xs text-gray-200">
                    Process Time
                  </h6>
                  <p>{timeDifference ? `${timeDifference} secs` : 'N/A'}</p>
                </section>
              </section>
            </section>
          </section>
        </Board>

        <DimmSupplement />

        <section className="flex w-full flex-col gap-2 lg:w-[29%]">
          <div className="relative flex h-full rounded-lg bg-white py-2 px-2 shadow-md dark:bg-black-100">
            <div className="relative flex w-full justify-center gap-2">
              <div className="flex grow flex-col justify-center gap-2">
                {controlStatusArray.map((item, index) => (
                  <div className="flex justify-between" key={index}>
                    {item.map((control) => (
                      <span
                        className={`${
                          control.status
                            ? 'bg-green-transparent'
                            : 'bg-[rgb(220,220,220)]'
                        } ${control.width} flex items-center justify-center rounded-3xl`}
                        key={control.name}
                      >
                        {control.status ? (
                          <BsCheck className="h-5 w-5 text-green" />
                        ) : (
                          <BiCircle className="mr-2 h-2 w-2 text-[rgb(113,113,113)]" />
                        )}
                        {control.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex w-[30%] flex-col justify-between">
                <button
                  className={`flex h-[43%] w-full items-center justify-center rounded-xl bg-wiwynn-blue px-2 font-semibold tracking-wide text-white ${
                    isAuthorizedForUpdate ? '' : 'cursor-not-allowed'
                  }`}
                  onClick={() => handleStartBtnClick('ON')}
                  disabled={!isAuthorizedForUpdate}
                >
                  <Tooltip
                    label="Please sign in!"
                    position="bottom"
                    enabled={!isAuthorizedForUpdate}
                  >
                    <span>Start</span>
                  </Tooltip>
                </button>
                <button
                  className={`flex h-[43%] w-full items-center justify-center rounded-xl bg-red px-2 font-semibold tracking-wide text-white ${
                    isAuthorizedForUpdate ? '' : 'cursor-not-allowed'
                  }`}
                  onClick={() => handleStartBtnClick('OFF')}
                  disabled={!isAuthorizedForUpdate}
                >
                  <Tooltip
                    label="Please sign in!"
                    position="bottom"
                    enabled={!isAuthorizedForUpdate}
                  >
                    <span>Stop</span>
                  </Tooltip>
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex h-[35%] items-center rounded-lg bg-white px-4 py-3 shadow-md dark:bg-black-100">
            <h1 className="mb-8 pl-4 text-lg font-semibold tracking-wider text-blue-dark dark:text-white">
              Status
            </h1>
            <section className="flex h-[70%] w-full items-center justify-center gap-4">
              {!production?.status ? (
                <p className="text-2xl text-gray-200">Pending...</p>
              ) : (
                <>
                  <img
                    alt="status icon"
                    src={production?.status === 'PASS' ? smileIcon : cryingIcon}
                    className="h-max w-max"
                  />
                  <p
                    className={`flex h-max items-center justify-center text-3xl font-bold tracking-wide ${
                      production?.status === 'PASS' ? 'text-blue-dark' : 'text-red'
                    }`}
                  >
                    {production?.status?.toUpperCase()}
                  </p>
                </>
              )}
            </section>
          </div>
          <Tooltip
            label="Please sign in!"
            position="bottom"
            enabled={!isAuthorizedForUpdate}
          >
            <button
              disabled={resetDimmMutation.isLoading || !isAuthorizedForUpdate}
              onClick={() => handleResetBtnClick()}
              className={`flex h-8 w-full items-center justify-center rounded-lg bg-[rgb(220,220,220)] px-6 font-bold tracking-wide text-[#808080] shadow-md transition duration-200 hover:bg-[rgb(255,190,11)] hover:text-black focus:bg-[rgb(255,190,11)] focus:text-black focus:outline-none ${
                resetDimmMutation.isLoading || !isAuthorizedForUpdate
                  ? 'cursor-not-allowed hover:bg-[rgb(220,220,220)]'
                  : ''
              }`}
            >
              {resetDimmMutation.isLoading ? 'Resetting...' : 'Reset'}
            </button>
          </Tooltip>
        </section>
      </section>

      <section className="mt-0 flex w-full flex-col-reverse justify-between gap-4 px-4 pt-4 zi:h-[30rem] gi:h-2/3 lg:flex-row">
        <Board
          width="w-full xl:w-2/5"
          className="relative h-full px-2 text-sm"
          title="DIMM Status"
        >
          <DimmStatusForm status={dimmStatus} />
        </Board>

        <Board width="w-full xl:w-3/5" className="relative h-full" title="Main Board">
          <MotherBoardPic dimmStatus={dimmStatus} />
        </Board>
      </section>
    </main>
  );
};

export default Assembly;
