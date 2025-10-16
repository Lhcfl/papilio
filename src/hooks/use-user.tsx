import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Acct } from 'misskey-js';

export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => injectMisskeyApi().request('users/show', { userId }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

export const useUsersQuery = (userIds: string[] = []) =>
  useQuery({
    queryKey: ['users', ...userIds.sort()],
    queryFn: () => injectMisskeyApi().request('users/show', { userIds }),
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: userIds.length > 0,
  });

export const getAcctUserQueryOptions = (acct: Acct) =>
  queryOptions({
    queryKey: ['user', acct.username, acct.host],
    queryFn: () => injectMisskeyApi().request('users/show', { username: acct.username, host: acct.host }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
