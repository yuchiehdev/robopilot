import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarContainer.scss';

type CalendarContainerProps = {
  date: Date | null;
  setDate: (date: Date) => void;
  maxDate?: Date | undefined;
  minDate?: Date | undefined;
};

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  date,
  setDate,
  maxDate,
  minDate,
}) => {
  return (
    <div>
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
