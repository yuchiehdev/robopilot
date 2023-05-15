import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BsCalendar2MinusFill } from 'react-icons/bs';
import DateInput from '../TagInput/DateInput';
import TimeInput from '../TagInput/TimeInput';
import useClickOutside from '../../hooks/useClickOutside';

// timer interval selector for dashboard

type TimeIntervalProps = {
  startDate: Date;
  endDate: Date;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
};

const TimeInterval = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: TimeIntervalProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { domNode1, domNode2 } = useClickOutside<HTMLButtonElement, HTMLDivElement>(
    () => {
      setShowDropdown(false);
    },
  );
  dayjs.extend(customParseFormat);

  return (
    <section className="z-[60] h-[40%] min-w-[370px] pr-12">
      <h1 className="mb-1 pl-4 text-lg font-semibold tracking-wider text-blue-dark dark:text-white">
        Show data for
      </h1>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`transition-all ${
          showDropdown ? 'bg-white' : 'bg-[#f3f3f3]'
        } mt-4 ml-6 flex w-full gap-4 rounded-md py-3 pl-6 pr-12 text-lg shadow`}
        ref={domNode1}
      >
        <BsCalendar2MinusFill className="text-gray-300 mr-2 text-2xl" />
        <span>
          {dayjs(startDate).format('D, MMM')}{' '}
          {dayjs(`${startTime}`, 'h:mm A').format('hA')}
        </span>
        <span>-</span>
        <span>
          {dayjs(endDate).format('D, MMM')} {dayjs(`${endTime}`, 'h:mm A').format('hA')}
        </span>
      </button>
      <div
        ref={domNode2}
        className={`transition-all duration-300 ${
          showDropdown
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        } relative z-[60] ml-6 mt-2 flex w-[90%] flex-col rounded-2xl bg-white px-3 py-4 shadow-xl`}
      >
        <div className="z-[60] mb-4 flex flex-col gap-8">
          <DateInput
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            width="px-2"
          />
          <TimeInput
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            width="px-2"
          />
        </div>
      </div>
    </section>
  );
};

export default TimeInterval;
