import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../store/index';
import { userAction } from '../../store/userSlice';
import AUTHORIZATION from '../../data/authorization';
import SystemEvent from './SystemEvent';
import Unauthorized from '../Unauthorized';
import UserEvent from './UserEvent';

const Event = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.user.activeTab);
  const permission = useAppSelector((state) => state.user.permission);

  useEffect(() => {
    dispatch(userAction.setActiveTab({ page: 'event', tab: '1' }));
  }, [dispatch]);

  const currentTab = activeTab.find(
    (tab) => tab.page === location.pathname.slice(1),
  )?.tab;

  switch (currentTab) {
    case '1':
      return <SystemEvent />;

    case '2':
      return AUTHORIZATION.UserEvent.read.has(permission) ? (
        <UserEvent />
      ) : (
        <Unauthorized />
      );

    default:
      return <SystemEvent />;
  }
};

export default Event;
