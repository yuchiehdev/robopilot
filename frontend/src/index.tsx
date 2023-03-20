import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './css/app.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import store from './store';
import AppLayout from './layout/AppLayout';
import Alarm from './pages/Alarm';
import Device from './pages/Device';
import Event from './pages/Event';
import Flow from './pages/Flow';
import Controller from './pages/Controller';
import ErrorPage from './pages/ErrorPage';
import Maintenance from './pages/Maintenance';
import SignIn from './pages/SignIn';
import { dashboardRoute } from './data/featureFlag';
import User from './pages/User';
import QueryTest from './pages/Dashboardv3/QueryTest';

// react router v6.4.3
const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      dashboardRoute,
      { path: 'device', element: <Device /> },
      { path: 'flow', element: <Flow /> },
      { path: 'alarm', element: <Alarm /> },
      { path: 'event', element: <Event /> },
      {
        path: 'controller',
        element: (
          <Suspense fallback="loading...">
            <Controller />
          </Suspense>
        ),
      },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'user', element: <User /> },
      { path: 'querytest', element: <QueryTest /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </Provider>,
);
