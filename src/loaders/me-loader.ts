/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { PERSIST_GC_TIME } from '@/plugins/persister';
import { createStreamChannel, misskeyApi } from '@/lib/inject-misskey-api';
import { unreadNotificationsAtom } from '@/stores/unread-notifications';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const meopt = queryOptions({
  queryKey: ['me'],
  queryFn: () =>
    misskeyApi('i', {}).then((me) => {
      // @ts-expect-error: workaround for misskey 12 / iceshrimp missing policies field
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      me.policies ??= {};
      return me;
    }),
  gcTime: PERSIST_GC_TIME,
  staleTime: 1000 * 60 * 60, // 1 hour
});

export function useMeLoader() {
  const setUnreadNotificationsCount = useSetAtom(unreadNotificationsAtom);
  const me = useQuery(meopt);
  const queryClient = useQueryClient();

  const { refetch, data } = me;

  useEffect(() => {
    setUnreadNotificationsCount(data?.unreadNotificationsCount ?? 0);
  }, [data?.unreadNotificationsCount, setUnreadNotificationsCount]);

  useEffect(() => {
    const channel = createStreamChannel('main');
    channel.on('meUpdated', (me) => {
      if (import.meta.env.DEV) {
        console.log('🆙 meUpdated');
      }
      queryClient.setQueryData(meopt.queryKey, (data) => ({ ...data, ...(me as NonNullable<typeof data>) }));
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
