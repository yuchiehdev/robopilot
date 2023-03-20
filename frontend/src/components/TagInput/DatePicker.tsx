// import { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const DP = () => {
//   const [startDate, setStartDate] = useState<Date>(new Date());
//   const [endDate, setEndDate] = useState<Date>(new Date());

//   const handleStartDateChange = (date: Date) => {
//     if (date > endDate) {
//       setEndDate(date);
//     }
//     setStartDate(date);
//   };

//   const handleEndDateChange = (date: Date) => {
//     if (date < startDate) {
//       setStartDate(date);
//     }
//     setEndDate(date);
//   };

//   return (
//     <div>
//       <DatePicker
//         selected={startDate}
//         onChange={handleStartDateChange}
//         selectsStart
//         startDate={startDate}
//         endDate={endDate}
//       />
//       <DatePicker
//         selected={endDate}
//         onChange={handleEndDateChange}
//         selectsEnd
//         startDate={startDate}
//         endDate={endDate}
//         minDate={startDate}
//       />
//     </div>
//   );
// };

// export default DP;

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DP = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleButtonClick = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (date: Date) => {
    setStartDate(date);
    setShowDatePicker(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-gray-200 p-4">Column 1</div>
        <div className="col-span-2 bg-gray-200 p-4">Column 2</div>
        <div className="col-span-1 bg-gray-200 p-4">Column 3</div>
      </div>
      <div className="relative z-10 hidden">
        <button onClick={handleButtonClick}>Select Date</button>
        {showDatePicker && (
          <DatePicker
            selected={startDate}
            onChange={handleDatePickerChange}
            dateFormat="MM/dd/yyyy h:mm aa"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
        )}
      </div>
    </>
  );
};

export default DP;
