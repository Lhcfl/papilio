/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNotification } from '@/components/mk-notification';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { createStreamChannel, INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { groupNotifications } from '@/lib/notification-grouper';
import { registerNote } from '@/hooks/note';
import { usePreference } from '@/stores/perference';
import { infiniteQueryOptions, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useEffect, useMemo } from 'react';

const EMPTY_EXCLUDE: NotificationIncludeableType[] = [];

/** The notification list of a window. */
export const MkNotifications = ({ exclude = EMPTY_EXCLUDE }: { exclude?: NotificationIncludeableType[] }) => {
  const grouping = usePreference((p) => p.groupNotifications);

  const opts = useMemo(
    () =>
      infiniteQueryOptions({
        queryKey: ['notifications', exclude],
        queryFn: ({ pageParam: untilId }) =>
          misskeyApi('i/notifications', {
            untilId,
            limit: 99,
            excludeTypes: exclude,
            markAsRead: false,
          }).then((ns) => ({
            id: untilId,
            raw: ns.map((n) => {
              if ('note' in n) {
                registerNote([n.note]);
              }
              return n;
            }),
            grouped: groupNotifications(ns),
          })),
        initialPageParam: INITIAL_UNTIL_ID,
        getNextPageParam: (lastPage) => lastPage.raw.at(-1)?.id,
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: 'always',
      }),
    [exclude],
  );

  const query = useInfiniteQuery(opts);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = createStreamChannel('main');
    channel.on('notification', (notification) => {
      if ('note' in notification) {
        registerNote([notification.note]);
      }
      if (exclude.includes(notification.type as NotificationIncludeableType)) {
        return;
      }
      queryClient.setQueryData(opts.queryKey, (old) => {
        if (old) {
          const newPages = old.pages.map((page, index) => {
            if (index === 0) {
              const newRaw = [notification, ...page.raw];
              return {
                id: page.id,
                raw: newRaw,
                grouped: groupNotifications(newRaw),
              };
            } else {
              return page;
            }
          });
          if (newPages[0].raw.length > 100) {
            newPages.unshift({
              id: INITIAL_UNTIL_ID,
              raw: [],
              grouped: [],
            });
          }
          return {
            ...old,
            pages: newPages,
          };
        } else {
          return old;
        }
      });
    });
    return () => {
      channel.dispose();
    };
  }, [exclude, opts.queryKey, queryClient]);

  return (
    <MkInfiniteScrollByData className="mk-notifications" infiniteQueryResult={query}>
      {(page) =>
        (grouping ? page.grouped : page.raw).map((n) => (
          <Fragment key={n.id}>
            <MkNotification notification={n} />
            <hr className="border-border/70" />
          </Fragment>
        ))
      }
    </MkInfiniteScrollByData>
  );
};
