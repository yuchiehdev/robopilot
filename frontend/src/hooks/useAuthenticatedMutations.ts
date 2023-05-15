import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import { fetchWithToken } from '../api/fetchWithToken';
import { refreshAuth } from './useAuthenticatedQuery';

export const useAuthenticatedMutations = <
  TData = unknown,
  TError = unknown,
  TQueryVariables extends Record<string, string> = Record<string, string>,
  TBodyVariables = unknown,
>(
  url: string,
  method: string,
  options?: UseMutationOptions<
    TData[],
    TError,
    { query: TQueryVariables; body: TBodyVariables[] }
  >,
  otherOptions?: Record<string, unknown>,
): UseMutationResult<
  TData[],
  TError,
  { query: TQueryVariables; body: TBodyVariables[] }
> => {
  const mutationFn = async ({
    query,
    body,
  }: {
    query: TQueryVariables;
    body: TBodyVariables[];
  }): Promise<TData[]> => {
    const results = await Promise.all(
      body.map(async (item) => {
        let token = localStorage.getItem('JWToken');
        const response = await fetchWithToken(url, method, token, item, query);

        if (response.status === 403 || response.status === 401) {
          await refreshAuth(otherOptions?.username as string);
          token = localStorage.getItem('JWToken');
          const newResponse = await fetchWithToken(url, method, token, item, query);

          if (newResponse.status === 403 || newResponse.status === 401) {
            throw new Error('Unauthorized');
          }

          return newResponse.json();
        }
        if (response.status === 404) {
          throw new Error('Not Found');
        }
        if (response.status === 400) {
          throw new Error('Bad Request');
        }

        return response.json();
      }),
    );

    return results;
  };

  return useMutation<TData[], TError, { query: TQueryVariables; body: TBodyVariables[] }>(
    mutationFn,
    {
      ...options,
      onError: (error, variables, context) => {
        if (options?.onError) {
          options.onError(error, variables, context);
        }
      },
    },
  );
};
