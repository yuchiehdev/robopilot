import { useQuery } from '@tanstack/react-query';
import { REFRESH_TOKEN } from '../data/fetchUrl';

type refreshTokenInput = {
  username: string;
  refresh_token: string;
};

export const refreshToken = async (input: refreshTokenInput) => {
  try {
    const response = await fetch(REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('JWToken') || '',
      },
      body: JSON.stringify({
        username: input.username,
        refresh_token: input.refresh_token,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('JWToken', result.access_token);
      localStorage.setItem('RefreshToken', result.refresh_token);
    } else {
      localStorage.removeItem('JWToken');
      localStorage.removeItem('RefreshToken');
      localStorage.removeItem('SessionExpiration');

      throw new Error('useRefreshToken: Unable to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

export const useRefreshToken = (input: refreshTokenInput) => {
  return useQuery(['refreshToken', input], () => refreshToken(input), {
    enabled: false, // Disable the query by default
    retry: false, // Don't retry if the query fails
  });
};
