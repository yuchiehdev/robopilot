import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import { fetchWithToken } from '../api/fetchWithToken';
import { refreshAuth } from './useAuthenticatedQuery';

export const useAuthenticatedMutation = <
  TData = unknown,
  TError = unknown,
  TQueryVariables extends Record<string, string> = Record<string, string>,
  TBodyVariables = unknown,
>(
  url: string,
  method: string,
  options?: UseMutationOptions<
    TData,
    TError,
    { queryParams: TQueryVariables; body: TBodyVariables }
  >,
  otherOptions?: Record<string, unknown>,
): UseMutationResult<
  TData,
  TError,
  { queryParams: TQueryVariables; body: TBodyVariables }
> => {
  const mutationFn = async ({
    queryParams,
    body,
  }: {
    queryParams: TQueryVariables;
    body: TBodyVariables;
  }): Promise<TData> => {
    let token = localStorage.getItem('JWToken');
    const response = await fetchWithToken(url, method, token, body, queryParams);

    if (response.status === 403 || response.status === 401) {
      // use refresh token to get new access token
      await refreshAuth(otherOptions?.username as string);
      token = localStorage.getItem('JWToken');

      // try again with new access token
      const newResponse = await fetchWithToken(url, method, token, body, queryParams);
      if (newResponse.status === 403 || newResponse.status === 401) {
        throw new Error('Unauthorized');
      }
    }
    if (response.status === 404) {
      throw new Error('Not Found');
    }
    if (response.status === 400) {
      throw new Error('Bad Request');
    }

    return response.json();
  };

  return useMutation<
    TData,
    TError,
    { queryParams: TQueryVariables; body: TBodyVariables }
  >(mutationFn, {
    ...options,
    onError: (error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context);
      }
      throw error;
    },
  });
};
