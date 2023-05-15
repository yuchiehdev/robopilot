/* eslint-disable no-underscore-dangle */
import { useAppSelector } from '../../store';
import { ReactComponent as ToggleIcon } from '../../assets/icons/chevron-right.svg';
import type { TableHeaderItemType } from './SystemEvent';

interface EventBodyProps<TData> {
  tableCeil: TableHeaderItemType[];
  item: TData;
  showErrorMsgHandler?: (id: string) => void;
}

const EventBody = <TData extends Record<string, any>>({
  tableCeil,
  item,
  showErrorMsgHandler,
}: EventBodyProps<TData>) => {
  const theme = useAppSelector((state) => state.user.theme);
  return (
    <>
      <tr className="event-row border-2 border-table-border text-sm leading-[3rem] hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100 dark:hover:text-black">
        <td>
          <button
            className="z-50 rounded-full p-3 hover:bg-blue-exlight"
            onClick={() => showErrorMsgHandler && showErrorMsgHandler(item.id)}
          >
            <ToggleIcon
              fill={theme === 'dark' ? '#fff' : 'black'}
              className={`h-3 w-3 ${item.showMsg && 'rotate-90'}`}
            />
          </button>
        </td>
        {tableCeil.map((ceil: TableHeaderItemType) => {
          return (
            <td
              key={ceil.name}
              style={{
                width: ceil.ceilWidth,
                lineHeight: '1.5rem',
                paddingRight: '0.5rem',
              }}
            >
              {item[ceil.sortBy]}
            </td>
          );
        })}
      </tr>
      {item.showMsg && (
        <tr className="border-2 border-table-border bg-table-hover dark:bg-gray-220 dark:text-gray-60">
          <td colSpan={7} className="w-full rounded-b-lg p-4 pl-10">
            {item.msg.map((errorMsg: string) => {
              return (
                <p key={item._id.$oid} className="text-sm">
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
