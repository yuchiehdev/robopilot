import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { configureStore, PreloadedState, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import eventReducerQuery from './eventQuerySlice';
import sensorReducer from './sensorSlice';
import deviceReducer from './deviceSlice';
import alarmReducer from './alarmSlice';
import controllerReducer from './controllerSlice';
import flowReducer from './flowSlice';
import maintenanceReducer from './maintenanceSlice';
import dashboardReducer from './dashboardSlice';

const store = configureStore({
  reducer: {
    alarm: alarmReducer,
    controller: controllerReducer,
    device: deviceReducer,
    eventQuery: eventReducerQuery,
    sensor: sensorReducer,
    user: userReducer,
    flow: flowReducer,
    maintenance: maintenanceReducer,
    dashboard: dashboardReducer,
  },
});

const rootReducer = combineReducers({
  user: userReducer,
  alarm: alarmReducer,
  controller: controllerReducer,
  device: deviceReducer,
  eventQuery: eventReducerQuery,
  sensor: sensorReducer,
  maintenance: maintenanceReducer,
  dashboard: dashboardReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
