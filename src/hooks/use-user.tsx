import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Acct } from 'misskey-js';

export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => injectMisskeyApi().request('users/show', { userId }),
  });

export const getAcctUserQueryOptions = (acct: Acct) =>
  queryOptions({
    queryKey: ['user', acct.username, acct.host],
    queryFn: () => injectMisskeyApi().request('users/show', { username: acct.username, host: acct.host }),
  });
