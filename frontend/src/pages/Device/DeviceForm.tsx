import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../store';
import { postAddDevice } from '../../store/deviceSlice';
import type { DeviceType } from '../../types';
import { getDeviceSetting } from '../../api/device';

type DeviceFormProps = {
  updateItem?: DeviceType;
  toggleModal: () => void;
  setIsSpinnerShow: (value: boolean) => void;
};

type DeviceInputs = {
  name: string;
  locked: string;
  type: 'controller' | 'sensor';
  connector: string;
  controller?: {
    ip: string;
    port: number;
  };
  receiver: {
    ip: string;
    port: number;
  };
  subdevice: string | null;
  ref: {
    TS5000: null | string;
    TABLE_A: null | string;
    TABLE_B: null | string;
    CONVEYOR: null | string;
  };
};

const DeviceForm: React.FC<DeviceFormProps> = (props) => {
  const { toggleModal, setIsSpinnerShow, updateItem } = props;
  const device = useAppSelector((state) => state.device);
  const dispatch = useAppDispatch();
  let connectorOptions;
  let needController = false;
  let isKv8000 = false;

  const { data: deviceSettingTemp } = useQuery<any, Error>({
    queryKey: ['deviceSetting'],
    queryFn: () => getDeviceSetting(),
    onError: (err) => {
      throw err;
    },
  });

  const formattedDeviceData = useMemo(() => {
    if (deviceSettingTemp) {
      return {
        ...deviceSettingTemp,
        controller: Object.keys(deviceSettingTemp.conn_table),
        sensor: [''],
      };
    }
    return null;
  }, [deviceSettingTemp]);

  useEffect(() => {
    setFocus('name');
  });

  const { register, handleSubmit, watch, setFocus } = useForm<DeviceInputs>();

  const onSubmit: SubmitHandler<DeviceInputs> = (data) => {
    if (data.type === 'sensor') {
      delete data.controller;
    }
    dispatch(postAddDevice(data));
    toggleModal();
    setIsSpinnerShow(true);
  };

  if (watch('type') === 'sensor') {
    needController = false;
    const sensors = Object.entries(formattedDeviceData.conn_table)
      .filter(([_, value]: any) => value.type === 'sensor')
      .map(([key, _]) => key);
    connectorOptions = sensors.map((item: any) => (
      <option value={item} key={item}>
        {item}
      </option>
    ));
  } else {
    needController = true;
    connectorOptions = formattedDeviceData?.controller?.map((item: any) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  }

  if (watch('connector') === 'kv8000') {
    isKv8000 = true;
  } else {
    isKv8000 = false;
  }

  const refOptions = (refDevice: string) => {
    const connectorValue = formattedDeviceData?.action_mapping_table[refDevice];
    const options = device.device.filter((d) => d.connector === connectorValue);
    const refOpt = options.map((item) => (
      <option value={formattedDeviceData?.action_mapping_table.TS5000}>
        {item.name}
      </option>
    ));

    return refOpt;
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="ml-6 flex flex-col items-start gap-6 text-gray-200"
    >
      <section className="flex">
        <label htmlFor="name" className="text-lg font-semibold">
          Name
          <input
            type="text"
            id="name"
            defaultValue={updateItem?.name || ''}
            autoComplete="off"
            {...register('name')}
            className="ml-6 rounded-md border-2 border-gray-80 px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
          />
        </label>
        <label className="ml-4 text-lg font-semibold" htmlFor="type">
          Lock
          <select
            id="locked"
            defaultValue={updateItem?.locked.toString() || 'false'}
            className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
            {...register('locked')}
          >
            <option value="false">Open</option>
            <option value="true">Locked</option>
          </select>
        </label>
      </section>
      <section className="flex">
        <label className="text-lg font-semibold" htmlFor="type">
          Type
          <select
            id="type"
            defaultValue={updateItem?.type}
            className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
            {...register('type')}
          >
            <option value="controller">controller</option>
            <option value="sensor">sensor</option>
          </select>
        </label>
        <label className="ml-4 text-lg font-semibold" htmlFor="connector">
          Connector
          <select
            id="connector"
            defaultValue={updateItem?.connector}
            className="ml-6 rounded-md border-2 border-gray-80 px-2 text-base font-normal text-black"
            {...register('connector')}
          >
            {connectorOptions}
          </select>
        </label>
      </section>
      {needController && (
        <section>
          <label className="text-lg font-semibold" htmlFor="controller-ip">
            Controller-ip
            <input
              id="controller-ip"
              autoComplete="off"
              defaultValue={updateItem?.controller?.ip || ''}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
              {...register('controller.ip')}
            />
          </label>
          <label className="ml-4 text-lg font-semibold" htmlFor="controller-port">
            Controller-port
            <input
              type="number"
              id="controller-port"
              defaultValue={updateItem?.controller?.port || ''}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
              {...register('controller.port')}
            />
          </label>
        </section>
      )}
      <section>
        <label className="text-lg font-semibold" htmlFor="receiver-ip">
          Receiver-ip
          <input
            id="receiver-ip"
            autoComplete="off"
            defaultValue={updateItem?.receiver?.ip || ''}
            className="ml-6 rounded-md border-2  border-gray-80 px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
            {...register('receiver.ip')}
          />
        </label>
        <label className="ml-4 text-lg font-semibold" htmlFor="receiver-port">
          Receiver-port
          <input
            type="number"
            id="receiver-port"
            defaultValue={updateItem?.receiver?.port || ''}
            className="ml-6 rounded-md border-2 border-gray-80 px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
            {...register('receiver.port')}
          />
        </label>
      </section>
      {isKv8000 && (
        <label className="text-lg font-semibold" htmlFor="subdevice">
          Sub-device
          <select
            id="subdevice"
            className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
            {...register('subdevice')}
          >
            {formattedDeviceData?.conn_table?.kv8000?.subdevice?.map((item: any) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
        </label>
      )}
      <section className="hidden">
        <p className="text-lg font-semibold">Reference</p>
        <section className="my-4 flex">
          <label className="text-md font-semibold" htmlFor="ref-ts5000">
            TS5000
            <select
              id="ref-ts5000"
              defaultValue={updateItem?.ref?.TS5000}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TS5000')}
            >
              <option value="null">null</option>
              {formattedDeviceData?.action_mapping_table.TS5000 &&
                refOptions(
                  formattedDeviceData?.action_mapping_table.TS5000.toUpperCase(),
                )}
            </select>
          </label>
          <label className="text-md pl-4 font-semibold" htmlFor="ref-table_a">
            TABLE_A
            <select
              id="ref-table_a"
              defaultValue={updateItem?.ref?.TABLE_A}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TABLE_A')}
            >
              <option value="null">null</option>
              {formattedDeviceData?.action_mapping_table.TABLE_A && (
                <option value={formattedDeviceData?.action_mapping_table.TABLE_A}>
                  {formattedDeviceData?.action_mapping_table.TABLE_A}
                </option>
              )}
            </select>
          </label>
        </section>
        <section className="my-4 flex w-full">
          <label className="text-md font-semibold" htmlFor="ref-table_b">
            TABLE_B
            <select
              id="ref-table_b"
              defaultValue={updateItem?.ref?.TABLE_B}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TABLE_B')}
            >
              <option value="null">null</option>
              {formattedDeviceData?.action_mapping_table.TABLE_B && (
                <option value={formattedDeviceData?.action_mapping_table.TABLE_B}>
                  {formattedDeviceData?.action_mapping_table.TABLE_B}
                </option>
              )}
            </select>
          </label>
          <label className="text-md pl-4 font-semibold" htmlFor="ref-conveyor">
            CONVEYOR
            <select
              id="ref-conveyor"
              defaultValue={updateItem?.ref?.CONVEYOR}
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.CONVEYOR')}
            >
              <option value="null">null</option>
              {formattedDeviceData?.action_mapping_table.CONVEYOR && (
                <option value={formattedDeviceData?.action_mapping_table.CONVEYOR}>
                  {formattedDeviceData?.action_mapping_table.CONVEYOR}
                </option>
              )}
            </select>
          </label>
        </section>
      </section>
      <button
        onClick={handleSubmit(onSubmit)}
        className="mx-auto mt-4 rounded-xl bg-wiwynn-blue px-6 py-2 text-lg font-semibold tracking-wide text-white"
      >
        Submit
      </button>
    </form>
  );
};

export default DeviceForm;
