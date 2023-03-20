import React, { LegacyRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarContainer.scss';

type CalendarContainerProps = {
  date: Date | null;
  setDate: (date: Date) => void;
  maxDate?: Date | undefined;
  minDate?: Date | undefined;
  forwardRef?: LegacyRef<HTMLDivElement>;
};

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  date,
  setDate,
  maxDate,
  minDate,
  forwardRef,
}) => {
  return (
    <div ref={forwardRef}>
      <Calendar
        value={date}
        onChange={setDate}
        calendarType="US"
        maxDate={maxDate}
        minDate={minDate}
      />
    </div>
  );
};

export default CalendarContainer;
