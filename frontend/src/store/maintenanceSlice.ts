import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import quickSort from '../utils/quickSort';
import {
  FIX_ALARM,
  PREFIX_MAINTENANCE,
  FETCH_ACTIVE_MAINTENANCE_URL,
} from '../data/fetchUrl';
import type { MaintenanceType } from '../types';

type InitialMaintenanceState = {
  maintenance: MaintenanceType[];
  maintenanceCount: number;
  activeMaintenanceCount: number;
  displayMaintenance: MaintenanceType[];
  displayDescription: string[];
  sortStatus: {
    isSorted: boolean;
    orderBy: string;
    isDesc: boolean;
  };
  filterKeyword: string;
  page: number;
  viewRows: number;
  checkMaintenance: {
    lastFix: string;
    status: number | undefined;
    message: string;
  };
  fetchTime: string;
};

export const initialMaintenanceState: InitialMaintenanceState = {
  maintenance: [],
  maintenanceCount: 0,
  activeMaintenanceCount: 0,
  displayMaintenance: [],
  displayDescription: [],
  sortStatus: {
    isSorted: false,
    orderBy: '',
    isDesc: false,
  },
  filterKeyword: '',
  page: 1,
  viewRows: 10,
  checkMaintenance: {
    lastFix: '',
    status: undefined,
    message: '',
  },
  fetchTime: '',
};

// Action: check active maintenance
export const checkActiveItem = createAsyncThunk(
  'maintenance/checkActiveItem',
  async (deviceName: string, thunkAPI) => {
    try {
      const name = deviceName.replaceAll(' ', '_');
      const response = await fetch(FIX_ALARM, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('JWToken') || '',
        },
        body: JSON.stringify({
          err_code: 1000,
          device_name: name,
        }),
      });
      const data = await response.json();
      return {
        data,
        status: response.status,
        fixedItem: name,
      };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: check inactive maintenance
export const checkInactiveItem = createAsyncThunk(
  'maintenance/checkInactiveItem',
  async (deviceName: string, thunkAPI) => {
    try {
      const name = deviceName.replaceAll(' ', '_');
      const response = await fetch(`${PREFIX_MAINTENANCE}${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('JWToken') || '',
        },
      });
      const data = await response.json();
      return { data, status: response.status, fixedItem: name };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: initialMaintenanceState,
  reducers: {
    setMaintenances: (state, action: PayloadAction<MaintenanceType[]>) => {
      state.displayMaintenance = action.payload.sort((a, b) => b.isActive - a.isActive);
    },

    showDescription: (state, action: PayloadAction<string>) => {
      const targetMaintenance = state.displayMaintenance.find(
        (maintenance) => maintenance.id === action.payload,
      );
      if (targetMaintenance) {
        targetMaintenance.showDescription = !targetMaintenance.showDescription;
      }

      if (state.displayDescription.includes(action.payload)) {
        state.displayDescription = state.displayDescription.filter(
          (msg) => msg !== action.payload,
        );
      } else {
        state.displayDescription.push(action.payload);
      }
    },

    sortData: (state, action: PayloadAction<string>) => {
      const sortBy = action.payload;
      if (state.sortStatus.orderBy === sortBy) {
        const { isDesc } = state.sortStatus;
        state.displayMaintenance = quickSort(state.displayMaintenance, sortBy, !isDesc);
        state.sortStatus.isDesc = !isDesc;
      } else {
        state.displayMaintenance = quickSort(state.displayMaintenance, sortBy);
        state.sortStatus.orderBy = sortBy;
        state.sortStatus.isSorted = true;
        state.sortStatus.isDesc = true;
      }
    },

    filterMaintenance: (state, action: PayloadAction<string>) => {
      const filter = action.payload.trim();
      const filteredData = state.maintenance.filter((item) => {
        return (
          item.Item.toLowerCase().includes(filter.toLowerCase()) ||
          item.Duration.toString().includes(filter.toLowerCase()) ||
          item.Description.toString().includes(filter.toLowerCase()) ||
          dayjs(item.timeStamp).format('YYYY/MM/DD HH:mm:ss').includes(filter)
        );
      });
      state.displayMaintenance = filteredData;
    },

    directFromAlarm: (state, action: PayloadAction<string>) => {
      const filter = action.payload.trim();
      const filteredData = state.maintenance.filter((item) => {
        return (
          item.Item.toLowerCase().includes(filter.toLowerCase()) && item.active === true
        );
      });
      state.displayMaintenance = filteredData;
    },

    setFilterKeyword: (state, action: PayloadAction<string>) => {
      state.filterKeyword = action.payload.replaceAll('_', ' ');
    },

    clearFilterKeyword: (state) => {
      state.filterKeyword = '';
    },

    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    changeViewRows: (state, action: PayloadAction<number>) => {
      state.viewRows = Number(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(checkActiveItem.fulfilled, (state, action) => {
      const { data, status, fixedItem } = action.payload;
      state.checkMaintenance.status = status;
      state.checkMaintenance.message = data.message;
      state.checkMaintenance.lastFix = fixedItem;
    });

    builder.addCase(checkInactiveItem.fulfilled, (state, action) => {
      const { data, status, fixedItem } = action.payload;
      state.checkMaintenance.status = status;
      state.checkMaintenance.message = data.message;
      state.checkMaintenance.lastFix = fixedItem;
    });
  },
});

export const maintenanceActions = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
