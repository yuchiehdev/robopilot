/* eslint-disable consistent-return */
// store the token in the query cache and remove it after 10 minutes
// not using right now
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const AUTH_TOKEN_QUERY_KEY = ['authToken'];

export function useAuthToken(): [string | null, (token: string) => void] {
  const queryClient = useQueryClient();
  const cachedToken = queryClient.getQueryData<string>(AUTH_TOKEN_QUERY_KEY);

  const [authToken, setAuthToken] = useState<string | null>(cachedToken || null);
  const [expiration, setExpiration] = useState<number | null>(null);

  useEffect(() => {
    if (authToken && expiration) {
      const timeoutId = setTimeout(() => {
        setAuthToken(null);
        queryClient.removeQueries(AUTH_TOKEN_QUERY_KEY);
      }, expiration - Date.now());
      return () => clearTimeout(timeoutId);
    }
  }, [authToken, expiration, queryClient]);

  const setToken = (token: string) => {
    setAuthToken(token);
    setExpiration(Date.now() + 10 * 60 * 1000); // Set expiration to 10 minutes from now
    queryClient.setQueryData(AUTH_TOKEN_QUERY_KEY, token);
  };

  return [authToken, setToken];
}
