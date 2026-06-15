import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

interface MutationOptions<TData, TVariables> extends
  Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  invalidateKeys?: unknown[][];
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
) {
  const queryClient = useQueryClient();
  const { invalidateKeys = [], ...rest } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context, mutation) => {
      invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      rest.onSuccess?.(data, variables, context, mutation);
    },
    ...rest,
  });
}
