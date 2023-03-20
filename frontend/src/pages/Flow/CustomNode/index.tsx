import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import useModal from '../../../hooks/useModal';
import { useClickOutsideSingle } from '../../../hooks/useClickOutside';
import Modal from '../../../layout/Modal';
import { ReactComponent as EditIcon } from '../../../assets/icons/ellipsis-vertical.svg';
import walkerIcon from '../../../assets/icons/walker.png';
import testerIcon from '../../../assets/icons/tester.png';
import transferIcon from '../../../assets/icons/transfer.png';
import { useAppSelector, useAppDispatch } from '../../../store';
import { flowActions } from '../../../store/flowSlice';

let icon;

type CustomNodeProps = {
  data: any;
};

const CustomNode = ({ data }: CustomNodeProps) => {
  const [isShow, setIsShow] = useState(false); // option list show or not
  const { isOpen, toggleModal } = useModal();
  const dispatch = useAppDispatch();

  // optionShow is for other component to toggle option list
  const optionShow = useAppSelector((state) => state.flow.optionShow);
  useEffect(() => {
    if (optionShow === data.entityName) {
      setIsShow(true);
    }
    if (optionShow === 'false' || optionShow === '') {
      setIsShow(false);
    }
  }, [optionShow]);

  const setShow = () => {
    if (optionShow === data.entityName) {
      dispatch(flowActions.setOptionShow('false'));
    } else {
      dispatch(flowActions.setOptionShow(data.entityName));
    }
  };

  const deleteClickHandler = () => {
    data.onDelete({
      // delete function from parent (FlowSetting)
      name: data.entityName,
    });
  };

  const { domNode }: any = useClickOutsideSingle(() => {
    setIsShow(false);
  });

  switch (data.deviceType) {
    case 'Walker':
      icon = walkerIcon;
      break;
    case 'Tester':
      icon = testerIcon;
      break;
    case 'Transfer':
      icon = transferIcon;
      break;
    default:
      icon = walkerIcon;
  }

  return (
    <section className="relative rounded-md bg-white p-4 text-sm font-semibold dark:bg-black">
      <section className="flex items-center justify-between">
        <section className="flex items-start justify-center">
          <img alt="icon" src={icon} className="mr-1 h-6 w-6" />
          {/* <h1 className=" pb-2">{data.deviceType}</h1> */}
          <h1 className="pb-2">{data.entityName}</h1>
        </section>
        <button onClick={() => setShow()}>
          <EditIcon fill="#a8aaae" className="h-4 w-4" />
        </button>
      </section>
      <hr className="border-gray-60 py-1" />
      <section className="py-1 px-1 text-xs leading-6">
        <Handle type="target" position={Position.Left} style={{ left: -10 }} />
        {/* <h1>Entity Name: {data.entityName}</h1> */}
        <h1>Device: {data.device}</h1>
        <h1>Module: {data.module}</h1>
        <h1>Action: {data.action}</h1>
        <Handle type="source" position={Position.Right} id="a" style={{ right: -10 }} />
      </section>
      {isShow && (
        <ul
          className="absolute top-12 right-[-1.4rem] z-50 rounded-md border-2 border-gray-100 bg-white"
          ref={domNode}
        >
          <button onClick={data.onUpdate}>
            <li className="cursor-pointer py-2 px-2 text-gray-220 hover:bg-gray-60">
              編輯
            </li>
          </button>
          <button onClick={deleteClickHandler}>
            <li className="cursor-pointer py-2 px-2 text-red hover:bg-gray-60">刪除</li>
          </button>
        </ul>
      )}
      <Modal
        tailwindClass="flex flex-col items-start pl-[6rem] p-10 dark:bg-black dark:text-white"
        width="w-[40rem]"
        height="h-[23rem]"
        isOpen={isOpen}
        onClick={toggleModal}
      >
        Test
      </Modal>
    </section>
  );
};

export default CustomNode;
