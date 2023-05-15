/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import GroupForm from './GroupForm';
import Groups from './Groups';
import Modal from '../../layout/Modal';
import TagInput from '../../components/TagInput';
import useModal from '../../hooks/useModal';
import Users, { tableHeader } from './Users';
import { useAppSelector } from '../../store';
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery';
import { useAuthenticatedMutation } from '../../hooks/useAuthenticatedMutation';
import { USER_GROUP, ALL_USER, USER } from '../../data/fetchUrl';
import type { userGroupType, allUserType, TagObjType } from '../../types';
import './user.scss';

type TableHeaderItem = {
  name: string;
  sortBy: string;
};

const tableCeil: TableHeaderItem[] = tableHeader.map((header) => {
  const sortBy = header.toLowerCase().replace(/\s+/g, '');
  return { name: header, sortBy };
});
tableCeil.push({ name: 'Search All', sortBy: 'searchAll' });

const filterTagInputResult = (
  tags: { category: string; input: string }[],
  fetchData: allUserType[] = [],
) => {
  let result = fetchData;
  return tags.map((tagObj: { category: string; input: string }) => {
    result = result?.filter((item: allUserType) => {
      switch (tagObj.category) {
        case 'Search All':
          return (
            item.employeeID?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase()) ||
            item.name?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase()) ||
            item.mail?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase()) ||
            item.department?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase()) ||
            item.permission?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase()) ||
            item.group?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase())
          );
        case 'Employee ID':
          return item.employeeID
            ?.toLowerCase()
            ?.includes(tagObj.input.trim().toLowerCase());
        case 'Name':
          return item.name?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase());
        case 'Email':
          return item.mail?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase());
        case 'Department':
          return item.department
            ?.toLowerCase()
            ?.includes(tagObj.input.trim().toLowerCase());
        case 'Access Level':
          return item.permission
            ?.toLowerCase()
            ?.includes(tagObj.input.trim().toLowerCase());
        case 'Group':
          return item.group?.toLowerCase()?.includes(tagObj.input.trim().toLowerCase());
        default:
          return item;
      }
    });
    return result;
  });
};

const User = () => {
  const queryClient = useQueryClient();
  const username = { username: useAppSelector((state) => state.user.name) };
  const [tagObjs, setTagObjs] = useState<TagObjType[]>([]);
  const [displayData, setDisplayData] = useState<allUserType[]>([]);
  const [selectedTab, setSelectedTab] = useState('groups');
  const [deleteItem, setDeleteItem] = useState({
    genre: '',
    id: '',
  });
  const [updateItem, setUpdateItem] = useState('');
  const { isOpen: isAddModalOpen, toggleModal: toggleAddModal } = useModal();
  const { isOpen: isUpdateModalOpen, toggleModal: toggleUpdateModal } = useModal();
  const { isOpen: isDeleteModalOpen, toggleModal: toggleDeleteModal } = useModal();
  const { data: userGroupData } = useAuthenticatedQuery<userGroupType[]>(
    ['userGroup'],
    USER_GROUP,
    'GET',
    username,
  );
  const { data: allUserData } = useAuthenticatedQuery<allUserType[]>(
    ['allUser'],
    ALL_USER,
    'GET',
    username,
  );
  const deleteUserMutation = useAuthenticatedMutation(USER, 'DELETE', {
    onSuccess: () => {
      queryClient.invalidateQueries(['allUser']);
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error);
    },
  });
  const deleteUserGroupMutation = useAuthenticatedMutation(USER_GROUP, 'DELETE', {
    onSuccess: () => {
      queryClient.invalidateQueries(['userGroup']);
      queryClient.invalidateQueries(['allUser']);
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error);
    },
  });

  useEffect(() => {
    if (tagObjs.length === 0) {
      const turnIntoArray = (items: allUserType[] | undefined) => [...(items || [])];
      setDisplayData(turnIntoArray(allUserData));
    } else {
      setDisplayData(
        filterTagInputResult(tagObjs, allUserData)[
          filterTagInputResult(tagObjs, allUserData).length - 1
        ],
      );
    }
  }, [tagObjs, allUserData]);
  const deleteHandler = (name: string) => {
    if (deleteItem.genre === 'user') {
      const deleteOne = displayData.find((item) => item._id.$oid === name);
      if (deleteOne) {
        deleteUserMutation.mutate({
          queryParams: { username: deleteOne.employeeID },
          body: {},
        });
      }
    } else if (deleteItem.genre === 'group') {
      const deleteOne = userGroupData?.find(
        (e) => e._id.$oid === deleteItem.id,
      )?.GroupName;
      if (deleteOne) {
        deleteUserGroupMutation.mutate({
          queryParams: { groupname: deleteOne },
          body: {},
        });
      }
    }

    toggleDeleteModal();
  };
  const openUpdateHandler = (id: string) => {
    setUpdateItem(id);
    toggleUpdateModal();
  };
  const openDeleteHandler = ({ genre, id }: { genre: string; id: string }) => {
    toggleDeleteModal();
    setDeleteItem({
      genre,
      id,
    });
  };
  const handleTabChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedTab(event.target.value);
  };
  return (
    <main className="relative bg-[#fafafa] dark:bg-black dark:text-white">
      <section className="m-auto grid h-full w-11/12 grid-rows-6 gap-10 p-4 ">
        <section className="row-span-1 flex flex-col">
          <section className="flex grow items-center justify-start">
            <div
              className={`bg-[rgba(#e6eef9, 0.5)] mr-10 flex items-center justify-start font-sans font-extrabold dark:text-blue-dark ${
                selectedTab === 'users' ? null : 'grow'
              }`}
            >
              <div className="tabs">
                <input
                  type="radio"
                  id="radio-1"
                  name="tabs"
                  value="groups"
                  checked={selectedTab === 'groups'}
                  onChange={handleTabChange}
                />
                <label className="tab" htmlFor="radio-1">
                  Groups
                </label>
                <input
                  type="radio"
                  id="radio-2"
                  name="tabs"
                  value="users"
                  checked={selectedTab === 'users'}
                  onChange={handleTabChange}
                />
                <label className="tab" htmlFor="radio-2">
                  Users
                  <span className="notification">
                    {
                      displayData
                        ?.filter((item) => !item.username.startsWith('admin'))
                        ?.filter((item) => item.group === null).length
                    }
                  </span>
                </label>
                <span className="glider"> </span>
              </div>
            </div>
            <section
              className={`grow ${
                selectedTab === 'users'
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none hidden opacity-0'
              }`}
            >
              <TagInput
                dropdownItems={tableCeil}
                tagObjs={tagObjs}
                setTagObjs={setTagObjs}
                statusItems={Array.from(
                  new Set(allUserData?.map((item) => item.permission) || []),
                )}
              />
            </section>
            <section className="flex items-center justify-end">
              <button
                className={`h-8 w-32 rounded-full bg-red px-8 py-1 text-white ${
                  selectedTab === 'groups'
                    ? 'pointer-events-auto opacity-100'
                    : 'pointer-events-none hidden opacity-0'
                }`}
                onClick={() => toggleAddModal()}
              >
                + Add
              </button>
            </section>
          </section>
        </section>
        <section className="row-span-5">
          {selectedTab === 'groups' ? (
            <Groups
              data={userGroupData}
              onOpenDeleteModal={openDeleteHandler}
              onOpenUpdateModal={openUpdateHandler}
            />
          ) : (
            <Users
              onOpenDeleteModal={openDeleteHandler}
              data={displayData || []}
              groupsData={userGroupData || []}
            />
          )}
        </section>
      </section>
      <Modal
        isOpen={isAddModalOpen}
        onClick={toggleAddModal}
        tailwindClass="flex flex-col items-start p-8 px-16 dark:bg-black dark:text-white"
        width="w-[45rem]"
        height="p-8"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Add Group
        </h1>
        <GroupForm userData={displayData || []} toggleModal={toggleAddModal} />
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        onClick={toggleUpdateModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-[45rem]"
        height="p-8"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Update Group
        </h1>
        <GroupForm
          toggleModal={toggleUpdateModal}
          userData={displayData || []}
          defaultUpdateValue={userGroupData?.find((e) => e._id.$oid === updateItem)}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClick={toggleDeleteModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Delete User
        </h1>
        <p>
          Confirm to delete user{' '}
          <strong>
            {deleteItem.genre === 'user'
              ? displayData?.find((e) => e._id.$oid === deleteItem.id)?.username
              : userGroupData?.find((e) => e._id.$oid === deleteItem.id)?.GroupName}
          </strong>
        </p>
        <section className="mt-8 flex w-full justify-center gap-5 font-semibold">
          <button
            className="rounded-md bg-gray-120 px-3 py-1 text-white"
            onClick={toggleDeleteModal}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-red px-3 py-1 text-white"
            onClick={() => {
              toggleDeleteModal();
              deleteHandler(deleteItem.id);
            }}
          >
            Confirm
          </button>
        </section>
      </Modal>
    </main>
  );
};

export default User;
