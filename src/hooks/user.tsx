/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerNote } from '@/hooks/note';
import { INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import type { UserDetailed, UserLite } from '@/types/user';
import { queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Acct } from 'misskey-js';

export const getUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['user', userId],
    queryFn: () => misskeyApi('users/show', { userId }) as Promise<UserDetailed>,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

export const useUserQuery = (userId: string) => useQuery(getUserQueryOptions(userId));

export const useUsersQuery = (userIds: string[] = []) =>
  useQuery({
    queryKey: ['users', ...userIds.sort()],
    queryFn: () => misskeyApi('users/show', { userIds }) as unknown as Promise<UserLite[]>,
    staleTime: 1000 * 60 * 15, // 15 minutes
    enabled: userIds.length > 0,
  });

export const getAcctUserQueryOptions = (acct: Acct) =>
  queryOptions({
    queryKey: ['user', acct.username, acct.host],
    queryFn: () =>
      (misskeyApi('users/show', { username: acct.username, host: acct.host }) as Promise<UserDetailed>).then((user) => {
        registerNote(user.pinnedNotes);
        return user;
      }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

export interface UserRelation {
  id: string;
  user: UserDetailed;
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
