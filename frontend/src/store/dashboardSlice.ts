import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type InitialDashboard = {
  startDateTime: {
    date: string;
    time: string;
  };
  endDateTime: {
    date: string;
    time: string;
  };
  activeTab: string;
};

export const initialDashboardState: InitialDashboard = {
  startDateTime: {
    date: '2023-01-01',
    time: '12:00 AM',
  },
  endDateTime: {
    date: '2023-01-01',
    time: '11:59 PM',
  },
  activeTab: '1',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {
    setStartDateTime: (state, action) => {
      state.startDateTime = action.payload;
    },
    setEndDateTime: (state, action) => {
      state.endDateTime = action.payload;
    },
    handleTabChange: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setStartDateTime, setEndDateTime, handleTabChange } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
