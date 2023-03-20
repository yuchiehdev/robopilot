import Dashboard from '../pages/Dashboard';
import Dashboardv2 from '../pages/Dashboardv2';
import Dashboardv3 from '../pages/Dashboardv3';
/* eslint-disable import/no-mutable-exports */
type FeatureFlags = {
  [key: string]: boolean;
};

declare const window: {
  featureSelector: { DASHBOARD: string };
  featureFlag: { MONITOR_FEATURE: boolean; LIQUID_FEATURE: boolean };
};
// set default value to avoid undefined error
window.featureSelector = window.featureSelector || { DASHBOARD: '' };
window.featureFlag = window.featureFlag || {
  MONITOR_FEATURE: false,
  LIQUID_FEATURE: false,
};

let dashboardRoute = {};
let component = <Dashboardv3 />;
switch (window.featureSelector.DASHBOARD) {
  case 'Dashboard':
    dashboardRoute = { path: 'dashboard', element: <Dashboard /> };
    break;
  case 'Dashboardv2':
    dashboardRoute = { path: 'dashboard', element: <Dashboardv2 /> };
    break;
  case 'Dashboardv3':
    dashboardRoute = { path: 'dashboard', element: <Dashboardv3 /> };
    component = <Dashboardv3 />;
    break;
  default:
    dashboardRoute = { path: 'dashboard', element: <Dashboardv3 /> };
}

const featureFlags: FeatureFlags = {
  MONITOR_FEATURE: window.featureFlag.MONITOR_FEATURE,
  LIQUID_FEATURE: window.featureFlag.LIQUID_FEATURE,
};

function isFeatureEnabled(featureName: string): boolean {
  return featureFlags[featureName] || false;
}

export { dashboardRoute, component, isFeatureEnabled };
