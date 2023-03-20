import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppSelector } from '../../store';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';

interface EventBodyProps {
  item: any;
  showErrorMsgHandler?: (id: string) => void;
}

const EventBody = ({ item, showErrorMsgHandler }: EventBodyProps) => {
  dayjs.extend(utc);
  const theme = useAppSelector((state) => state.user.theme);

  const time = dayjs(new Date(item.timestamp.$date))
    .format('YYYY/MM/DD HH:mm:ss')
    .toString();
  return (
    <>
      <tr className="event-row border-2 border-table-border text-sm leading-[3rem] hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100">
        <td>
          <button
            className="z-50 rounded-full p-3 hover:bg-gray-80"
            onClick={() => showErrorMsgHandler && showErrorMsgHandler(item.id)}
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
      {item.showMsg && (
        <tr className="bg-light-120 dark:bg-gray-220 dark:text-gray-60">
          <td colSpan={7} className="w-full rounded-b-lg p-4 pl-10">
            {item.msg.map((errorMsg: string[], index: number) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <p key={`${errorMsg}-${index}`} className="text-sm">
                  {errorMsg}
                </p>
              );
            })}
          </td>
        </tr>
      )}
    </>
  );
};

export default EventBody;
