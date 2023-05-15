/* eslint-disable no-underscore-dangle */
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FcCheckmark } from 'react-icons/fc';
import NoData from '../../components/IconText';
import { ReactComponent as DeleteIcon } from '../../assets/icons/trash-can.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/pen.svg';
import { userGroupType, allUserType } from '../../types';
import { USER } from '../../data/fetchUrl';
import { useAuthenticatedMutation } from '../../hooks/useAuthenticatedMutation';
import Select, { SelectOption } from '../../components/Select';

export type UpdateUserInput = {
  username: string | undefined;
  group: string | undefined;
};

const tableCeil: string[] = [
  'employeeID',
  'username',
  'mail',
  'department',
  'permission',
  'group',
];
export const tableHeader: string[] = [
  'Employee ID',
  'Name',
  'Email',
  'Department',
  'Access Level',
  'Group',
];

type UsersProps = {
  onOpenDeleteModal: ({ genre, id }: { genre: string; id: string }) => void;
  data: allUserType[];
  groupsData: userGroupType[];
};

const Users = ({ onOpenDeleteModal, data, groupsData }: UsersProps) => {
  data = data
    .filter((item) => !item.username.startsWith('admin'))
    .map((item) => ({
      ...item,
      id: item._id.$oid,
    }))
    .sort((a, b) => {
      if (a.group === null) {
        return -1;
      }
      if (b.group === null) {
        return 1;
      }
      return a.group.localeCompare(b.group);
    });
  const queryClient = useQueryClient();
  const selectRef = useRef<HTMLDivElement>(null);
  const [editRow, setEditRow] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<SelectOption>({
    value: '',
    label: '',
  });
  const options: SelectOption[] = groupsData.map((item) => ({
    value: item.GroupName,
    label: item.GroupName,
  }));
  const handleChange = (option: SelectOption) => {
    setSelectedOption(option);
  };
  const updateUserMutation = useAuthenticatedMutation(USER, 'PUT', {
    onSuccess: () => {
      setEditRow('');
      queryClient.invalidateQueries(['allUser']);
      queryClient.setQueryData(['allUser'], (oldData: allUserType[] | undefined) => {
        const newData = oldData ?? [];
        oldData?.map((item: allUserType) => {
          if (item._id.$oid === editRow) {
            return {
              ...item,
              group: selectedOption?.value,
            };
          }
          return item;
        });
        return newData;
      });
    },
    onError: () => {
      setErrorMsg('Error!');
    },
  });

  const editIcoClickHandler = (id: string) => {
    setErrorMsg(null);
    setEditRow(id);
    selectRef.current?.focus();
    setSelectedOption({
      value: data.find((item) => item._id.$oid === id)?.group ?? null,
      label: data.find((item) => item._id.$oid === id)?.group ?? 'Select',
    });
  };
  const updateClickHandler = () => {
    const updateData = data.find((item) => item._id.$oid === editRow);
    updateUserMutation.mutate({
      queryParams: {},
      body: {
        username: updateData?.username,
        group: selectedOption?.value,
      },
    });
  };

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
          {!(data.length > 0) ? (
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
          {data.map((item: allUserType | any) => (
            <tr
              className={`border-2 border-table-border hover:bg-table-hover
              ${
                editRow === item.id
                  ? 'border-[rgba(141,211,0,0.5)] bg-[rgba(141,211,0,0.18)] hover:cursor-default hover:bg-[rgba(142,211,0,0.15)]'
                  : null
              }`}
              key={item.id}
            >
              {tableCeil.map((ceil: string) =>
                ceil === 'group' && editRow === item.id ? (
                  <td
                    key={ceil}
                    className="flex items-center py-3 pl-3 text-start text-xs leading-10 tracking-wide ei:text-sm"
                  >
                    <Select
                      ref={selectRef}
                      options={options}
                      onChange={handleChange}
                      value={selectedOption}
                      style={{ width: '70%' }}
                    />
                    <span
                      className={`errorMessage m-0 mr-1 ${
                        errorMsg ? 'inline-block animate-shake' : 'hidden'
                      }
          }`}
                    >
                      {errorMsg}
                    </span>
                  </td>
                ) : (
                  <td
                    className="py-3 pl-3 text-start text-xs leading-10 tracking-wide ei:text-sm"
                    key={ceil}
                  >
                    {item[ceil]}
                  </td>
                ),
              )}
              <td className="pr-2">
                <div className="flex h-full items-center justify-end gap-1">
                  {editRow === item.id ? (
                    <>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[1.5rem] text-gray-100 hover:text-gray-220"
                        onClick={() => setEditRow('')}
                      >
                        &times;
                      </button>
                      <button
                        className="rounded-lg p-2 pr-1"
                        onClick={() => updateClickHandler()}
                      >
                        <FcCheckmark className="right-2 top-2 h-5 w-5" fill="#A9A9A9" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                        onClick={() => editIcoClickHandler(item.id)}
                      >
                        <EditIcon className="right-2 top-2 w-4 fill-wiwynn-blue dark:fill-wiwynn-green" />
                      </button>
                      <button
                        onClick={() => onOpenDeleteModal({ genre: 'user', id: item.id })}
                        className="rounded-lg p-2 hover:bg-[rgba(142,211,0,0.15)]"
                      >
                        <DeleteIcon className="right-2 top-2 w-4 fill-wiwynn-blue dark:fill-wiwynn-green" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
