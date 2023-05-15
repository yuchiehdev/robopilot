import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import quickSort from '../utils/quickSort';
import { FIX_ALARM } from '../data/fetchUrl';
import type { AlarmType } from '../types';

type InitialAlarmState = {
  alarm: AlarmType[];
  alarmCount: number;
  displayAlarm: AlarmType[];
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  displayErrorMsg: string[];
  filterTag: string;
  fetchTime: string;
  page: number;
  viewRows: number;
  fixAlarm: {
    lastFixId: string;
    status: number | undefined;
    message: string;
    lastFixTime: string;
  };
};

export const initialAlarmState: InitialAlarmState = {
  alarm: [],
  alarmCount: 0,
  displayAlarm: [],
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  displayErrorMsg: [],
  filterTag: '',
  fetchTime: '',
  page: 1,
  viewRows: 10,
  fixAlarm: {
    status: undefined,
    message: '',
    lastFixId: '',
    lastFixTime: '',
  },
};

// Action: PATCH fix alarm
export const fixAlarm = createAsyncThunk(
  'device/fixAlarm',
  async (payload: { errorCode: number; device: string; id: string }, thunkAPI) => {
    const { errorCode, device, id } = payload;
    try {
      const response = await fetch(`${FIX_ALARM}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('JWToken') || '',
        },
        body: JSON.stringify({ err_code: errorCode, device_name: device }),
      });
      const data = await response.json();
      const time = dayjs().format('YYYY/MM/DD HH:mm:ss');
      return { data, status: response.status, id, time };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const alarmSlice = createSlice({
  name: 'alarm',
  initialState: initialAlarmState,
  reducers: {
    setAlarms: (state, action: PayloadAction<AlarmType[]>) => {
      state.displayAlarm = action.payload;
    },

    setFilterTag: (state, action: PayloadAction<string>) => {
      state.filterTag = action.payload;
    },

    showErrorMsg: (state, action: PayloadAction<string>) => {
      const targetAlarm = state.displayAlarm.find((alarm) => alarm.id === action.payload);
      if (targetAlarm) {
        targetAlarm.showMsg = !targetAlarm.showMsg;
      }

      if (state.displayErrorMsg.includes(action.payload)) {
        state.displayErrorMsg = state.displayErrorMsg.filter(
          (msg) => msg !== action.payload,
        );
      } else {
        state.displayErrorMsg.push(action.payload);
      }
    },

    sortAlarm: (state, action: PayloadAction<string>) => {
      const sortBy = action.payload;
      if (state.sortStatus.orderBy === sortBy) {
        const { isDesc } = state.sortStatus;
        state.displayAlarm = quickSort(state.displayAlarm, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      } else {
        state.displayAlarm = quickSort(state.displayAlarm, sortBy);
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
    builder.addCase(fixAlarm.fulfilled, (state, action) => {
      const { data, status, id, time } = action.payload;
      state.fixAlarm.status = status;
      state.fixAlarm.message = data.message;
      state.fixAlarm.lastFixId = id;
      state.fixAlarm.lastFixTime = time;
    });
  },
});

export const alarmAction = alarmSlice.actions;
export default alarmSlice.reducer;
