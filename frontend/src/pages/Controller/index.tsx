import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/index';
import { userAction } from '../../store/userSlice';
import Scara from './Scara';
import Vision from './Vision';
import AUTHORIZATION from '../../data/authorization';
import Unauthorized from '../Unauthorized';

const Controller = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.user.activeTab);
  const permission = useAppSelector((state) => state.user.permission);

  useEffect(() => {
    dispatch(userAction.setActiveTab({ page: 'controller', tab: '1' }));
  }, [dispatch]);

  const currentTab = activeTab.find(
    (tab) => tab.page === location.pathname.slice(1),
  )?.tab;
  switch (currentTab) {
    case '1':
      return <Scara />;
    case '2':
      return AUTHORIZATION.Vision.read.has(permission) ? <Vision /> : <Unauthorized />;
    default:
      return <Scara />;
  }
};

export default Controller;
