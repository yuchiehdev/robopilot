import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RESOURCE } from '../data/fetchUrl';
import type { Sensor } from '../types';

type InitialSensor = {
  sensor: Sensor[];
};

export const initialSensorState: InitialSensor = {
  sensor: [],
};

export const fetchSensorData = createAsyncThunk(
  'sensor/fetchSensorData',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(RESOURCE);
      const data = await response.json();
      return data as Sensor[];
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const sensorSlice = createSlice({
  name: 'sensor',
  initialState: initialSensorState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchSensorData.fulfilled, (state, action) => {
      state.sensor = action.payload;
    });
  },
});

export default sensorSlice.reducer;
