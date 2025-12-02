/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNote } from '@/components/mk-note';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { useEffect } from 'react';
import { infiniteQueryOptions, useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createStreamChannel, INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/note';
import type { TimelineTypes } from '@/types/timeline';
import { HeaderRightPortal } from '@/components/header-portal';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

const TIMELINE_PAGE_SIZE = 30;

export const MkTimeline = (props: { type: TimelineTypes }) => {
  const { type } = props;
  const queryClient = useQueryClient();

  const opts = infiniteQueryOptions({
    queryKey: ['timeline', type],
    queryFn: async ({ pageParam }) => {
      const notes = await (() => {
        const params = {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
          allowPartial: true,
        };

        switch (type) {
          case 'home':
            return misskeyApi('notes/timeline', params);
          case 'global':
            return misskeyApi('notes/global-timeline', params);
          case 'local':
            return misskeyApi('notes/local-timeline', params);
          case 'hybrid':
            return misskeyApi('notes/hybrid-timeline', params);
        }
      })();
      return registerNote(notes);
    },
    getNextPageParam: (lastPage) => lastPage.at(-1),
    initialPageParam: INITIAL_UNTIL_ID,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: 'always',
  });

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

      queryClient.setQueryData(opts.queryKey, (data) => {
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
  }, [queryClient, opts.queryKey, type]);

  const query = useInfiniteQuery(opts);

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
