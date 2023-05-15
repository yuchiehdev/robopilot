import Dashboard from '../pages/Dashboard';
import Dashboardv2 from '../pages/Dashboardv2';
import Dashboardv3 from '../pages/Dashboardv3';
import AuthWrapper from '../components/AuthWrapper';

const wrapWithAuth = (Component: JSX.Element, page: string) => (
  <AuthWrapper page={page}>{Component}</AuthWrapper>
);

type FeatureFlags = {
  [key: string]: boolean;
};

declare const window: {
  featureSelector: { DASHBOARD: string };
  featureFlag: { MONITOR_FEATURE: boolean; LIQUID_FEATURE: boolean };
};
// set default value to avoid undefined error
window.featureSelector = window.featureSelector || { DASHBOARD: 'Dashboardv3' };
window.featureFlag = window.featureFlag || {
  MONITOR_FEATURE: false,
  LIQUID_FEATURE: false,
};

const getDashboardRoute = () => {
  const dashboardType = window.featureSelector.DASHBOARD;
  switch (dashboardType) {
    case 'Dashboard':
      return { path: 'dashboard', element: wrapWithAuth(<Dashboard />, 'Dashboard') };
    case 'Dashboardv2':
      return { path: 'dashboard', element: wrapWithAuth(<Dashboardv2 />, 'Dashboard') };
    case 'Dashboardv3':
      return { path: 'dashboard', element: wrapWithAuth(<Dashboardv3 />, 'Dashboard') };
    default:
      return { path: 'dashboard', element: wrapWithAuth(<Dashboardv3 />, 'Dashboard') };
  }
};

const getComponent = () => {
  const dashboardType = window.featureSelector.DASHBOARD;
  switch (dashboardType) {
    case 'Dashboard':
      return <Dashboard />;
    case 'Dashboardv2':
      return <Dashboardv2 />;
    case 'Dashboardv3':
      return <Dashboardv3 />;
    default:
      return <Dashboardv3 />;
  }
};

const dashboardRoute = getDashboardRoute();
const dashboardComponent = getComponent();

const featureFlags: FeatureFlags = {
  MONITOR_FEATURE: window.featureFlag.MONITOR_FEATURE,
  LIQUID_FEATURE: window.featureFlag.LIQUID_FEATURE,
};

function isFeatureEnabled(featureName: string): boolean {
  return featureFlags[featureName] || false;
}

export { dashboardRoute, dashboardComponent, isFeatureEnabled };
