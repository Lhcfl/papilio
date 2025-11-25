/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerNote } from '@/hooks/use-note';
import { INITIAL_UNTIL_ID, injectMisskeyApi, misskeyApi } from '@/lib/inject-misskey-api';
import type { UserLite } from '@/types/user';
import { queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
    queryFn: () =>
      injectMisskeyApi()
        .request('users/show', { username: acct.username, host: acct.host })
        .then((user) => {
          registerNote(user.pinnedNotes);
          return user;
        }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

export interface UserRelation {
  id: string;
  user: UserLite;
  createdAt: string;
}

export const useUserFollowersInfiniteQuery = (userId: string) =>
  useInfiniteQuery({
    queryKey: ['users/followers', userId],
    queryFn: ({ pageParam }) =>
      misskeyApi('users/followers', {
        userId,
        limit: 90,
        untilId: pageParam,
      }).then((res) =>
        res.map(
          (item): UserRelation => ({
            id: item.id,
            user: item.follower!,
            createdAt: item.createdAt,
          }),
        ),
      ),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

export const useUserFollowingsInfiniteQuery = (userId: string) =>
  useInfiniteQuery({
    queryKey: ['users/following', userId],
    queryFn: ({ pageParam }) =>
      misskeyApi('users/following', {
        userId,
        limit: 90,
        untilId: pageParam,
      }).then((res) =>
        res.map(
          (item): UserRelation => ({
            id: item.id,
            user: item.followee!,
            createdAt: item.createdAt,
          }),
        ),
      ),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });
