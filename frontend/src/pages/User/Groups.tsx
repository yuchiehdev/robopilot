import NoData from '../../components/IconText';
import { ReactComponent as EditIcon } from '../../assets/icons/pen.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/trash-can.svg';

const tableCeil: string[] = ['group_name', 'notification', 'access_level'];
const tableHeader: string[] = ['Group Name', 'Notification', 'Access Level'];

type GroupsProps = {
  onOpenUpdateModal: (id: string) => void;
  onOpenDeleteModal: (id: string) => void;
  data: {
    id: string;
    group_name: string;
    notification: string;
    access_level: string;
  }[];
};
const Groups = ({ data, onOpenDeleteModal, onOpenUpdateModal }: GroupsProps) => {
  const hasEvent = data.length > 0;
  return (
    <section className="scrollBarStyle relative m-auto h-[98%] w-full overflow-y-auto">
      <table className="w-full">
        <thead className="sticky top-[-2px]">
          <tr className="border-2 border-table-border bg-table-bg">
            {tableHeader.map((item) => (
              <th
                className="pl-2 text-start text-sm leading-10 tracking-wide text-table-font"
                key={item}
              >
                {item}
              </th>
            ))}
            <th>{null}</th>
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
          {data.map((item: any) => (
            <tr
              className="border-2 border-table-border hover:cursor-pointer hover:bg-table-hover"
              key={item.id}
            >
              {tableCeil.map((ceil: string) => (
                <td className="py-3 pl-3 text-start text-xs leading-10 tracking-wide ei:text-sm">
                  {item[ceil]}
                </td>
              ))}
              <td className="pr-4">
                <div className="flex flex h-full items-center justify-end gap-1">
                  <button
                    className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                    onClick={() => onOpenUpdateModal(item.id)}
                  >
                    <EditIcon className="right-2 top-2 w-4" fill="rgb(142, 211, 0)" />
                  </button>
                  <button
                    onClick={() => onOpenDeleteModal(item.group_name)}
                    className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                  >
                    <DeleteIcon className="right-2 top-2 w-4" fill="rgb(142, 211, 0)" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Groups;
