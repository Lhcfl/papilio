/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNote } from '@/components/mk-note';
import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { useEffect, useMemo, useState } from 'react';
import { infiniteQueryOptions, useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createStreamChannel, INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/note';
import type { TimelineTypes } from '@/types/timeline';
import { HeaderRightPortal } from '@/components/header-portal';
import { Button } from '@/components/ui/button';
import { CogIcon, RefreshCwIcon } from 'lucide-react';
import type { SkEndpoints } from '@/types/sharkey-api';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { useTranslation } from 'react-i18next';

const TIMELINE_PAGE_SIZE = 30;

type TimelineRequestParams<
  E extends 'notes/timeline' | 'notes/global-timeline' | 'notes/local-timeline' | 'notes/hybrid-timeline',
> = SkEndpoints[E]['req'];

export const MkTimeline = ({ type }: { type: TimelineTypes }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [withReplies, setWithReplies] = useState(true);
  const [withRenotes, setWithRenotes] = useState(true);
  const [withBots, setWithBots] = useState(true);
  const [onlyMedia, setOnlyMedia] = useState(false);

  const pparams = useMemo(
    (): Partial<TimelineRequestParams<'notes/timeline'>> => ({
      withBots: withBots,
      withReplies: withReplies,
      withRenotes: withRenotes,
      // Misskey's strange name, `withFiles` means only notes with files
      withFiles: onlyMedia,
    }),
    [withBots, withReplies, withRenotes, onlyMedia],
  );

  const menu: Menu = [
    {
      type: 'label',
      label: t('settings'),
      id: 'title',
    },
    {
      type: 'switch',
      label: t('flagShowTimelineReplies'),
      value: withReplies,
      id: 'withReplies',
      onChange: setWithReplies,
      disabled: onlyMedia,
    },
    {
      type: 'switch',
      label: t('showRenotes'),
      value: withRenotes,
      id: 'withRenotes',
      onChange: setWithRenotes,
    },
    {
      type: 'switch',
      label: t('showBots'),
      value: withBots,
      id: 'withBots',
      onChange: setWithBots,
    },
    {
      type: 'switch',
      label: t('fileAttachedOnly'),
      value: onlyMedia,
      id: 'onlyMedia',
      onChange: setOnlyMedia,
      disabled: withReplies,
    },
  ];

  const opts = infiniteQueryOptions({
    queryKey: ['timeline', type, pparams],
    queryFn: async ({ pageParam }) => {
      const notes = await (() => {
        const params: TimelineRequestParams<'notes/timeline'> = {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
          allowPartial: true,
          ...pparams,
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
    const channel = createStreamChannel(channelName, { ...pparams });
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
  }, [queryClient, opts.queryKey, type, pparams]);

  const query = useInfiniteQuery(opts);

  const { refetch, isRefetching } = query;

  return (
    <>
      <HeaderRightPortal>
        <MenuOrDrawer menu={menu}>
          <Button variant="ghost" size="icon-sm">
            <CogIcon />
          </Button>
        </MenuOrDrawer>
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
