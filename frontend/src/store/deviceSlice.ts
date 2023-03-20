/* eslint-disable no-restricted-syntax */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import {
  FETCH_DEVICE_URL,
  FETCH_DEVICE_STATUS_URL,
  DEVICE_SETTING_URL,
  DELETE_DEVICE_URL,
} from '../data/fetchUrl';
import quickSort from '../utils/quickSort';
import type { DeviceTypes, DeviceStatusTypes } from '../types';

export type SortBy =
  | 'name'
  | 'type'
  | 'status'
  | 'connector'
  | 'receiverIp'
  | 'receiverPort'
  | 'controllerIp'
  | 'controllerPort';

type InitialDeviceState = {
  device: DeviceTypes[];
  status: DeviceStatusTypes[];
  displayDevice: DeviceTypes[];
  fetchTime: string;
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  page: number;
  viewRows: number;
  setting?: {
    controller: string[];
    sensor: string[];
    action_mapping_table: {
      [key: string]: string;
    };
    conn_table: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string]: {
        module: string;
        path: string;
        type: string;
        action?: string[];
        subdevice?: string[];
        controller?: {
          ip: string | number;
          port: string | number;
        };
        receiver?: {
          ip: string | number;
          port: string | number;
        };
      };
    };
  };
};

export const initialDeviceState: InitialDeviceState = {
  device: [],
  status: [],
  displayDevice: [],
  fetchTime: '',
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  page: 1,
  viewRows: 10,
};

// Action: GET event data
export const fetchDeviceData = createAsyncThunk(
  'device/getDeviceData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_DEVICE_URL}`);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: GET statue data
export const fetchDeviceStatusData = createAsyncThunk(
  'device/getDeviceStatusData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_DEVICE_STATUS_URL}`);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: GET setting data for add device
export const fetchDeviceSetting = createAsyncThunk(
  'device/getDeviceSetting',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${DEVICE_SETTING_URL}`);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: PUT add device
export const postAddDevice = createAsyncThunk(
  'device/postAddDevice',
  async (input: any, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_DEVICE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: DELETE device
export const deleteDevice = createAsyncThunk(
  'device/deleteDevice',
  async (input: string, thunkAPI) => {
    try {
      const response = await fetch(`${DELETE_DEVICE_URL}${input}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: UPDATE(PUT) device
export const updateDevice = createAsyncThunk(
  'device/updateDevice',
  async (input: any, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_DEVICE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const deviceSlice = createSlice({
  name: 'device',
  initialState: initialDeviceState,
  reducers: {
    sortDevice: (state, action: PayloadAction<SortBy>) => {
      const sortBy = action.payload;

      state.device = state.device.map((item) => {
        const status = state.status.find((statusItem) => statusItem.device === item.name);
        return { ...item, status: status?.status };
      });

      if (state.sortStatus.orderBy === sortBy) {
        const { isDesc } = state.sortStatus;
        state.displayDevice = quickSort(state.device, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      } else {
        state.displayDevice = quickSort(state.device, sortBy);
        state.sortStatus.orderBy = sortBy;
        state.sortStatus.isSorted = true;
        state.sortStatus.isDesc = true;
      }
    },

    filterDevice: (state, action: PayloadAction<string>) => {
      const filter = action.payload.trim();
      const filteredDevice = state.device.filter((item) => {
        return (
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.status?.includes(filter.toLowerCase()) ||
          item.type.toString().includes(filter.toLowerCase()) ||
          item.connector.toString().includes(filter.toLowerCase()) ||
          item.receiver.ip.toString().includes(filter.toLowerCase()) ||
          item.receiver.port.toString().includes(filter.toLowerCase()) ||
          item.controller?.ip.toString().includes(filter.toLowerCase()) ||
          item.controller?.port.toString().includes(filter.toLowerCase())
        );
      });
      state.displayDevice = filteredDevice;
    },

    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    changeViewRows: (state, action: PayloadAction<number>) => {
      state.viewRows = Number(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDeviceData.fulfilled,
        (state, action: PayloadAction<DeviceTypes[]>) => {
          state.device = action.payload.map((d) => {
            return {
              ...d,
              receiverIp: d.receiver.ip.replaceAll('.', ''),
              receiverPort: d.receiver.port,
              controllerIp: d.controller?.ip.replaceAll('.', '') || null,
              controllerPort: d.controller?.port || null,
            };
          });

          if (!state.sortStatus.isSorted) {
            state.displayDevice = state.device;
          } else {
            const sortBy = state.sortStatus.orderBy;
            const { isDesc } = state.sortStatus;

            state.device = state.device.map((item) => {
              const status = state.status.find(
                (statusItem) => statusItem.device === item.name,
              );
              return { ...item, status: status?.status };
            });

            state.displayDevice = quickSort(state.device, sortBy, isDesc);
            state.sortStatus.isDesc = isDesc;
          }
          state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
        },
      )

      .addCase(fetchDeviceData.rejected, (state) => {
        state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
      })

      .addCase(
        fetchDeviceStatusData.fulfilled,
        (state, action: PayloadAction<DeviceStatusTypes[]>) => {
          state.status = action.payload;
        },
      )

      .addCase(fetchDeviceSetting.fulfilled, (state, action: PayloadAction<any>) => {
        const connectors = Object.keys(action.payload.conn_table);
        const controllers: string[] = [];
        const sensors: string[] = [];

        for (const item of connectors) {
          if (action.payload.conn_table[item].type === 'controller') {
            controllers.push(item);
          } else if (action.payload.conn_table[item].type === 'sensor') {
            sensors.push(item);
          }
        }
        state.setting = {
          controller: controllers,
          sensor: sensors,
          action_mapping_table: action.payload.action_mapping_table,
          conn_table: action.payload.conn_table,
        };
      })

      .addCase(postAddDevice.fulfilled, (state, action: PayloadAction<any>) => {
        state.device = action.payload.device.map((d: any) => {
          return {
            ...d,
            receiverIp: d.receiver.ip.replaceAll('.', ''),
            receiverPort: d.receiver.port,
            controllerIp: d.controller?.ip.replaceAll('.', '') || null,
            controllerPort: d.controller?.port || null,
          };
        });
        state.displayDevice = state.device;
      })

      .addCase(postAddDevice.rejected, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      })

      .addCase(deleteDevice.fulfilled, (state, action: PayloadAction<any>) => {
        state.device = action.payload.device.map((d: any) => {
          return {
            ...d,
            receiverIp: d.receiver.ip.replaceAll('.', ''),
            receiverPort: d.receiver.port,
            controllerIp: d.controller?.ip.replaceAll('.', '') || null,
            controllerPort: d.controller?.port || null,
          };
        });
        state.displayDevice = state.device;
      })

      .addCase(updateDevice.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      });
  },
});

export const deviceActions = deviceSlice.actions;
export default deviceSlice.reducer;
