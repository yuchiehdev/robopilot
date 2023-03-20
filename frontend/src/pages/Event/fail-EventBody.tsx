import { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';
import { useAppSelector } from '../../store';

const EventBody = ({ item }: any) => {
  console.log(item);
  const [showMsg, setShowMsg] = useState(false);
  const showErrorMsgHandler = (id: string) => {
    setShowMsg(!showMsg);
  };
  const theme = useAppSelector((state) => state.user.theme);
  dayjs.extend(utc);
  const time = `${dayjs
    .unix(Math.round(item.timestamp.$date / 1000))
    .format('YYYY/MM/DD HH:mm:ss')
    .toString()}`;
  return (
    <>
      <tr className="event-row border-b border-light-120 text-sm leading-[3rem] dark:border-gray-200 dark:text-light-100">
        <td>
          <button
            className="z-50 rounded-full p-3 hover:bg-gray-80"
            onClick={() => showErrorMsgHandler(item.id!)}
          >
            <ToggleIcon
              fill={theme === 'dark' ? '#fff' : 'black'}
              className={`h-3 w-3 ${item.showMsg && 'rotate-90'}`}
            />
          </button>
        </td>
        <td>{time}</td>
        <td>{item.deactivatedTime}</td>
        <td>{item.name}</td>
        <td>{item.severity}</td>
        <td>{item.error_code}</td>
        <td>{item.activation ? 'true' : 'false'}</td>
      </tr>
      <span> </span>
    </>
  );
};

export default EventBody;
