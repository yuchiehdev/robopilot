import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import {
  FETCH_CONTROLLER_TS5000_URL,
  FETCH_CONTROLLER_KV8000_A_URL,
  FETCH_CONTROLLER_KV8000_B_URL,
  ACTION_CONTROL,
} from '../data/fetchUrl';
import type { KV8000Type, TS5000Type } from '../types';

type StatusType = {
  [key: string]: string;
};

type InitialControllerState = {
  kv8000AData: {
    [key: string]: KV8000Type;
  };
  kv8000BData: {
    [key: string]: KV8000Type;
  };
  ts5000Data: {
    [key: string]: TS5000Type;
  };
  actionControl: string;
  mainStatus: string;
  dimmAStatus: string;
  dimmBStatus: string;
  calibrationTime: number;
  isImportATrayError: boolean;
  isNgATrayError: boolean;
  isImportBTrayError: boolean;
  isNgBTrayError: boolean;
  fetchTime: string;
  startBtnIsClicked: boolean | undefined;
  btnReturnedMessage: string;
};

// status value and corresponding text
const TS5000_STATUS: StatusType = {
  0: 'Disconnected',
  1: 'Ready',
  2: 'Running',
  3: 'Finish and pass',
  4: 'FINISH and error',
  99: 'Fail',
};

const DIMM_STATUS: StatusType = {
  0: 'Not Ready',
  1: 'Ready',
  2: 'Running',
  3: 'Complete',
  99: 'Fail',
};

export const initialControllerState: InitialControllerState = {
  mainStatus: 'Connecting',
  dimmAStatus: 'Connecting',
  dimmBStatus: 'Connecting',
  actionControl: '',
  calibrationTime: 0,
  isImportATrayError: false,
  isNgATrayError: false,
  isImportBTrayError: false,
  isNgBTrayError: false,
  fetchTime: '',
  startBtnIsClicked: undefined,
  btnReturnedMessage: '',
  ts5000Data: {
    LEFT_RESULT: {
      code: 'string',
      name: 'string',
      value: -1,
      tag: '',
      timestamp: {
        $date: 0,
      },
    },
    RIGHT_RESULT: {
      code: 'string',
      name: 'string',
      value: -1,
      tag: '',
      timestamp: {
        $date: 0,
      },
    },
  },
  kv8000AData: {},
  kv8000BData: {},
};

// Action: fetch Controller data
export const fetchControllerData = createAsyncThunk(
  'controller/getControllerData',
  async (_, thunkAPI) => {
    try {
      const ts5000Res = await fetch(`${FETCH_CONTROLLER_TS5000_URL}`);
      const kv8000ARes = await fetch(`${FETCH_CONTROLLER_KV8000_A_URL}`);
      const kv8000BRes = await fetch(`${FETCH_CONTROLLER_KV8000_B_URL}`);
      const actionControlRes = await fetch(`${ACTION_CONTROL}`);
      const ts5000Data = await ts5000Res.json();
      const kv8000AData = await kv8000ARes.json();
      const kv8000BData = await kv8000BRes.json();
      const actionControl = await actionControlRes.json();
      const data = {
        ts5000Data,
        kv8000AData,
        kv8000BData,
        actionControl,
      };
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const fetchControllerKV8000A = createAsyncThunk(
  'controller/getControllerKV8000A',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_CONTROLLER_KV8000_A_URL}`);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const controllerSlice = createSlice({
  name: 'controller',
  initialState: initialControllerState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchControllerData.fulfilled, (state, action) => {
      state.ts5000Data = action.payload.ts5000Data;
      state.kv8000AData = action.payload.kv8000AData;
      state.kv8000BData = action.payload.kv8000BData;
      state.actionControl = action.payload.actionControl.actionControl;
      state.mainStatus = TS5000_STATUS[state.ts5000Data.STATUS?.value];
      state.dimmAStatus = DIMM_STATUS[state.kv8000AData.TABLE_A_STATUS.value];
      state.dimmBStatus = DIMM_STATUS[state.kv8000BData.TABLE_B_STATUS.value];
      state.calibrationTime = Number(action.payload.ts5000Data.TIME_VIS_CAL?.value);
      state.isImportATrayError = state.kv8000AData.IMPORT_A_TRAY.value === 1;
      state.isNgATrayError = state.kv8000AData.NG_A_TRAY.value === 1;
      state.isImportBTrayError = state.kv8000BData.IMPORT_B_TRAY.value === 1;
      state.isNgBTrayError = state.kv8000BData.NG_B_TRAY.value === 1;
      state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');

      if (
        state.actionControl === 'RUNNING' &&
        state.kv8000AData.PLC_AUTO_READY.value === 1 &&
        state.ts5000Data['Execution status'].value === '1'
      ) {
        state.startBtnIsClicked = true;
      } else {
        state.startBtnIsClicked = false;
      }
    });
  },
});

export const controllerActions = controllerSlice.actions;
export default controllerSlice.reducer;
