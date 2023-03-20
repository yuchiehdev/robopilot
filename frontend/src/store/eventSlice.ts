import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { FETCH_EVENT_URL } from '../data/fetchUrl';
import quickSort from '../utils/quickSort';
import type { EventType } from '../types';

export type SortBy =
  | 'time'
  | 'deactivatedTime'
  | 'name'
  | 'severity'
  | 'errorCode'
  | 'activation';

type filterTag = {
  perato: string;
  dashboardTable: string;
};

type InitialEventState = {
  event: EventType[];
  hasEvent: boolean;
  displayEvent: EventType[];
  displayEventByTime: EventType[];
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  fetchTime: string;
  page: number;
  viewRows: number;
  filterTag: filterTag;
  deviation: number;
  mean: number;
};
type timeType = {
  gte: number;
  lte: number;
};

export const initialEventState: InitialEventState = {
  event: [],
  hasEvent: false,
  displayEvent: [],
  displayEventByTime: [],
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  fetchTime: '',
  page: 1,
  viewRows: 10,
  filterTag: {
    perato: '',
    dashboardTable: '',
  },
  deviation: 0,
  mean: 0,
};

// Action: fetch event data
export const fetchEventData = createAsyncThunk('device/getEvent', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${FETCH_EVENT_URL}`);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const fetchEventDataByTime = createAsyncThunk(
  'device/getEventByTime',
  async (time: timeType, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_EVENT_URL}&gte=${time.gte}&lte=${time.lte}`);
      console.log('fetchEventDataByTime', response);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const eventSlice = createSlice({
  name: 'event',
  initialState: initialEventState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventType[]>) => {
      state.displayEvent = state.event;
    },
    showErrorMsg: (state, action: PayloadAction<string>) => {
      const targetEvent = state.displayEvent.find((event) => event.id === action.payload);
      if (targetEvent) {
        targetEvent.showMsg = !targetEvent.showMsg;
      }
      console.log('showErrorMsg', targetEvent);
    },
    sortEvent: (state, action: PayloadAction<SortBy>) => {
      const sortBy = action.payload;

      if (state.sortStatus.orderBy === sortBy) {
        const { isDesc } = state.sortStatus;
        state.displayEvent = quickSort(state.displayEvent, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      } else {
        state.displayEvent = quickSort(state.displayEvent, sortBy);
        state.sortStatus.orderBy = sortBy;
        state.sortStatus.isSorted = true;
        state.sortStatus.isDesc = true;
      }
    },
    filterTag: (state, action: PayloadAction<filterTag>) => {
      state.filterTag = action.payload;
    },
    filterEvent: (state, action: PayloadAction<string>) => {
      const filter = action.payload.trim();
      const filteredEvent = state.event.filter((item) => {
        return (
          item.name.toLowerCase().includes(filter.toLowerCase()) ||
          item.severity.includes(filter.toLowerCase()) ||
          item.errorCode.toString().includes(filter.toLowerCase()) ||
          item.activation.toString().includes(filter.toLowerCase()) ||
          dayjs(item.time).format('YYYY/MM/DD HH:mm:ss').includes(filter) ||
          dayjs(item.deactivatedTime).format('YYYY/MM/DD HH:mm:ss').includes(filter)
        );
      });
      state.displayEvent = filteredEvent;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    changeViewRows: (state, action: PayloadAction<number>) => {
      state.viewRows = Number(action.payload);
    },
    deviation: (state, action: PayloadAction<number>) => {
      state.deviation = action.payload;
    },
    mean: (state, action: PayloadAction<number>) => {
      state.mean = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEventData.fulfilled, (state, action: PayloadAction<EventType[]>) => {
        if (action.payload.length === 0) {
          state.hasEvent = false;
        } else {
          const editedEvent = action.payload.map((event) => {
            // eslint-disable-next-line no-underscore-dangle
            const id = event._id.$oid;
            const errorCode = event.error_code;
            const time = event.timestamp.$date;
            let deactivatedTime;

            if (event.deactivate_timestamp) {
              deactivatedTime = dayjs(new Date(event.deactivate_timestamp.$date))
                .format('YYYY/MM/DD HH:mm:ss')
                .toString();
            } else {
              deactivatedTime = '';
            }

            return { ...event, id, errorCode, time, deactivatedTime, showMsg: false };
          });

          state.hasEvent = true;
          state.event = editedEvent;
          state.displayEvent = state.event;
          state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
        }
      })

      .addCase(fetchEventData.rejected, (state) => {
        state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
      })
      .addCase(
        fetchEventDataByTime.fulfilled,
        (state, action: PayloadAction<EventType[]>) => {
          if (!Array.isArray(action.payload)) {
            throw new Error('action.payload不是數組');
          }
          if (action.payload.length === 0) {
            state.hasEvent = false;
            state.displayEventByTime = [];
          } else {
            const editedEvent = action.payload.map((event) => {
              // eslint-disable-next-line no-underscore-dangle
              const id = event._id.$oid;
              const errorCode = event.error_code;
              const time = event.timestamp.$date;
              let deactivatedTime;

              if (event.deactivate_timestamp) {
                // deactivatedTime = dayjs(new Date(event.deactivate_timestamp.$date))
                //   .format('YYYY/MM/DD HH:mm:ss')
                //   .toString();
                deactivatedTime = event.deactivate_timestamp.$date;
              } else {
                deactivatedTime = '';
              }

              return { ...event, id, errorCode, time, deactivatedTime, showMsg: false };
            });

            state.hasEvent = true;
            state.event = editedEvent;
            state.displayEventByTime = state.event;
          }
        },
      );
  },
});

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;
