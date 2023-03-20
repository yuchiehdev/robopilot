/* eslint-disable react/no-array-index-key */
import { useState, useMemo, useEffect } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppSelector, useAppDispatch } from '../../store';
import {
  fetchControllerData,
  postControllerStart,
  postCheckedControllerAlert,
} from '../../store/controllerSlice';
import Bulb from '../../components/Bulb';
import Board from '../../components/Board';
import SocketMonitor from '../../components/SocketMonitor';
import convertToBinary from '../../utils/convertToBinary';
import controllerImage from '../../assets/controller-image-no-main.jpg';
import trayFeederImage from '../../assets/tray-feeder.jpg';
// import StatusLabel from '../../components/StatusLabel';
import { ReactComponent as ExclamationIcon } from '../../assets/icons/exclamation.svg';
import './controller.scss';

type BulbColorType = {
  [key: string]: string;
};

const BULB_COLOR: BulbColorType = {
  '-1': 'bg-gray-100 text-white dark:text-black',
  '0': 'bg-red text-white',
  '1': 'bg-wiwynn-green',
};

const getDimmBulbStatus = (value: number | 'Fail'): [string, string, string, string] => {
  if (value === 'Fail') {
    value = -1;
  }
  return convertToBinary(value);
};

const getProgressBarColor = (status: number) => {
  let color;
  if (status >= 0 && status <= 30) {
    color = '#e5446d';
  } else if (status > 30 && status <= 60) {
    color = '#ffbe0b';
  } else if (status > 60 && status <= 100) {
    color = '#06bcc1';
  } else {
    color = '#808080';
  }
  return color;
};

const getStatusColor = (status = '') => {
  let statusColor;
  const statusText = status.toLowerCase();

  if (
    statusText === 'ready' ||
    statusText === 'finish and pass' ||
    statusText === 'complete'
  ) {
    statusColor = 'bg-[rgba(142,211,0,0.3)] border-wiwynn-green';
  } else if (statusText === 'running') {
    statusColor = 'border-yellow bg-[rgba(255,190,11,0.25)]';
  } else if (statusText === 'finish and error') {
    statusColor = 'border-red bg-[rgba(229,68,109,0.3)]';
  } else {
    statusColor = 'border-gray-200 bg-[rgba(102,102,102,0.3)]';
  }

  return statusColor;
};

const Controller = () => {
  const dispatch = useAppDispatch();
  const [hoverImportATrayAlert, setHoverImportATrayAlert] = useState(false);
  const [hoverNgATrayAlert, setHoverNgATrayAlert] = useState(false);
  const [hoverImportBTrayAlert, setHoverImportBTrayAlert] = useState(false);
  const [hoverNgBTrayAlert, setHoverNgBTrayAlert] = useState(false);
  const [ejectTrayA, setEjectTrayA] = useState(false);
  const [ejectTrayB, setEjectTrayB] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);
  const controller = useAppSelector((state) => state.controller);
  const ts5000Data = useAppSelector((state) => state.controller.ts5000Data);
  const notify = (message: string) =>
    toast(message, { position: 'top-right', autoClose: 2000 });

  // // fetch every 1 second
  useEffect(() => {
    const fetchData = setInterval(() => {
      dispatch(fetchControllerData());
    }, 1000);

    return () => {
      clearInterval(fetchData);
    };
  }, [dispatch]);

  useEffect(() => {
    if (controller.btnReturnedMessage.length) {
      notify(controller.btnReturnedMessage);
    }
  }, [controller.startBtnIsClicked, controller.btnReturnedMessage]);

  const onAlertBtnClick = (name: string) => {
    dispatch(postCheckedControllerAlert(name));
  };

  const isStartBtnIsClicked = useAppSelector(
    (state) => state.controller.startBtnIsClicked,
  );

  const onStartBtnClick = (action: 'ON' | 'OFF') => {
    dispatch(postControllerStart(action));
  };

  const progress =
    !ts5000Data || ts5000Data?.PROGRESS?.value === 'Fail'
      ? 0
      : Number(ts5000Data?.PROGRESS?.value);

  const dimmAResult =
    ts5000Data.LEFT_RESULT?.value === 'Fail' ? -1 : Number(ts5000Data.LEFT_RESULT?.value);
  const dimmABulbStatus = useMemo(() => getDimmBulbStatus(dimmAResult), [dimmAResult]);
  const aReversed: [number, number, number, number] =
    structuredClone(dimmABulbStatus).reverse();

  const dimmBResult =
    ts5000Data.RIGHT_RESULT?.value === 'Fail'
      ? -1
      : Number(ts5000Data.RIGHT_RESULT?.value);
  const dimmBBulbStatus = useMemo(() => getDimmBulbStatus(dimmBResult), [dimmBResult]);
  const bReversed: [number, number, number, number] =
    structuredClone(dimmBBulbStatus).reverse();

  const FAKE_DATA = [];

  for (let i = 0; i < 20; i += 1) {
    const status = i % 3 === 0 ? 'Fail' : 'Pass';

    FAKE_DATA.push({
      name: `Dimm ${i + 1}`,
      sn: `SN000000000${i + 1}`,
      pn: `PN000000000${i + 1}`,
      status,
    });
  }

  return (
    <main className="relative flex w-full flex-col flex-wrap justify-center gap-7 overflow-scroll bg-[#ececec] py-6 dark:bg-black dark:text-white md:flex-row">
      {/* <section className="absolute z-50 md:top-[50%] md:right-7 md:-translate-y-1/2 lg:right-10">
        <ButtonsBar />
      </section> */}

      <Board
        width="w-full lg:w-[37%]"
        className="h-1/2 overflow-scroll px-6 pt-3 text-sm"
      >
        <section className="mt-2 flex items-center">
          <h6 className="mr-4 font-semibold">Main Board</h6>
          <p>ABC20230101XYZ-01</p>
        </section>

        <section className="flex justify-between">
          <section className="mt-2 flex w-1/2 items-center">
            <h6 className="font-semibold">In</h6>
            <span className="ml-3">08:44:23</span>
          </section>

          <section className="ml-2 mt-2 flex w-1/2 items-center">
            <h6 className="font-semibold">Out</h6>
            <span className="ml-3">08:45:20</span>
          </section>
        </section>

        <section className="mt-2 flex items-center">
          <h6 className="mr-4 font-semibold">Progress</h6>
          <section className="inline-block w-full">
            <ProgressBar
              animateOnRender
              completed={progress}
              height="0.8rem"
              bgColor={`${getProgressBarColor(progress)}`}
              labelColor={getProgressBarColor(progress) === '#ffbe0b' ? '#000' : '#fff'}
            />
          </section>
        </section>

        <section className="my-2 flex flex-wrap justify-between gap-3 pt-2">
          <div
            className={`flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 px-1 py-1 lg:w-1/4 ${getStatusColor(
              controller.mainStatus,
            )}`}
          >
            <p className="text-[0.8rem] font-semibold"> {controller.mainStatus}</p>
            <h5 className="text-xs">Main</h5>
          </div>

          <div
            className={`flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 px-1 py-1 lg:w-1/4 ${getStatusColor(
              controller.dimmAStatus,
            )}`}
          >
            <p className="text-[0.8rem] font-semibold"> {controller.dimmAStatus}</p>
            <h5 className="text-xs">Dimm-A</h5>
          </div>

          <div
            className={`flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 px-1 py-1 lg:w-1/4 ${getStatusColor(
              controller.dimmBStatus,
            )}`}
          >
            <p className="text-[0.8rem] font-semibold"> {controller.dimmBStatus}</p>
            <h5 className="text-xs">Dimm-B</h5>
          </div>

          <div className="flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 lg:w-1/4">
            <h5 className="text-md font-medium">57 sec</h5>
            <p className="text-xs">duration</p>
          </div>

          <div className="flex w-1/5 flex-auto flex-col items-center justify-center  rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 lg:w-1/4">
            <h5 className="text-md font-medium">
              {' '}
              {Number.isNaN(controller.calibrationTime)
                ? 0
                : Math.round(controller.calibrationTime)}{' '}
              sec
            </h5>
            <p className="text-xs">calibration</p>
          </div>

          <div className="flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 lg:w-1/4">
            <h5 className="text-md font-medium">
              {' '}
              {Math.round(Number(ts5000Data?.TIME_PRESS?.value)) || 0} sec
            </h5>
            <p className="text-xs">press</p>
          </div>

          <div className="flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 lg:w-1/4">
            <h5 className="text-md font-medium">
              {' '}
              {Math.round(Number(ts5000Data?.TIME_PP_R?.value)) || 0} sec
            </h5>
            <p className="text-xs">tray A</p>
          </div>

          <div className="flex w-1/5 flex-auto flex-col items-center justify-center rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 lg:w-1/4">
            <h5 className="text-md font-medium">
              {' '}
              {Math.round(Number(ts5000Data?.TIME_PP_L?.value)) || 0} sec
            </h5>
            <p className="text-xs">Tray B</p>
          </div>
        </section>

        <section className="mt-2 flex p-2">
          <h6 className="mr-3 font-semibold">Last Updated</h6>
          <span className="dark:text-white">{controller.fetchTime || '00:00:00'}</span>
        </section>
      </Board>

      <Board width="w-full lg:w-[57%]" className="relative h-1/2 overflow-scroll">
        <ToastContainer />

        <img
          src={controllerImage}
          alt="main"
          className="mx-auto h-auto max-h-full shrink-0 opacity-50"
        />

        {/* empty tray alert icons */}
        <section className="absolute top-2 flex w-full justify-around text-xl dark:text-white [&:nth-child(3)]:bg-red [&:nth-last-child(1)]:pr-4">
          {controller.isImportATrayError && (
            <section
              aria-label="ng-import-tray"
              className={`absolute left-[25%] bottom-[42%] ${
                controller.isImportATrayError && 'flash'
              }`}
            >
              <button
                className="exclamation-icon flex h-10 w-10 items-end justify-center bg-yellow"
                onClick={() => onAlertBtnClick('IMPORT_A_TRAY')}
                onMouseEnter={() => setHoverImportATrayAlert(true)}
                onMouseLeave={() => setHoverImportATrayAlert(false)}
              >
                <ExclamationIcon fill="#000" className="h-8 w-8 p-1" />
              </button>
              {hoverImportATrayAlert && (
                <p className="absolute top-1 left-12 w-max rounded-full border-2 border-red bg-light-60 px-2 text-lg ">
                  Refill the tray
                </p>
              )}
            </section>
          )}

          {controller.isNgATrayError && (
            <section
              aria-label="ng-a-tray"
              className={`absolute bottom-[32%] left-[20%] ${
                controller.isNgATrayError && 'flash'
              }`}
            >
              <button
                className="exclamation-icon flex h-10 w-10 items-end justify-center bg-yellow"
                onClick={() => onAlertBtnClick('NG_A_TRAY')}
                onMouseEnter={() => setHoverNgATrayAlert(true)}
                onMouseLeave={() => setHoverNgATrayAlert(false)}
              >
                <ExclamationIcon fill="#000" className="h-8 w-8 p-1" />
              </button>
              {hoverNgATrayAlert && (
                <p className="absolute top-1 left-12 w-max rounded-full border-2 border-red bg-light-60 px-2 text-lg ">
                  Refill the tray
                </p>
              )}
            </section>
          )}

          {controller.isImportBTrayError && (
            <section
              aria-label="import-b-tray"
              className={`absolute bottom-[42%] right-[25%] ${
                controller.isImportBTrayError && 'flash'
              }`}
            >
              <button
                className="exclamation-icon flex h-10 w-10 items-end justify-center bg-yellow"
                onClick={() => onAlertBtnClick('IMPORT_B_TRAY')}
                onMouseEnter={() => setHoverImportBTrayAlert(true)}
                onMouseLeave={() => setHoverImportBTrayAlert(false)}
              >
                <ExclamationIcon fill="#000" className="h-8 w-8 p-1" />
              </button>
              {hoverImportBTrayAlert && (
                <p className="absolute top-1 left-12 w-max rounded-full border-2 border-red bg-light-60 px-2 text-lg ">
                  Refill the tray
                </p>
              )}
            </section>
          )}

          {controller.isNgBTrayError && (
            <section
              aria-label="ng-b-tray"
              className={`absolute bottom-[32%] right-[20%] ${
                controller.isNgBTrayError && 'flash'
              }`}
            >
              <button
                className="exclamation-icon flex h-10 w-10 items-end justify-center bg-yellow"
                onClick={() => onAlertBtnClick('NG_B_TRAY')}
                onMouseEnter={() => setHoverNgBTrayAlert(true)}
                onMouseLeave={() => setHoverNgBTrayAlert(false)}
              >
                <ExclamationIcon fill="#000" className="h-8 w-8 p-1" />
              </button>
              {hoverNgBTrayAlert && (
                <p className="absolute top-1 left-12 w-max rounded-full border-2 border-red bg-light-60 px-2 text-lg ">
                  Refill the tray
                </p>
              )}
            </section>
          )}
        </section>

        {/* status bulbs */}
        <section className="dimm-B absolute top-10 left-4 flex flex-col gap-2 lg:left-10">
          {dimmBBulbStatus.map((bulb, i) => (
            <Bulb
              width="w-7"
              key={`dimmA-${i}`}
              height="h-7"
              color={BULB_COLOR[bulb]}
              index={Math.abs(i - 4)}
            />
          ))}
        </section>

        <section className="dimm-A absolute top-10 right-4 flex flex-col gap-2 lg:right-10">
          {dimmABulbStatus.map((bulb, i) => (
            <Bulb
              width="w-7"
              key={`dimmB-${i}`}
              height="h-7"
              color={BULB_COLOR[bulb]}
              index={Math.abs(i - 8)}
            />
          ))}
        </section>

        <section className="ts5000 absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {bReversed.map((bulb, i) => (
            <Bulb
              width="w-7"
              height="h-7"
              key={`dimmA-${i}`}
              color={BULB_COLOR[bulb]}
              index={i + 1}
            />
          ))}
          {aReversed.map((bulb, i) => (
            <Bulb
              width="w-7"
              height="h-7"
              key={`dimmB-${i}`}
              color={BULB_COLOR[bulb]}
              index={i + 5}
            />
          ))}
        </section>
      </Board>

      <Board
        width="w-full lg:w-1/3"
        className="relative h-[45%] overflow-scroll px-2 text-sm"
        title="Dimm Status"
      >
        <section className="absolute right-[5%] top-4 flex rounded-md border-2 border-wiwynn-blue">
          <h5 className="border-r-2 border-wiwynn-blue bg-wiwynn-blue px-2 font-semibold text-white">
            Pass Rate
          </h5>
          <h5 className="px-2 font-medium text-wiwynn-blue">
            {Math.round((2 / 3) * 100)}%
          </h5>
        </section>

        <table className="mx-auto w-11/12 border-[1px] border-gray-220 text-center  dark:bg-gray-220 dark:text-light-60">
          <thead className="border-b-[1px] bg-gray-80 text-sm font-medium tracking-wide text-gray-220">
            <tr>
              <td className="border-r-[1px]">Name</td>
              <td className="border-r-[1px]">S/N</td>
              <td className="border-r-[1px]">P/N</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody className="text-start text-xs">
            {FAKE_DATA.map((item, i) => (
              <tr
                className={`border-b-[1px] ${
                  item.status === 'Pass'
                    ? 'bg-[rgba(142,211,0,0.25)]'
                    : 'bg-[rgba(229,68,109,0.3)]'
                }`}
              >
                <td className="border-r-[1px] text-center">{i + 1}</td>
                <td className="border-r-[1px] px-1">{item.sn}</td>
                <td className="border-r-[1px] px-1">{item.pn}</td>
                <td className="text-center">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Board>

      <Board
        width="w-full lg:w-1/3"
        className="relative h-[45%]"
        title={showMonitor ? 'Monitor' : 'Tray Feeder'}
      >
        {showMonitor ? (
          <section className="mt-4">
            <SocketMonitor />
          </section>
        ) : (
          <img
            src={trayFeederImage}
            alt="main"
            className="mx-auto h-auto max-h-[90%] shrink-0 opacity-50"
          />
        )}
      </Board>

      <Board
        title="Manual Control"
        width="w-full lg:w-1/4"
        className="relative h-[45%] overflow-scroll px-2"
      >
        <section className="flex h-4/5 flex-col items-center justify-center gap-4 px-6">
          <section className="flex w-full items-center justify-start">
            <h6 className="w-2/3 font-semibold">Process</h6>
            <label htmlFor="start-btn" className="switch mx-auto">
              <input
                id="start-btn"
                className="start-btn__checkbox"
                type="checkbox"
                defaultChecked={isStartBtnIsClicked}
                onClick={
                  isStartBtnIsClicked
                    ? () => onStartBtnClick('OFF')
                    : () => onStartBtnClick('ON')
                }
              />
              <span className="slider round" />
            </label>
            {/* <button
              className="w-1/2 rounded-lg border-2 border-wiwynn-blue bg-[rgba(0,108,146,0.25)] px-2 py-1 font-medium transition hover:scale-105"
              onClick={
                isStartBtnIsClicked
                  ? () => onStartBtnClick('OFF')
                  : () => onStartBtnClick('ON')
              }
            >
              {!isStartBtnIsClicked ? 'Run' : 'Stop'}
            </button> */}
          </section>

          <section className="flex w-full items-center justify-start">
            <h6 className="w-2/3 font-semibold">Eject Tray A</h6>
            <label htmlFor="btn-eject-trayA" className="switch mx-auto">
              <input
                id="btn-eject-trayA"
                className="start-btn__checkbox"
                type="checkbox"
                defaultChecked={ejectTrayA}
                onClick={() => setEjectTrayA((prev) => !prev)}
              />
              <span className="slider round" />
            </label>
            {/* <button
              className={`w-1/2 rounded-lg border-2 px-2 py-1 font-medium  transition hover:scale-105 ${
                !ejectTrayA
                  ? 'border-wiwynn-blue bg-[rgba(0,108,146,0.25)]'
                  : 'border-red bg-[rgba(229,68,109,0.3)]'
              }`}
              onClick={() => setEjectTrayA((prev) => !prev)}
            >
              {!ejectTrayA ? 'Eject' : 'Send'}
            </button> */}
          </section>

          <section className="flex w-full items-center justify-start">
            <h6 className="w-2/3 font-semibold">Eject Tray B</h6>
            <label htmlFor="btn-eject-trayB" className="switch mx-auto">
              <input
                id="btn-eject-trayB"
                className="start-btn__checkbox"
                type="checkbox"
                defaultChecked={ejectTrayB}
                onClick={() => setEjectTrayB((prev) => !prev)}
              />
              <span className="slider round" />
            </label>
            {/* <button
              className={`w-1/2 rounded-lg border-2 px-2 py-1 font-medium  transition hover:scale-105 ${
                !ejectTrayB
                  ? 'border-wiwynn-blue bg-[rgba(0,108,146,0.25)]'
                  : 'border-red bg-[rgba(229,68,109,0.3)]'
              }`}
              onClick={() => setEjectTrayB((prev) => !prev)}
            >
              {!ejectTrayB ? 'Eject' : 'Send'}
            </button> */}
          </section>

          <section className="flex w-full items-center justify-start">
            <h6 className="w-2/3 font-semibold">Visual Monitor</h6>
            <label htmlFor="btn-show-monitor" className="switch mx-auto">
              <input
                id="btn-show-monitor"
                className="start-btn__checkbox"
                type="checkbox"
                defaultChecked={showMonitor}
                onClick={() => setShowMonitor((prev) => !prev)}
              />
              <span className="slider round" />
            </label>
            {/* <button
              className={`w-1/2 rounded-lg border-2 px-2 py-1 font-medium  transition hover:scale-105 ${
                !showMonitor
                  ? 'border-wiwynn-blue bg-[rgba(0,108,146,0.25)]'
                  : 'border-red bg-[rgba(229,68,109,0.3)]'
              }`}
              onClick={() => setShowMonitor((prev) => !prev)}
            >
              {!showMonitor ? 'Show' : 'Hide'}
            </button> */}
          </section>
        </section>
      </Board>
    </main>
  );
};

export default Controller;
