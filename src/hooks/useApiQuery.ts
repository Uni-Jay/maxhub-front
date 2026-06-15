import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type QueryFn<T> = () => Promise<T>;

export function useApiQuery<T>(
  queryKey: unknown[],
  queryFn: QueryFn<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn,
    staleTime: 30_000,
    ...options,
  });
}
