import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
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
      console.log('action.payload', action.payload);
      state.displayEvent = action.payload;
    },
    //   const currentShowMsg: string[] = [];
    //   if (state.displayEvent.length !== 0) {
    //     state.displayEvent?.forEach((item) => {
    //       if (item.showMsg === true) {
    //         currentShowMsg.push(item.id);
    //       }
    //     });
    //   }
    //   // console.log('currentShowMsg', currentShowMsg);
    //   // const currentShowMsg = state.displayEvent[0]?.showMsg;
    //   // console.log('currentShowMsg', currentShowMsg);
    //   const editedEvent = action.payload.map((event) => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     const id = event._id.$oid;
    //     const errorCode = event.error_code;
    //     const time = event.timestamp.$date;
    //     let deactivatedTime;

    //     if (event.deactivate_timestamp) {
    //       deactivatedTime = dayjs(new Date(event.deactivate_timestamp.$date))
    //         .format('YYYY/MM/DD HH:mm:ss')
    //         .toString();
    //     } else {
    //       deactivatedTime = '';
    //     }
    //     const showMsg = !!currentShowMsg.includes(id);
    //     // const filteredData = state.filter((item) => item.showMsg === true);
    //     // const arraySetShowMsg = (items: EventType[]) => {
    //     //   return items.map((item: any) => {
    //     //     filteredData.forEach((filteredItem) => {
    //     //       if (item.id === filteredItem.id) {
    //     //         item.showMsg = true;
    //     //       }
    //     //     });
    //     //     return item;
    //     //   });
    //     // };
    //     // const ediableData = [...data];
    //     // console.log(arraySetShowMsg(ediableData));

    //     return { ...event, id, errorCode, time, deactivatedTime, showMsg };
    //   });

    //   state.event = editedEvent;
    //   state.displayEvent = state.event;
    //   // console.log('setEvent', state.displayEvent);
    // },
    filterTag: (state, action: PayloadAction<filterTag>) => {
      state.filterTag = action.payload;
    },
    showErrorMsg: (state, action: PayloadAction<string>) => {
      console.log('action.payload', action.payload);
      const targetEvent = state.displayEvent.find((event) => event.id === action.payload);
      if (targetEvent) {
        targetEvent.showMsg = !targetEvent.showMsg;
      }
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
