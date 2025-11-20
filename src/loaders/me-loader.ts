/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { PERSIST_GC_TIME } from '@/plugins/persister';
import { createStreamChannel, misskeyApi } from '@/services/inject-misskey-api';
import { unreadNotificationsAtom } from '@/stores/unread-notifications';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const meopt = queryOptions({
  queryKey: ['me'],
  queryFn: () => misskeyApi('i', {}),
  gcTime: PERSIST_GC_TIME,
  staleTime: 1000 * 60 * 60, // 1 hour
});

export function useMeLoader() {
  const setUnreadNotificationsCount = useSetAtom(unreadNotificationsAtom);
  const me = useQuery(meopt);
  const queryClient = useQueryClient();

  const { refetch } = me;

  useEffect(() => {
    setUnreadNotificationsCount(me.data?.unreadNotificationsCount ?? 0);
  }, [me.data?.unreadNotificationsCount, setUnreadNotificationsCount]);

  useEffect(() => {
    const channel = createStreamChannel('main');
    channel.on('meUpdated', (me) => {
      if (import.meta.env.DEV) {
        console.log('🆙 meUpdated');
      }
      queryClient.setQueryData(meopt.queryKey, me as never);
    });
    channel.on('receiveFollowRequest', () => {
      void refetch();
    });
    return () => {
      channel.dispose();
    };
  }, [queryClient, refetch]);

  return me;
}
