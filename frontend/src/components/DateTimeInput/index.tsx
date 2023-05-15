import { useState, useEffect, forwardRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DateInput from '../TagInput/DateInput';
import TimeInput from '../TagInput/TimeInput';
import { useAppDispatch } from '../../store';
import { setStartDateTime, setEndDateTime } from '../../store/dashboardSlice';

type DateTimeInputProps = {
  calendarToggle: boolean;
};
type RefType = HTMLDivElement;

const DateTimeInput = forwardRef<RefType, DateTimeInputProps>(
  ({ calendarToggle }, ref) => {
    dayjs.extend(customParseFormat);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<string>(
      dayjs(Date.now()).subtract(1, 'hour').format('h:mm A'),
    );
    const [endTime, setEndTime] = useState<string>(dayjs(Date.now()).format('h:mm A'));

    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(
        setStartDateTime({
          date: dayjs(startDate).format('YYYY-MM-DD'),
          time: startTime,
        }),
      );
      dispatch(
        setEndDateTime({
          date: dayjs(endDate).format('YYYY-MM-DD'),
          time: endTime,
        }),
      );
    }, [dispatch, startDate, startTime, endDate, endTime]);

    return (
      <div
        ref={ref}
        className={`${
          calendarToggle
            ? 'z-[60] translate-y-0 transform opacity-100 transition-[500ms] ease-in'
            : 'z-[0] hidden translate-y-[-20px] transform opacity-0 transition-[500ms] ease-in'
        } relative right-0 flex flex-col rounded-2xl bg-white px-3 py-4 shadow-xl`}
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
    );
  },
);

export default DateTimeInput;
