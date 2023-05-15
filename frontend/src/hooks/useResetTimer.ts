import { useAppDispatch } from '../store';
import { userAction } from '../store/userSlice';

export const useResetTimer = (
  timer: React.MutableRefObject<NodeJS.Timeout | null>,
  intervalDuration: number,
) => {
  const dispatch = useAppDispatch();

  const resetTimer = () => {
    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      dispatch(userAction.setSignInStatus(false));
      localStorage.removeItem('JWToken');
      localStorage.removeItem('RefreshToken');
    }, intervalDuration);
  };

  return resetTimer;
};
