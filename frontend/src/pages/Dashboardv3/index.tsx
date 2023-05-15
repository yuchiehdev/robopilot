import Troubleshooting from './Troubleshooting';
import { useAppSelector } from '../../store/index';
import Measurements from './Measurements';

const Dashbaordv3 = () => {
  const activeTab = useAppSelector((state) => state.dashboard.activeTab);
  switch (activeTab) {
    case '1':
      return <Troubleshooting />;
    case '2':
      return <Measurements />;
    default:
      return <Troubleshooting />;
  }
};

export default Dashbaordv3;
