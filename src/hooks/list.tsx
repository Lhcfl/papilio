import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryClient } from '@/plugins/persister';
import { queryOptions } from '@tanstack/react-query';

export const listlistQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: ['users/lists/list', userId],
    queryFn: () => misskeyApi('users/lists/list', { userId }),
  });

export const listDataQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ['users/lists/data', listId],
    queryFn: () => misskeyApi('users/lists/show', { listId }),
    placeholderData: () =>
      queryClient.getQueryData(listlistQueryOptions().queryKey)?.find((list) => list.id === listId),
  });
