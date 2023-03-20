import { BsFillCalendarEventFill } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type dateInputType = {
  width?: string;
  // DatePicker can only take Date type
  startDate: Date;
  endDate: Date;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
};

const DateInput = ({
  width = 'px-14',
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: dateInputType) => {
  const handleStartDateChange = (date: Date) => {
    if (date > endDate) {
      setEndDate(date);
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    if (date < startDate) {
      setStartDate(date);
    }
    setEndDate(date);
  };
  const customStyles = {
    input: {
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: 'black',
      outline: 'none',
      borderRadius: '4px',
      backgroundColor: '#fff',
      padding: '4px 7px',
      width: '100%',
    },
  };

  return (
    <section className={`flex flex-col gap-2 ${width}`}>
      <span className="text-lg text-gray-220">Date</span>
      <div className="grid grid-cols-11 gap-4 rounded-lg border-2 border-gray-60 bg-[#f9f9f9] px-3 py-1  hover:bg-white">
        <div className="z-[70] col-span-4">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            customInput={<input style={customStyles.input} />}
          />
        </div>
        <div className="col-span-1 flex justify-center">
          <span> - </span>
        </div>
        <div className="z-[70] col-span-4">
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            customInput={<input style={customStyles.input} />}
          />
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="h-fit w-fit rounded-[0.3rem] bg-black-40 p-[0.2rem]">
            <BsFillCalendarEventFill fill="white" />
          </div>
        </div>
      </div>
      {/* <button
        className="flex items-center gap-12 rounded-lg border-2 border-gray-60 bg-[#f9f9f9] px-3 py-1 hover:cursor-pointer  hover:bg-white"
        onClick={() => setCalendarToggle(!calendarToggle)}
        ref={domNode1}
      ></button> */}
      {/* <div
        className={`absolute ${top} ${left} z-50 ${calendarToggle ? 'hidden' : null}`}
        ref={domNode2}
      ></div> */}
    </section>
  );
};

export default DateInput;
