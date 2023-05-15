import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import quickSort from '../utils/quickSort';
import type { EventType } from '../types';

type filterTag = {
  perato: string;
  dashboardTable: string;
};

type InitialEvent = {
  displayEvent: EventType[];
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  page: number;
  viewRows: number;
  filterTag: filterTag;
  deviation: number;
  mean: number;
};

export const initialEventQueryState: InitialEvent = {
  displayEvent: [],
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  page: 1,
  viewRows: 10,
  filterTag: {
    perato: '',
    dashboardTable: '',
  },
  deviation: 0,
  mean: 0,
};

const eventSlice = createSlice({
  name: 'event',
  initialState: initialEventQueryState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventType[]>) => {
      state.displayEvent = action.payload;
    },
    filterTag: (state, action: PayloadAction<filterTag>) => {
      state.filterTag = action.payload;
    },
    showErrorMsg: (state, action: PayloadAction<string>) => {
      const targetEvent = state.displayEvent.find((event) => event.id === action.payload);
      if (targetEvent) {
        targetEvent.showMsg = !targetEvent.showMsg;
      }
    },
    sortEvent: (state, action: PayloadAction<string>) => {
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
});

export const eventActions = eventSlice.actions;
export default eventSlice.reducer;
