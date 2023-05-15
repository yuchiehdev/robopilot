/* eslint-disable no-restricted-syntax */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  FETCH_DEVICE_URL,
  DEVICE_SETTING_URL,
  DELETE_DEVICE_URL,
} from '../data/fetchUrl';
import quickSort from '../utils/quickSort';
import type { DeviceType, DeviceStatusType } from '../types';

type FilterTagType = {
  perato: string;
  dashboardTable: string;
};

type InitialDeviceState = {
  device: DeviceType[];
  status: DeviceStatusType[];
  displayDevice: DeviceType[];
  fetchTime: string;
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  filterTag: FilterTagType;
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
  filterTag: {
    perato: '',
    dashboardTable: '',
  },
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  page: 1,
  viewRows: 10,
};
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
          token: localStorage.getItem('JWToken') || '',
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
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('JWToken') || '',
        },
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: UPDATE (PUT) device
export const updateDevice = createAsyncThunk(
  'device/updateDevice',
  async (input: any, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_DEVICE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('JWToken') || '',
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
    setDevice: (state, action: PayloadAction<DeviceType[]>) => {
      state.displayDevice = action.payload;
    },

    setStatus: (state, action: PayloadAction<DeviceStatusType[]>) => {
      state.status = action.payload;
    },

    filterTag: (state, action: PayloadAction<FilterTagType>) => {
      state.filterTag = action.payload;
    },

    sortDevice: (state, action: PayloadAction<string>) => {
      const sortBy = action.payload;
      if (state.sortStatus.orderBy === sortBy) {
        const { isDesc } = state.sortStatus;
        state.displayDevice = quickSort(state.displayDevice, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      } else {
        state.displayDevice = quickSort(state.displayDevice, sortBy);
        state.sortStatus.orderBy = sortBy;
        state.sortStatus.isSorted = true;
        state.sortStatus.isDesc = true;
      }
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

      .addCase(postAddDevice.rejected, (_, action: PayloadAction<any>) => {
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

      .addCase(updateDevice.fulfilled, (_, action: PayloadAction<any>) => {
        console.log(action.payload);
      });
  },
});

export const deviceActions = deviceSlice.actions;
export default deviceSlice.reducer;
