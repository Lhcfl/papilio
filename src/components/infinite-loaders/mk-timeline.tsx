/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNote } from '@/components/mk-note';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createStreamChannel, misskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import type { TimelineTypes } from '@/types/timeline';
import { HeaderRightPortal } from '@/layouts/default-layout';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

const TIMELINE_PAGE_SIZE = 30;

export const MkTimeline = (props: { type: TimelineTypes }) => {
  const { type } = props;
  const queryClient = useQueryClient();

  useEffect(() => {
    const channelName = `${type}Timeline` as const;
    if (import.meta.env.DEV) {
      console.log(`[timeline] 🟢 subscribing to channel ${channelName}`);
    }
    const channel = createStreamChannel(channelName);
    channel.on('note', (note) => {
      if (import.meta.env.DEV) {
        console.log('[timeline] 🆕', channelName, note);
      }
      const [id] = registerNote([note]);

      queryClient.setQueryData(['timeline', type], (data: (typeof query)['data']) => {
        const [page0, ...other] = data?.pages ?? [[]];
        const newPages = page0.length >= TIMELINE_PAGE_SIZE ? [[id], page0] : [[id, ...page0]];

        return data
          ? {
              pageParams: data.pageParams,
              pages: [...newPages, ...other],
            }
          : data;
      });
    });
    return () => {
      if (import.meta.env.DEV) {
        console.log(`[timeline] 🔴 channel ${channelName} disposed`);
      }
      channel.dispose();
    };
  }, [queryClient, type]);

  const query = useInfiniteQuery({
    queryKey: ['timeline', type],
    queryFn: async ({ pageParam }) => {
      const notes = await (() => {
        switch (type) {
          case 'home':
            return misskeyApi('notes/timeline', {
              limit: TIMELINE_PAGE_SIZE,
              untilId: pageParam,
            });
          case 'global':
            return misskeyApi('notes/global-timeline', {
              limit: TIMELINE_PAGE_SIZE,
              untilId: pageParam,
            });
          case 'local':
            return misskeyApi('notes/local-timeline', {
              limit: TIMELINE_PAGE_SIZE,
              untilId: pageParam,
            });
          case 'hybrid':
            return misskeyApi('notes/hybrid-timeline', {
              limit: TIMELINE_PAGE_SIZE,
              untilId: pageParam,
            });
        }
      })();
      return registerNote(notes);
    },
    getNextPageParam: (lastPage) => lastPage.at(-1),
    initialPageParam: 'zzzzzzzzzzzzzzzzzzzzzzzz',
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: 'always',
  });

  const { refetch, isRefetching } = query;

  return (
    <>
      <HeaderRightPortal>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            void refetch();
          }}
        >
          <RefreshCwIcon className={isRefetching ? 'animate-spin' : ''} />
        </Button>
      </HeaderRightPortal>
      <MkInfiniteScrollByData infiniteQueryResult={query} className="mk-timeline w-full">
        {(id) => <MkNote key={id} noteId={id} showReply />}
      </MkInfiniteScrollByData>
    </>
  );
};
