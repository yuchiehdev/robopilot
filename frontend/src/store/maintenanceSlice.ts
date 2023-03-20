import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import quickSort from '../utils/quickSort';
import { FETCH_MAINTENANCE, FIX_ALARM, PREFIX_MAINTENANCE } from '../data/fetchUrl';
import type { MaintenanceType } from '../types';

export type SortBy = 'inspectionPoint' | 'cycle' | 'lastCheck';

type InitialMaintenanceState = {
  maintenance: MaintenanceType[];
  maintenanceCount: number;
  displayMaintenance: MaintenanceType[];
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
  displayMaintenance: [],
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

// Action: fetch Maintenance data
export const fetchMaintenanceData = createAsyncThunk(
  'maintenance/getMaintenanceData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_MAINTENANCE}`);
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

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
    showDescription: (state, action: PayloadAction<string>) => {
      const targetMaintenance = state.maintenance.find(
        (item) => item.id === action.payload,
      );
      if (targetMaintenance) {
        targetMaintenance.showDescription = !targetMaintenance.showDescription;
      }
    },

    sortData: (state, action: PayloadAction<SortBy>) => {
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
          item.InspectionPoint.toLowerCase().includes(filter.toLowerCase()) ||
          item.Cycle.toString().includes(filter.toLowerCase()) ||
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
          item.InspectionPoint.toLowerCase().includes(filter.toLowerCase()) &&
          item.active === true
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
    builder.addCase(
      fetchMaintenanceData.fulfilled,
      (state, action: PayloadAction<MaintenanceType[]>) => {
        const editedData = action.payload.map((item) => {
          // eslint-disable-next-line no-underscore-dangle
          const id = item._id.$oid;
          const isActive: 1 | 0 = item.active ? 1 : 0;
          const timeStamp = item.LastCheck.$date;
          const time = dayjs(item.LastCheck.$date).format('YYYY/MM/DD HH:mm:ss');
          return {
            ...item,
            InspectionPoint: item.InspectionPoint.replaceAll('_', ' '),
            id,
            time,
            timeStamp,
            showDescription: false,
            isActive,
          };
        });
        state.maintenance = editedData;
        state.maintenanceCount = editedData.length;
        state.displayMaintenance = state.maintenance.sort(
          (a, b) => b.isActive - a.isActive,
        );
        state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm');
      },
    );

    builder.addCase(fetchMaintenanceData.rejected, (state, action) => {
      state.fetchTime = dayjs().format('YYYY/MM/DD HH:mm:ss');
    });

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
