import { useNavigate } from 'react-router-dom';
import NoData from '../IconText';
import { useAppDispatch, useAppSelector } from '../../store';
import { eventActions } from '../../store/eventQuerySlice';

type DashboardTableProps = {
  page: string;
  hasEvent?: boolean;
  tableCeil: string[];
  tableData: any[];
  tableHeader: string[];
  handleTableClick?: (id: string) => void;
};

const DashboardTable = ({
  page,
  hasEvent,
  tableCeil,
  tableData,
  tableHeader,
  handleTableClick,
}: DashboardTableProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filterTag = useAppSelector((state) => state.eventQuery.filterTag);
  const handleRowClick = (id: string, sn: string) => {
    if (page === 'troubleshooting') {
      dispatch(
        eventActions.filterTag({
          ...filterTag,
          dashboardTable: id,
        }),
      );
      navigate('/event');
    } else if (page === 'measurements') {
      // eslint-disable-next-line no-unused-expressions
      handleTableClick && handleTableClick(sn);
    }
  };
  const filteredTagData = (tag: string, data: any[]) => {
    return data.filter((item) => {
      if (item.errorCode) return item.errorCode.toString().includes(tag);
      return item;
    });
  };
  const removeTag = () => {
    dispatch(
      eventActions.filterTag({
        perato: '',
        dashboardTable: '',
      }),
    );
  };
  return (
    <>
      {page === 'troubleshooting' && (
        <div
          className={`${
            filterTag.perato !== ''
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="mb-[3px] mt-[-1%] block w-fit rounded-[4px] border-[1px] border-[#5466a06e] bg-[#f1f2f5cc] py-[3px] px-[5px] text-[11pt]  hover:cursor-pointer">
            <span className="font-bold text-[#354e92]">Error Code</span>
            <span className="ml-3 text-[#354e92]">{filterTag.perato}</span>
            <button
              onClick={() => removeTag()}
              className="ml-[0.5rem] px-[2px] font-semibold text-[#666] no-underline hover:text-[#dd3345]"
            >
              x
            </button>
          </div>
        </div>
      )}
      <section className="scrollBarStyle relative h-[98%] w-full overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-[-2px]">
            <tr className="border-2 border-table-border bg-table-bg">
              {tableCeil.map((item) => (
                <th
                  className="pl-2 text-start text-sm leading-10 tracking-wide text-table-font"
                  key={item}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasEvent ? (
              <div className="absolute top-0 left-0 z-10 flex h-[95%] w-full items-center justify-center bg-[rgba(255,255,255,0.8)]">
                <NoData
                  text="No Data"
                  width="w-14"
                  color="text-[#c9c9c9]"
                  gap="mt-4 mb-2"
                  textSize="text-3xl"
                />
              </div>
            ) : null}
            {filteredTagData(filterTag.perato, tableData).map((event) => (
              <tr
                className="border-2 border-table-border hover:cursor-pointer hover:bg-table-hover"
                onClick={() => handleRowClick(event.id, event['S/N'])}
                key={event.id}
              >
                {tableHeader.map((header) => (
                  <td className="py-3 pl-3 text-start text-xs leading-10 tracking-wide ei:text-sm">
                    {event[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default DashboardTable;
