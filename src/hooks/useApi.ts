import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { queryClient } from '../lib/queryClient';

// Types
type QueryKeyT = [string, Record<string, any>?];
type ApiError = AxiosError;

// PUBLIC_INTERFACE
/**
 * Hook for making GET requests
 * @param queryKey - Query key for caching
 * @param url - API endpoint URL
 * @param options - Additional react-query options
 */
export function useApiGet<TData = unknown>(
  queryKey: QueryKeyT,
  url: string,
  options?: Omit<UseQueryOptions<TData, ApiError, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get<TData>(url);
      return data;
    },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Hook for making POST requests
 * @param url - API endpoint URL
 * @param options - Additional react-query options
 */
export function useApiPost<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await axios.post<TData>(url, variables);
      return data;
    },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Hook for making PUT requests
 * @param url - API endpoint URL
 * @param options - Additional react-query options
 */
export function useApiPut<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await axios.put<TData>(url, variables);
      return data;
    },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Hook for making DELETE requests
 * @param url - API endpoint URL
 * @param options - Additional react-query options
 */
export function useApiDelete<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await axios.delete<TData>(`${url}/${variables}`);
      return data;
    },
    ...options,
  });
}

// PUBLIC_INTERFACE
/**
 * Helper function to invalidate queries
 * @param queryKey - Query key to invalidate
 */
export function invalidateQueries(queryKey: string | string[]) {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];
  return queryClient.invalidateQueries({ queryKey: key });
}