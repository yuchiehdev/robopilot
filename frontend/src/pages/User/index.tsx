/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import useModal from '../../hooks/useModal';
import Modal from '../../layout/Modal';
import Groups from './Groups';
import Users from './Users';
import './user.scss';
import mockUserData from '../../data/mockUser.json';
import mockGroupData from '../../data/mockGroup.json';
import UserForm from './UserForm';

const User = () => {
  const [selectedTab, setSelectedTab] = useState('groups');
  const [deleteItem, setDeleteItem] = useState('');
  const [updateItem, setUpdateItem] = useState('');
  const { isOpen: isAddModalOpen, toggleModal: toggleAddModal } = useModal();
  const { isOpen: isUpdateModalOpen, toggleModal: toggleUpdateModal } = useModal();
  const { isOpen: isDeleteModalOpen, toggleModal: toggleDeleteModal } = useModal();

  const addGroupHandler = () => {};
  const deleteHandler = (name: string) => {};
  const openUpdateHandler = (id: string) => {
    setUpdateItem(id);
    toggleUpdateModal();
  };
  const openDeleteHandler = (id: string) => {
    toggleDeleteModal();
    setDeleteItem(id);
  };
  const handleTabChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedTab(event.target.value);
  };
  return (
    <main className="relative bg-[#fafafa]">
      <section className="m-auto grid h-full w-11/12 grid-rows-6 gap-10 p-4 ">
        <section className="row-span-1 flex flex-col">
          <section className="flex grow items-center justify-start gap-3">
            <div className="bg-[rgba(#e6eef9, 0.5)] flex items-center justify-center font-sans font-extrabold">
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
                  Users<span className="notification">2</span>
                </label>
                <span className="glider"> </span>
              </div>
            </div>
          </section>
          <section className="flex w-full justify-end">
            <button
              className={`h-8 w-32 rounded-full bg-red px-8 py-1 text-white ${
                selectedTab === 'groups'
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
              onClick={() => toggleAddModal()}
            >
              + Add
            </button>
          </section>
        </section>
        <section className="row-span-5">
          {selectedTab === 'groups' ? (
            <Groups
              data={mockGroupData}
              onOpenDeleteModal={openDeleteHandler}
              onOpenUpdateModal={openUpdateHandler}
            />
          ) : (
            <Users onOpenDeleteModal={openDeleteHandler} data={mockUserData} />
          )}
        </section>
      </section>
      <Modal
        isOpen={isAddModalOpen}
        onClick={toggleAddModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Add Device
        </h1>
        <UserForm />
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        onClick={toggleUpdateModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Update Device
        </h1>
        <UserForm defaultUpdateValue={mockGroupData.find((e) => e.id === updateItem)} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClick={toggleDeleteModal}
        tailwindClass="flex flex-col items-start p-8 dark:bg-black dark:text-white"
        width="w-fit"
        height="h-fit"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Delete Device
        </h1>
        <p>
          Confirm to delete device{' '}
          {selectedTab === 'groups' ? (
            <strong>{deleteItem}</strong>
          ) : (
            <strong>{mockUserData.find((e) => e.id === deleteItem)?.name}</strong>
          )}
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
              deleteHandler('testing');
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
