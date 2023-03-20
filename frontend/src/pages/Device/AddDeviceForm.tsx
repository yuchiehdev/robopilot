import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  fetchDeviceData,
  fetchDeviceStatusData,
  postAddDevice,
} from '../../store/deviceSlice';

type AddDeviceFormProps = {
  toggleModal: () => void;
  setIsSpinnerShow: (value: boolean) => void;
};

type DeviceInputs = {
  name: string;
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

const AddDeviceForm: React.FC<AddDeviceFormProps> = (props) => {
  const { toggleModal, setIsSpinnerShow } = props;
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    // formState: { errors },
  } = useForm<DeviceInputs>();

  const onSubmit: SubmitHandler<DeviceInputs> = (data) => {
    if (data.type === 'sensor') {
      delete data.controller;
    }
    dispatch(postAddDevice(data));
    dispatch(fetchDeviceData());
    dispatch(fetchDeviceStatusData());
    toggleModal();
    setIsSpinnerShow(true);
  };

  const deviceSetting = useAppSelector((state) => state.device.setting);
  let connectorOptions;
  let needController = false;
  let isKv8000 = false;

  if (watch('type') === 'controller') {
    needController = true;
    connectorOptions = deviceSetting?.controller.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  } else if (watch('type') === 'sensor') {
    needController = false;
    connectorOptions = deviceSetting?.sensor.map((item) => (
      <option value={item} key={item}>
        {item}
      </option>
    ));
  }

  if (watch('connector') === 'kv8000') {
    isKv8000 = true;
  } else {
    isKv8000 = false;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="ml-6 flex flex-col items-start gap-6 text-gray-200"
    >
      <label htmlFor="name" className="text-lg font-semibold">
        Name
        <input
          type="text"
          id="name"
          {...register('name')}
          className="ml-6 rounded-md border-2 border-gray-80 px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
        />
      </label>
      <section className="flex">
        <label className="text-lg font-semibold" htmlFor="type">
          Type
          <select
            id="type"
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
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
              {...register('controller.ip')}
            />
          </label>
          <label className="ml-4 text-lg font-semibold" htmlFor="controller-port">
            Controller-port
            <input
              type="number"
              id="controller-port"
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
            className="ml-6 rounded-md border-2  border-gray-80 px-2 text-base font-normal text-black focus:outline-wiwynn-blue"
            {...register('receiver.ip')}
          />
        </label>
        <label className="ml-4 text-lg font-semibold" htmlFor="receiver-port">
          Receiver-port
          <input
            type="number"
            id="receiver-port"
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
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="conveyor">conveyor</option>
          </select>
        </label>
      )}
      <section>
        <p className="text-lg font-semibold">Ref</p>
        <section className="my-4 flex">
          <label className="text-md font-semibold" htmlFor="ref-ts5000">
            TS5000
            <select
              id="ref-ts5000"
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TS5000')}
            >
              <option value="null">null</option>
              {deviceSetting?.action_mapping_table.TS5000 && (
                <option value={deviceSetting?.action_mapping_table.TS5000}>
                  {deviceSetting?.action_mapping_table.TS5000}
                </option>
              )}
            </select>
          </label>
          <label className="text-md pl-4 font-semibold" htmlFor="ref-table_a">
            TABLE_A
            <select
              id="ref-table_a"
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TABLE_A')}
            >
              <option value="null">null</option>
              {deviceSetting?.action_mapping_table.TABLE_A && (
                <option value={deviceSetting?.action_mapping_table.TABLE_A}>
                  {deviceSetting?.action_mapping_table.TABLE_A}
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
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.TABLE_B')}
            >
              <option value="null">null</option>
              {deviceSetting?.action_mapping_table.TABLE_B && (
                <option value={deviceSetting?.action_mapping_table.TABLE_B}>
                  {deviceSetting?.action_mapping_table.TABLE_B}
                </option>
              )}
            </select>
          </label>
          <label className="text-md pl-4 font-semibold" htmlFor="ref-conveyor">
            CONVEYOR
            <select
              id="ref-conveyor"
              className="ml-6 rounded-md border-2 border-gray-80  px-2 text-base font-normal text-black"
              {...register('ref.CONVEYOR')}
            >
              <option value="null">null</option>
              {deviceSetting?.action_mapping_table.CONVEYOR && (
                <option value={deviceSetting?.action_mapping_table.CONVEYOR}>
                  {deviceSetting?.action_mapping_table.CONVEYOR}
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

export default AddDeviceForm;
