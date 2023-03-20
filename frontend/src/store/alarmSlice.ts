import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import quickSort from '../utils/quickSort';
import { FETCH_ALARM_URL, FIX_ALARM } from '../data/fetchUrl';
import type { Alarm } from '../types';

export type SortBy = 'time' | 'name' | 'severity' | 'errorCode';

type InitialAlarmState = {
  alarm: Alarm[];
  alarmCount: number;
  displayAlarm: Alarm[];
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  displayErrorMsg: string[];
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

// Action: fetch Alarm data
export const fetchAlarmData = createAsyncThunk('device/getAlarm', async (_, thunkAPI) => {
  try {
    const response = await fetch(FETCH_ALARM_URL);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err);
  }
});

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
    sortAlarm: (state, action: PayloadAction<SortBy>) => {
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
    filterAlarm: (state, action: PayloadAction<string>) => {
      const filter = action.payload.trim();
      const filteredAlarm = state.alarm.filter((item) => {
        return (
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.severity.includes(filter.toLowerCase()) ||
          item.error_code.toString().includes(filter.toLowerCase()) ||
          dayjs(item.time).format('YYYY/MM/DD HH:mm:ss').includes(filter)
        );
      });
      state.displayAlarm = filteredAlarm;
    },

    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    changeViewRows: (state, action: PayloadAction<number>) => {
      state.viewRows = Number(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAlarmData.fulfilled, (state, action: PayloadAction<Alarm[]>) => {
      const editedAlarm = action.payload.map((alarm) => {
        // eslint-disable-next-line no-underscore-dangle
        const id = alarm._id.$oid;
        const errorCode = alarm.error_code;
        const time = dayjs(alarm.timestamp.$date).format('YYYY/MM/DD HH:mm:ss');
        return { ...alarm, id, errorCode, time, showMsg: false };
      });
      state.alarm = editedAlarm;
      state.alarmCount = editedAlarm.length;

      if (!state.sortStatus.isSorted) {
        state.displayAlarm = state.alarm;
      } else {
        const sortBy = state.sortStatus.orderBy;
        const { isDesc } = state.sortStatus;

        state.displayAlarm = quickSort(state.displayAlarm, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      }

      state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
    });

    builder.addCase(fetchAlarmData.rejected, (state) => {
      state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
    });

    builder.addCase(fixAlarm.fulfilled, (state, action) => {
      const { data, status, id, time } = action.payload;
      state.fixAlarm.status = status;
      state.fixAlarm.message = data.message;
      state.fixAlarm.lastFixId = id;
      state.fixAlarm.lastFixTime = time;
    });
  },
});

export const alarmActions = alarmSlice.actions;
export default alarmSlice.reducer;
