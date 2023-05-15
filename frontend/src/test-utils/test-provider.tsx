import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';

import { setupStore } from '../store';
import { initialAlarmState } from '../store/alarmSlice';
import { initialUserState } from '../store/userSlice';
import { initialControllerState } from '../store/controllerSlice';
import { initialDeviceState } from '../store/deviceSlice';
import { initialEventQueryState } from '../store/eventSlice';
import { initialSensorState } from '../store/sensorSlice';
import { initialMaintenanceState } from '../store/maintenanceSlice';
import { initialDashboardState } from '../store/dashboardSlice';
import type { RootState, AppStore } from '../store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      user: initialUserState,
      alarm: initialAlarmState,
      controller: initialControllerState,
      device: initialDeviceState,
      eventQuery: initialEventQueryState,
      sensor: initialSensorState,
      maintenance: initialMaintenanceState,
      dashboard: initialDashboardState,
    },
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const Wrapper = ({
    children,
  }: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
