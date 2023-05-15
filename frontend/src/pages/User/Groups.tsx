/* eslint-disable no-underscore-dangle */
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import NoData from '../../components/IconText';
import { ReactComponent as EditIcon } from '../../assets/icons/pen.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icons/trash-can.svg';
import type { userGroupType } from '../../types';

const tableCeil: string[] = ['GroupName', 'AccessLevel', 'Description'];
const tableHeader: string[] = ['Group Name', 'Access Level', 'Description'];

type GroupsProps = {
  onOpenUpdateModal: (id: string) => void;
  onOpenDeleteModal: ({ genre, id }: { genre: string; id: string }) => void;
  data: userGroupType[] | undefined;
};
const Groups = ({ data, onOpenDeleteModal, onOpenUpdateModal }: GroupsProps) => {
  const hasEvent = data && data.length > 0;
  return (
    <section className="scrollBarStyle relative m-auto h-[98%] w-full overflow-y-auto">
      <table className="w-full">
        <thead className="sticky top-[-2px]">
          <tr className="border-2 border-table-border bg-table-bg">
            {tableHeader.map((item) =>
              item === 'Access Level' ? (
                <th
                  className="pl-2 text-start text-sm leading-10 tracking-wide text-table-font"
                  key={item}
                >
                  {item}
                  <Link to="/levelIllustration">
                    <IoMdInformationCircleOutline className="ml-2 inline-block text-lg text-[#b0b0b0] hover:cursor-pointer hover:text-[#185ee0]" />
                  </Link>
                </th>
              ) : (
                <th
                  className="pl-2 text-start text-sm leading-10 tracking-wide text-table-font"
                  key={item}
                >
                  {item}
                </th>
              ),
            )}
            <th>{null}</th>
          </tr>
        </thead>
        <tbody>
          {!hasEvent ? (
            <tr className="absolute top-0 left-0 z-10 flex h-[95%] w-full items-center justify-center bg-[rgba(255,255,255,0.8)]">
              <td colSpan={tableCeil.length + 1}>
                <NoData
                  text="No Data"
                  width="w-14"
                  color="text-[#c9c9c9]"
                  gap="mt-4 mb-2"
                  textSize="text-3xl"
                />
              </td>
            </tr>
          ) : null}
          {data &&
            data.map((item: any) => {
              return (
                <tr
                  className="border-2 border-table-border hover:bg-table-hover"
                  key={item._id.$oid}
                >
                  {tableCeil.map((ceil: string) => (
                    <td
                      key={ceil}
                      className="min-w-[10rem] py-3 pl-3 text-start text-xs leading-10 tracking-wide ei:text-sm"
                    >
                      {item[ceil]}
                    </td>
                  ))}
                  <td className="min-w-[6rem] pr-4">
                    <div className="flex h-full items-center justify-end gap-1">
                      <button
                        className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                        onClick={() => onOpenUpdateModal(item._id.$oid)}
                      >
                        <EditIcon className="right-2 top-2 w-4 fill-wiwynn-blue dark:fill-wiwynn-green" />
                      </button>
                      <button
                        onClick={() =>
                          onOpenDeleteModal({ genre: 'group', id: item._id.$oid })
                        }
                        className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                      >
                        <DeleteIcon className="right-2 top-2 w-4 fill-wiwynn-blue dark:fill-wiwynn-green" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
};

export default Groups;
