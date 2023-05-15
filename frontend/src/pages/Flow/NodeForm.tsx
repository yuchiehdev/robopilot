/* eslint-disable no-underscore-dangle */
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, memo, useState, useMemo } from 'react';
import type { DeviceType, EntityType } from '../../types';
import { getDevice, getDeviceSetting } from '../../api/device';

const refetchInterval = 1000;
type NodeSubmitData = {
  name: string;
  device: string;
  action: string;
  module: string;
};
type NodeFormProps = {
  updateNode?: EntityType;
  toggleModal: () => void;
  setSubmitValue?: (value: object) => void;
  setSubmitValueDrag?: (value: object) => void;
  setSubmitValueUpdate?: (value: object) => void;
  checkName?: (value: string) => boolean;
};
let module = '';

const NodeForm = ({
  toggleModal,
  setSubmitValue,
  setSubmitValueDrag,
  setSubmitValueUpdate,
  updateNode,
  checkName,
}: NodeFormProps) => {
  const { register, handleSubmit, watch, setFocus } = useForm<NodeSubmitData>();
  const onSubmitHandler: SubmitHandler<NodeSubmitData> = (data) => {
    const newNode = {
      updateId: updateNode?.id,
      name: data.name,
      device: data.device,
      action: actionRef.current?.value,
      module,
    };
    if (setSubmitValue) {
      setSubmitValue(() => newNode);
    }
    if (setSubmitValueDrag) {
      setSubmitValueDrag(() => newNode);
    }
    if (setSubmitValueUpdate) {
      setSubmitValueUpdate(() => newNode);
    }
    toggleModal();
  };
  const actionRef = useRef<HTMLSelectElement>(null);
  const [nameAlert, setNameAlert] = useState('');
  useEffect(() => {
    setFocus('name');
  }, []);
  const {
    data: deviceData,
    isLoading: deviceIsLoading,
    isError: deviceIsError,
    error: deviceError,
    isSuccess: deviceIsSuccess,
  } = useQuery({
    queryKey: ['device'],
    queryFn: getDevice,
    refetchInterval,
  });
  const {
    data: deviceSettingData,
    isLoading: deviceSettingIsLoading,
    isError: deviceStatusIsError,
    error: deviceStatusError,
  } = useQuery({
    queryKey: ['status'],
    queryFn: getDeviceSetting,
    refetchInterval,
    cacheTime: Infinity,
  });
  const formattedDeviceData = useMemo(() => {
    if (deviceIsSuccess) {
      return deviceData.map((item: DeviceType) => {
        const {
          _id: { $oid },
          connector,
        } = item;
        return {
          ...item,
          id: $oid,
          connector: connector.replaceAll('_', ' '),
          receiverIp: item.receiver.ip.replaceAll('.', ''),
          receiverPort: item.receiver.port,
          controllerIp: item.controller?.ip.replaceAll('.', '') || null,
          controllerPort: item.controller?.port || null,
        };
      });
    }
    return [];
  }, [deviceIsSuccess, deviceData]);
  if (deviceIsLoading || deviceSettingIsLoading) return <div>Loading...</div>;

  const deviceOptions = formattedDeviceData.map((item: DeviceType) => (
    <option value={item.name} key={item._id.$oid}>
      {item.name}
    </option>
  ));
  const actionOptions = () => {
    const currentSelected =
      watch('device') || updateNode?.data.device || formattedDeviceData[0].name;
    const currentSelectedDevice = formattedDeviceData.find(
      (d: DeviceType) => d.name === currentSelected,
    );

    switch (currentSelectedDevice?.connector) {
      case 'ts5000':
        module = deviceSettingData?.conn_table?.ts5000?.module || 'Controller Node';
        return deviceSettingData?.conn_table?.ts5000?.action?.map((item: string) => {
          return (
            <option value={item} key={item}>
              {item}
            </option>
          );
        });
      case 'kv8000':
        return deviceSettingData?.conn_table?.kv8000?.action?.map((item: string) => {
          module = deviceSettingData?.conn_table?.kv8000?.module || 'Controller Node';
          return (
            <option value={item} key={item}>
              {item}
            </option>
          );
        });
      default:
        return null;
    }
  };
  if (deviceIsError) return <div>{JSON.stringify(deviceError)}</div>;
  if (deviceStatusIsError) return <div>{JSON.stringify(deviceStatusError)}</div>;
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="ml-6 flex min-w-[330px] flex-col items-start gap-6 text-gray-200"
    >
      <label htmlFor="name" className="text-lg font-semibold">
        Name
        <input
          defaultValue={updateNode?.data.entityName || ''}
          type="text"
          id="name"
          {...register('name')}
          autoComplete="off"
          onBlur={(e) => {
            if (checkName) {
              if (checkName(e.target.value)) {
                setNameAlert('Name already exists!');
              } else {
                setNameAlert('');
              }
            }
          }}
          className={`ml-6 rounded-md border-2 border-gray-80 px-2 text-base font-normal text-black  ${
            nameAlert ? 'focus:outline-red' : 'focus:outline-wiwynn-blue'
          }`}
        />
        <span className="ml-2 text-red">{nameAlert}</span>
      </label>

      <section className="flex">
        <label htmlFor="Device" className="text-lg font-semibold">
          Device
          <select
            defaultValue={updateNode?.data.device || formattedDeviceData[0]?.name}
            id="device"
            className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
            {...register('device')}
          >
            {deviceOptions}
          </select>
        </label>
      </section>
      <section>
        <label htmlFor="Action" className="text-lg font-semibold">
          Action
          <select
            defaultValue={updateNode?.data.action}
            id="action"
            className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
            {...register('action')}
            ref={actionRef}
          >
            {actionOptions()}
          </select>
        </label>
      </section>
      <button className="ml-4 mt-4 rounded-xl bg-wiwynn-blue px-6 py-2 font-semibold tracking-wide text-white">
        Submit
      </button>
    </form>
  );
};
const memoizedNodeForm = memo(NodeForm);

export default memoizedNodeForm;
