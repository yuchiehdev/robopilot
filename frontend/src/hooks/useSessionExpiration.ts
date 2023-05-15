import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SESSION_EXPIRATION } from '../data/constant';
import { useSecureStorage } from './useSecureStorage';

const EXPIRATION_KEY = 'SessionExpiration';
const TOKEN_KEY = 'JWToken';
const refreshTokenExpireDuration = SESSION_EXPIRATION;

export const useSessionExpiration = (
  onTokenRemoved: () => void,
  resetDuration = refreshTokenExpireDuration,
  initialize = false,
) => {
  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { storeData, retrieveData } = useSecureStorage();

  const logLogoutDetails = (storedTimestamp: string, remainingTime: number) => {
    console.warn(
      `User logged out due to inactivity. ${remainingTime} | ${storedTimestamp}`,
    );
  };

  const resetTimer = async () => {
    if (timer.current) clearInterval(timer.current);

    const expirationTime = Date.now() + resetDuration;
    await storeData(EXPIRATION_KEY, expirationTime.toString());

    timer.current = setTimeout(async () => {
      const storedExpiration = await retrieveData(EXPIRATION_KEY);
      if (storedExpiration) {
        const remainingTime = parseInt(storedExpiration, 10) - Date.now();
        logLogoutDetails(storedExpiration, remainingTime);
      }

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('RefreshToken');
      localStorage.removeItem(EXPIRATION_KEY);
      onTokenRemoved();
      navigate('/signin');
    }, resetDuration);
  };

  useEffect(() => {
    const checkStoredExpiration = async () => {
      const storedExpiration = await retrieveData(EXPIRATION_KEY);
      if (storedExpiration) {
        const remainingTime = parseInt(storedExpiration, 10) - Date.now();
        if (remainingTime > 0) {
          resetTimer();
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('RefreshToken');
          localStorage.removeItem(EXPIRATION_KEY);
          navigate('/signin');
          onTokenRemoved();
        }
      }
    };

    if (initialize) {
      checkStoredExpiration();
    }
  }, [initialize]);

  return resetTimer;
};
