/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { SiChartdotjs } from 'react-icons/si';
import { TbChartArcs3 } from 'react-icons/tb';

import Board from '../../components/Board';
import StreamChart from '../../components/StreamChart';
import { useAppDispatch, useAppSelector } from '../../store';
import './Dashboard.scss';
import PeratoChart from '../../components/PeratoChart';
// import { eventActions, fetchEventDataByTime } from '../../store/eventSlice';
import { eventActions } from '../../store/eventQuerySlice';
import mockControlData from '../../data/mockControlData.json';
import BellCurveChart from '../../components/BellCurveChart';
import deviation, { mean } from '../../utils/standardDeviation';
import KeyIndicator from '../../components/KeyIndicator';
import TimeInterval from '../../components/TimeInterval';
import EverythingFine from '../../components/IconText';
import dateToUTCTimestamp from '../../utils/dateToUTCTimestamp';

const array: string[] = [];
const setLocalStorage = () => {
  const currentsec = dayjs().second();
  if (array.length > 10) {
    array.shift();
  }
  array.push(mockControlData[0].TIME_PP_R[currentsec].toString());
  localStorage.setItem('items', JSON.stringify(array.slice(1)));
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>(dayjs(Date.now()).format('h:mm A'));
  const [endTime, setEndTime] = useState<string>('11:59 PM');
  const dispatch = useAppDispatch();
  // const displayEvent = useAppSelector((state) => state.event.displayEventByTime);
  // const hasEvent = useAppSelector((state) => state.event.hasEvent);
  const displayEvent: any[] = [];
  const hasEvent = true;
  // Stream Chart
  useEffect(() => {
    const calculate = () => {
      const deviationTIME = deviation(mockControlData[0].TIME_PP_R) * 3;
      const meanTIME = mean(mockControlData[0].TIME_PP_R);
      dispatch(eventActions.deviation(deviationTIME));
      dispatch(eventActions.mean(meanTIME));
    };
    calculate();
    const setPerTenMin = setInterval(() => {
      calculate();
    }, 600000);
    return () => {
      clearInterval(setPerTenMin);
    };
  }, []);
  useEffect(() => {
    // stream chart solution 1
    setLocalStorage();
    const setPerSecond = setInterval(() => {
      setLocalStorage();
    }, 2000000);
    return () => {
      clearInterval(setPerSecond);
    };
  }, []);

  // Bar Chart
  useEffect(() => {
    const time = {
      gte: dateToUTCTimestamp(startDate, startTime),
      lte: dateToUTCTimestamp(endDate, endTime),
    };
    // dispatch(fetchEventDataByTime(time));
  }, [dispatch, endDate, endTime, startDate, startTime]);

  const count = () => {
    // count error code and return array
    const errorCode = displayEvent.map((el) => {
      // get error code
      return el.error_code;
    });
    const uniqueErrorCode = errorCode.filter((el, index, arr) => {
      // get unique error code
      return arr.indexOf(el) === index;
    });
    const countErrorCode = uniqueErrorCode.map((el) => {
      // get count of error code
      return [el, errorCode.filter((x) => x === el).length];
    });

    return countErrorCode;
  };
  const eventErrorName = () => {
    const errorName = displayEvent.map((el) => {
      return el.name;
    });
    return errorName;
  };

  return (
    <main className="fitt relative flex w-[99%] flex-col justify-center gap-6 overflow-x-auto bg-[#ececec] px-4 dark:bg-black dark:text-white">
      <section className="flex h-[42%] gap-8">
        <Board title="Error Occurrence" width="w-[65%]" minWidth="min-w-[400px]">
          <section className="h-[90%]">
            <PeratoChart eventData={count()} eventErrorName={eventErrorName()} />
          </section>
          {!hasEvent ? (
            <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.5)]">
              <EverythingFine text="No Error" width="w-20" />
            </div>
          ) : null}
        </Board>
        <section className="w-[35%] min-w-[450px]">
          <TimeInterval
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
          <section className="h-[60%] rounded-lg pt-4">
            <section className="flex h-full justify-around">
              <KeyIndicator
                color={{
                  bg: 'bg-[rgba(0,108,146,0.04)]',
                  text: 'text-[rgba(0,108,146,0.7)]',
                }}
                title="CP precision"
                icon={<SiChartdotjs className="mr-2 inline" />}
              />
              <KeyIndicator
                color={{
                  bg: 'bg-[rgba(142,211,0,0.08)]',
                  text: 'text-[rgba(142,211,0,0.9)]',
                }}
                title="CPK precision"
                icon={<TbChartArcs3 className="mr-2 inline" />}
              />
            </section>
          </section>
        </section>
      </section>
      <section className="flex h-[48%] gap-6">
        <section className="h-full w-1/4 overflow-hidden rounded-lg bg-white shadow-md dark:bg-black-100">
          <BellCurveChart />
        </section>
        <Board title="　" width="w-3/4" minWidth="min-w-[400px]">
          <section className="h-[90%]">
            <StreamChart />
          </section>
        </Board>
      </section>
    </main>
  );
};

export default Dashboard;
