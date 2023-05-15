/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo, useRef, useEffect, useState, CSSProperties } from 'react';
import ReactFlow, {
  addEdge,
  FitViewOptions,
  Controls,
  useNodesState,
  useReactFlow,
  useEdgesState,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import BeatLoader from 'react-spinners/BeatLoader';
import { useAppSelector, useAppDispatch } from '../../store';
import CustomNodeComponent from './CustomNode';
import IconButton from '../../components/IconButton';
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg';
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import Modal from '../../layout/Modal';
import useModal from '../../hooks/useModal';

import ButtonEdge from './ButtonEdge';
import NodeForm from './NodeForm';
import './Flow.scss';
import 'reactflow/dist/style.css';
import {
  fetchEntity,
  fetchEdge,
  postEntity,
  postEdge,
  flowActions,
} from '../../store/flowSlice';
import { initialNodes } from './InitialData';
import type { EntityType } from '../../types';
import useSpinnerTimer from '../../hooks/useSpinnerTimer';

// spinner style
const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '55%',
  transform: 'translate(-50%, -50%)',
  margin: '0 auto',
};

let id = 0;
const getId = () => {
  // for drag and drop's initial node and edge id
  id += 1;
  return `Entity-${id}`;
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.5,
};

const Flow = () => {
  const connectingNodeId = useRef(null);
  const connectingNodeHandleId = useRef(null);
  const connectingNodeHandleType = useRef(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeTypes = useMemo(() => ({ customNode: CustomNodeComponent }), []);
  const dispatch = useAppDispatch();
  // set any only because removed flow state from redux
  const fetchedEntity = useAppSelector((state: any) => state.flow.entity);
  const fetchedEdge = useAppSelector((state: any) => state.flow.edge);
  const clickedEdgeId = useAppSelector((state: any) => state.flow.edgeId);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [submitValue, setSubmitValue] = useState(Object);
  const [submitValueDrag, setSubmitValueDrag] = useState(Object);
  const [submitValueUpdate, setSubmitValueUpdate] = useState(Object);
  const [submitId, setSubmitId] = useState('');
  const [updateNode, setUpdateNode] = useState<EntityType>();
  const [deleteNode, setDeleteNode] = useState(Object);
  const { showSpinner, setShowSpinner } = useSpinnerTimer(1.3);
  const { isOpen: isOpenButtonAdd, toggleModal: toggleButtonAdd } = useModal();
  const { isOpen: isOpenUpdate, toggleModal: toggleUpdate } = useModal();
  const { isOpen: isOpenDragAdd, toggleModal: toggleDragAdd } = useModal();
  const { isOpen: isOpenUpload, toggleModal: toggleUpload } = useModal();
  const { isOpen: isOpenDelete, toggleModal: toggleDelete } = useModal();
  const { project } = useReactFlow();
  const first = useRef(true);

  useEffect(() => {
    dispatch(fetchEntity());
    dispatch(fetchEdge());
  }, [dispatch]);

  useEffect(() => {
    // fetch data from api and set to node and edge
    setNodes((nds) =>
      // remove initial node (for a better fit view)
      nds.filter((node) => {
        return node.id !== 'name' && node.id !== 'name1' && node.id !== 'name2';
      }),
    );

    fetchedEntity.forEach((item: any) => {
      // fetch data from api and set to node
      const nodeAddFunc = {
        ...item,
        data: {
          ...item.data,
          onUpdate: updateHandler,
          onDelete: deleteHandler,
        },
      };
      setNodes((nds) => {
        // remove duplicate node (somehow it will create duplicate node)
        const index = nds.findIndex((node) => node.id === item.id);
        if (index !== -1) {
          nds.splice(index, 1);
        }
        return nds.concat(nodeAddFunc);
      });
    });
    fetchedEdge.forEach((item: any) => {
      // set any only because removed flow state from redux
      // fetch data from api and set to edge
      setEdges((eds) => {
        // remove duplicate edge (somehow it will create duplicate edge)
        // set any only because removed flow state from redux
        const index = eds.findIndex((edge: any) => edge.id === item.id);
        if (index !== -1) {
          eds.splice(index, 1);
        }
        return eds.concat(item);
      });
    });
  }, [fetchedEntity, fetchedEdge]);

  useEffect(() => {
    // add node when child component submit
    if (first.current) {
      // prevent creating a new node on first render
      first.current = false;
      return;
    }
    addNodeHandler({
      target: { classList: { contains: () => true } },
      clientX: 0,
      clientY: 0,
    });
  }, [submitValue]);

  const updateHandler = () => {
    // pass to CustomNode component for open modal
    toggleUpdate();
  };

  const deleteHandler = (prop: any) => {
    // pass to CustomNode component for open modal
    toggleDelete();
    setDeleteNode({ name: prop.name });
  };

  useEffect(() => {
    // update node when child component submit
    if (first.current) {
      // prevent creating a new node on first render
      first.current = false;
      return;
    }
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === submitValueUpdate.updateId) {
          node.data = {
            ...node.data,
            entityName: submitValueUpdate.name,
            device: submitValueUpdate.device,
            module: submitValueUpdate.module,
            action: submitValueUpdate.action,
          };
        }
        return node;
      });
    });
  }, [submitValueUpdate]);

  useEffect(() => {
    // node will be created right after drag, need to update the value after submit
    setNodes((nds) =>
      nds.map((node) => {
        if (JSON.stringify(node) === '{}') return node;
        if (node.id === submitId) {
          node.id = submitValueDrag.name;
          node.data = {
            ...node.data,
            entityName: submitValueDrag.name,
            device: submitValueDrag.device,
            module: submitValueDrag.module,
            action: submitValueDrag.action,
          };
        }
        return node;
      }),
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === submitId) {
          if (edge.source === submitId) {
            edge.source = submitValueDrag.name;
          } else if (edge.target === submitId) {
            edge.target = submitValueDrag.name;
          }
        }
        return edge;
      }),
    );
  }, [submitValueDrag]);

  useEffect(() => {
    if (clickedEdgeId) {
      // delete edge when click on button edge component
      setEdges((eds) => eds.filter((e) => e.id !== clickedEdgeId));
    }
  }, [clickedEdgeId]);

  const onConnect = useCallback(
    // add edge when connect two node, default usage, only change edge style
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'buttonedge',
            animated: true,
            style: { stroke: 'rgb(0,108,146)', strokeWidth: 2 },
          },
          eds,
        ),
      ),
    [],
  );
  const onConnectStart = useCallback((_: any, { nodeId, handleId, handleType }: any) => {
    // for drag add node, set node id and handle id
    connectingNodeId.current = nodeId;
    connectingNodeHandleId.current = handleId;
    connectingNodeHandleType.current = handleType;
  }, []);
  const onConnectEnd = useCallback(
    (event: {
      target: { classList: { contains: (arg0: string) => any } };
      clientX: number;
      clientY: number;
    }) => {
      // for drag add node, check if the target is the pane and not a node
      const targetIsPane = event.target.classList.contains('react-flow__pane');
      // check if the target is the pane and not a node
      if (targetIsPane) {
        toggleDragAdd();
        let left = 0;
        let top = 0;
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (reactFlowBounds && 'left' in reactFlowBounds && 'top' in reactFlowBounds) {
          left = reactFlowBounds.left;
          top = reactFlowBounds.top;
        }

        // eslint-disable-next-line no-shadow
        const id = getId();
        setSubmitId(id);
        const newNodeDrag = {
          id,
          type: 'customNode',
          data: {
            deviceType: 'Walker',
            device: submitValueDrag.device,
            entityName: id,
            module: submitValueDrag.module,
            action: submitValueDrag.action,
            parameters: {
              links: { connector: 'ict', ip: '', port: '' },
              locationSrc: { X: 0, Y: 0 },
              locationDst: { X: 0, Y: 0 },
            },
            dialog: false,
            onUpdate: updateHandler,
            onDelete: deleteHandler,
          },
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          width: 199,
          height: 228,
          selected: false,
          positionAbsolute: { x: -600, y: 174.92000000000002 },
          dragging: false,
        };

        setNodes((nds) => nds.concat(newNodeDrag));

        setEdges((eds) => {
          let sourceitem = '';
          let targetitem = '';
          if (connectingNodeHandleType.current === 'target') {
            // check which handle are user dragging from
            sourceitem = id;
            targetitem = connectingNodeId.current || '';
          } else {
            sourceitem = connectingNodeId.current || '';
            targetitem = id;
          }
          return addEdge(
            {
              id,
              source: sourceitem,
              target: targetitem,
              animated: true,
              type: 'buttonedge',
              style: { stroke: 'rgb(0,108,146)', strokeWidth: 2 },
            },
            eds,
          );
        });
      }
    },
    [project, submitValueDrag, toggleDragAdd, dispatch],
  );
  const onInit = (reactFlowInstance: ReactFlowInstance) => reactFlowInstance.zoomTo(0.9);

  const addNodeHandler = (event: {
    target: { classList: { contains: (arg0: string) => any } };
    clientX: number;
    clientY: number;
  }) => {
    // eslint-disable-next-line no-shadow
    if (checkName(submitValue.name)) return; // cause entity name is the pk value of database
    const newNodeButton = {
      id: submitValue.name,
      type: 'customNode',
      data: {
        deviceType: 'Walker',
        device: submitValue.device,
        entityName: submitValue.name,
        module: submitValue.module,
        action: submitValue.action,
        parameters: {
          links: { connector: 'ict', ip: '', port: '' },
          locationSrc: { X: 0, Y: 0 },
          locationDst: { X: 0, Y: 0 },
        },
        dialog: false,
        onUpdate: updateHandler,
        onDelete: deleteHandler,
      },
      position: project({
        x: event.clientX + 10,
        y: event.clientY + 100,
      }),
      width: 199,
      height: 228,
      selected: false,
      positionAbsolute: { x: -600, y: 174.92000000000002 },
      dragging: false,
    };
    setNodes((nds) => nds.concat(newNodeButton));
  };

  const addIconClickHandler = () => {
    toggleButtonAdd();
  };

  const onNodeClick = (e: any, node: any) => {
    setUpdateNode(node);
  };
  const submitDelete = () => {
    setNodes((nds) =>
      nds.filter((node) => {
        return node.data.entityName !== deleteNode.name;
      }),
    );
    setEdges((eds) => {
      return eds.filter((edge) => {
        return edge.source !== deleteNode.name && edge.target !== deleteNode.name;
      });
    });
    toggleDelete();
    dispatch(flowActions.setOptionShow('false'));
  };
  const submitHandler = () => {
    const dataForNodeSubmit: {
      entityName: string;
      device: string;
      action: string;
      module: string;
      position: { x: number; y: number };
      parameters: { device: string; sensor: never[] };
    }[] = [];
    const dataForEdgeSubmit: {
      id: string;
      source: string;
      target: string;
    }[] = [];
    nodes.forEach((node) => {
      dataForNodeSubmit.push({
        entityName: node.data.entityName,
        device: node.data.device,
        action: node.data.action,
        module: node.data.module,
        position: {
          x: node.position?.x || 0,
          y: node.position?.y || 0,
        },
        parameters: {
          device: node.data.device,
          sensor: [],
        },
      });
    });
    edges.forEach((edge) => {
      dataForEdgeSubmit.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      });
    });
    dispatch(postEntity(dataForNodeSubmit));
    dispatch(postEdge(dataForEdgeSubmit));
    setShowSpinner(true);
    toggleUpload();
  };
  const onPaneClick = (e: any) => {
    dispatch(flowActions.setOptionShow('false'));
  };

  const checkName = (name: string) => {
    let check = false;
    nodes.forEach((node) => {
      if (node.data.entityName === name) {
        check = true;
      }
    });
    return check;
  };

  return (
    // className="relative overflow-scroll bg-white dark:bg-black"
    <main
      className={`[background-image: radial-gradient(#a8c3f1 8%, transparent 0)] relative flex items-center justify-center bg-[#f1f5f7] dark:bg-black dark:bg-none dark:text-white `}
    >
      <section className="relative h-[92%] w-11/12" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          // onConnectEnd={onConnectEnd}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          onInit={onInit}
          className=" dark:bg-black-100"
        >
          <Controls />
        </ReactFlow>
        <section className="absolute top-10 right-8 flex w-10 flex-col gap-4">
          <IconButton onClick={addIconClickHandler}>
            <AddIcon fill="rgba(65,113,255,0.8)" />
          </IconButton>
          <IconButton onClick={toggleUpload}>
            <UploadIcon fill="rgba(65,113,255,0.8)" />
          </IconButton>
        </section>
      </section>
      {showSpinner && (
        <div className="absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.7)]">
          <BeatLoader
            size={50}
            color="rgba(65,113,255)"
            loading
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

      <Modal
        isOpen={isOpenButtonAdd}
        onClick={toggleButtonAdd}
        tailwindClass="flex flex-col items-start pl-[6rem] p-10 dark:bg-black dark:text-white"
        width="w-[40rem]"
        height="h-[23rem]"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Add Node
        </h1>
        <NodeForm
          toggleModal={toggleButtonAdd}
          setSubmitValue={setSubmitValue}
          checkName={checkName}
        />
      </Modal>
      <Modal
        isOpen={isOpenUpdate}
        onClick={toggleUpdate}
        tailwindClass="flex flex-col items-start pl-[6rem] p-10 dark:bg-black dark:text-white"
        width="w-[40rem]"
        height="h-[23rem]"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Update Node
        </h1>
        <NodeForm
          toggleModal={toggleUpdate}
          setSubmitValueUpdate={setSubmitValueUpdate}
          updateNode={updateNode}
        />
      </Modal>
      <Modal
        isOpen={isOpenDragAdd}
        onClick={toggleDragAdd}
        tailwindClass="flex flex-col items-start pl-[6rem] p-10 dark:bg-black dark:text-white"
        width="w-[40rem]"
        height="h-[23rem]"
      >
        <h1 className="ml-6 mb-8 self-start text-2xl font-bold text-gray-200">
          Add Node
        </h1>
        <NodeForm toggleModal={toggleDragAdd} setSubmitValueDrag={setSubmitValueDrag} />
      </Modal>
      <Modal
        isOpen={isOpenDelete}
        onClick={toggleDelete}
        tailwindClass="flex flex-col items-start py-10 pl-10 pr-6 dark:bg-black dark:text-white"
        width="w-[36rem]"
        height="h-[16rem]"
      >
        <h1 className="mb-8 text-2xl font-bold text-gray-200">
          Are you sure to delete node{' '}
          <span className="bg-wiwynn-green">{deleteNode.name}</span>?
        </h1>
        <p>We will also delete the edge attached to it.</p>
        <button
          onClick={submitDelete}
          className="mx-auto mt-8 rounded-xl bg-[#E5446D] px-6 py-2 font-semibold tracking-wide text-white"
        >
          Delete
        </button>
      </Modal>
      <Modal
        isOpen={isOpenUpload}
        onClick={toggleUpload}
        tailwindClass="flex flex-col items-start py-10 pl-10 pr-4 dark:bg-black dark:text-white"
        width="w-[29rem]"
        height="h-[16rem]"
      >
        <h1 className="mb-8 text-2xl font-bold text-gray-200">
          Are you sure you want to upload?
        </h1>
        <p className="">
          We will upload the current flow, and overwrite the previous status.
        </p>
        <button
          onClick={submitHandler}
          className="mx-auto mt-8 rounded-xl bg-wiwynn-blue px-6 py-2 font-semibold tracking-wide text-white"
        >
          Upload
        </button>
      </Modal>
    </main>
  );
};

// eslint-disable-next-line react/function-component-definition
export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
