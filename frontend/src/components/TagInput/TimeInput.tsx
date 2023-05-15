import { ReactElement, useState } from 'react';
import { ImClock } from 'react-icons/im';
import Timekeeper from 'react-timekeeper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useClickOutsideSingle } from '../../hooks/useClickOutside';

type timeInputType = {
  width?: string;
  // Timekeeper can only take string type
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
};

type DoneButton = null | ((data: any, num: number) => ReactElement);
type TimeOutput = {
  formatted12: string;
  formatted24: string;
  hours: number;
  minutes: number;
  meridiem: string;
};

const TimeInput = ({
  width = 'px-14',
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: timeInputType) => {
  const [showStart, setShowStart] = useState<boolean>(false);
  const [showEnd, setShowEnd] = useState<boolean>(false);

  const handleStartButtonClick = () => {
    setShowStart(!showStart);
    setShowEnd(false);
  };
  const handleEndButtonClick = () => {
    setShowEnd(!showEnd);
    setShowStart(false);
  };
  const { domNode } = useClickOutsideSingle<HTMLDivElement>(() => {
    setShowStart(false);
    setShowEnd(false);
  });

  const doneButton: DoneButton = (data: TimeOutput, num: number) => {
    return (
      <button
        onClick={() => {
          setShowStart(false);
          setShowEnd(false);
          dayjs.extend(customParseFormat);
          if (num === 1) setEndTime(dayjs(data.formatted12, 'h:mm a').format('h:mm A'));
          else setStartTime(dayjs(data.formatted12, 'h:mm a').format('h:mm A'));
        }}
        className="absolute top-0 right-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#fff] hover:bg-[#f9f9f9]"
      >
        <span className="text-2xl font-bold text-[#8EB1FD] hover:text-[#8EA4FD]">✓</span>
      </button>
    );
  };
  return (
    <section className={`relative z-[60] flex flex-col gap-2 ${width}`}>
      <span className="text-lg text-gray-220">Time</span>
      <div className="relative z-[60] grid grid-cols-11 gap-4 rounded-lg border-2 border-gray-60 bg-[#f9f9f9] px-3 py-1 hover:cursor-pointer  hover:bg-white">
        <div className="z-[60] col-span-4">
          <button
            className="w-full rounded-sm bg-[#fff] px-2 text-left"
            onClick={handleStartButtonClick}
          >
            {startTime}
          </button>
          {showStart ? (
            <div className="absolute z-50" ref={domNode}>
              <Timekeeper
                time={startTime}
                doneButton={(data: any) => doneButton(data, 0)}
                forceCoarseMinutes
              />
            </div>
          ) : null}
        </div>
        <div className="col-span-1 flex justify-center">
          <span> ~ </span>
        </div>
        <div className="col-span-4">
          <button
            className="w-full rounded-sm bg-[#fff] px-2 text-left"
            onClick={handleEndButtonClick}
          >
            {endTime}
          </button>
          {showEnd ? (
            <div className="absolute right-0 z-50" ref={domNode}>
              <Timekeeper
                time={endTime}
                forceCoarseMinutes
                doneButton={(data: any) => doneButton(data, 1)}
              />
            </div>
          ) : null}
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="col-span-1 h-fit w-fit rounded-[0.3rem] bg-black-40 p-[0.2rem]">
            <ImClock fill="white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeInput;
