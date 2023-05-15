import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './layout/App';
import Alarm from './pages/Alarm';
import Event from './pages/Event';
import store from './store';
import Assembly from './pages/Assembly';
import Device from './pages/Device';
import ErrorPage from './pages/ErrorPage';
import Maintenance from './pages/Maintenance';
import SignIn from './pages/SignIn';
import { dashboardRoute } from './data/featureFlag';
import User from './pages/User';
import LevelIllustration from './pages/User/LevelIllustration';
import AuthWrapper from './components/AuthWrapper';
import Unauthorized from './pages/Unauthorized';
import Status from './pages/Status';

const wrapWithAuth = (Component: JSX.Element, page: string, guestOnly?: boolean) => (
  <AuthWrapper page={page} guestOnly={guestOnly}>
    {Component}
  </AuthWrapper>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      dashboardRoute,
      { path: 'device', element: wrapWithAuth(<Device />, 'Device') },
      { path: 'alarm', element: wrapWithAuth(<Alarm />, 'Alarm') },
      { path: 'event', element: wrapWithAuth(<Event />, 'Event') },
      { path: 'maintenance', element: wrapWithAuth(<Maintenance />, 'Maintenance') },
      {
        path: 'assembly',
        element: wrapWithAuth(<Assembly />, 'Assembly'),
      },
      {
        path: 'user',
        element: wrapWithAuth(<User />, 'User'),
      },
      {
        path: 'levelIllustration',
        element: wrapWithAuth(<LevelIllustration />, 'LevelIllustration'),
      },
      { path: 'signin', element: wrapWithAuth(<SignIn />, 'SignIn', true) },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
      {
        path: 'status',
        element: wrapWithAuth(<Status />, 'Status'),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </Provider>,
);
