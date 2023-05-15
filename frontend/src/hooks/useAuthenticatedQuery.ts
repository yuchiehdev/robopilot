import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryFunction,
} from '@tanstack/react-query';
import { REFRESH_TOKEN } from '../data/fetchUrl';
import { fetchWithToken } from '../api/fetchWithToken';

// need userName because the refresh token api is required as body
export const refreshAuth = async (userName: string) => {
  try {
    const response = await fetch(REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('JWToken') || '',
      },
      body: JSON.stringify({
        username: userName,
        refresh_token: localStorage.getItem('RefreshToken') || '',
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log('me');
      localStorage.setItem('JWToken', result.access_token);
      localStorage.setItem('RefreshToken', result.refresh_token);
    } else {
      localStorage.removeItem('JWToken');
      throw new Error('Unable to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

export const useAuthenticatedQuery = <TData = unknown>(
  key: QueryKey,
  url: string,
  method: string,
  otherOptions?: Record<string, unknown>,
  options?: UseQueryOptions<TData>,
): UseQueryResult<TData> => {
  const queryFn: QueryFunction<TData> = async () => {
    let token = localStorage.getItem('JWToken');
    const response = await fetchWithToken(url, method, token);
    if (response.status === 403 || response.status === 401) {
      await refreshAuth(otherOptions?.username as string);
      token = localStorage.getItem('JWToken');
      const newResponse = await fetchWithToken(url, method, token);

      if (newResponse.status === 403 || newResponse.status === 401) {
        throw new Error('Unauthorized');
      }

      return newResponse.json();
    }

    return response.json();
  };

  return useQuery<TData>(key, queryFn, {
    ...options,
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
    suspense: true,
  });
};
