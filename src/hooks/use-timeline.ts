import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';
import { injectMisskeyApi, injectMisskeyStream } from '@/services/inject-misskey-api';
import { registerNote } from './use-note';

const TIMELINE_PAGE_SIZE = 30;

export type TimelineTypes = 'home' | 'global' | 'local' | 'hybrid';

const timelineQueryKey = (type: TimelineTypes) => ['timeline', type];

export const useTimeline = (type: TimelineTypes) => {
  const api = injectMisskeyApi();
  const stream = injectMisskeyStream();
  const queryClient = useQueryClient();

  const channelName = `${type}Timeline` as const;

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[timeline] subscribing to channel ${channelName}`);
    }
    const channel = stream.useChannel(channelName);
    channel.on('note', (note) => {
      if (import.meta.env.DEV) {
        console.log('[timeline] new note received', note);
      }
      const [id] = registerNote([note]);

      queryClient.setQueryData(timelineQueryKey(type), (data: (typeof query)['data']) => {
        if (import.meta.env.DEV) {
          console.log(data);
        }
        const [page0, ...other] = data?.pages || [[]];
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
        console.log(`[timeline] channel ${channelName} disposed`);
      }
      channel.dispose();
    };
  }, [channelName, queryClient, type, stream]);

  const fetcher = ({ pageParam }: { pageParam?: string }) => {
    switch (type) {
      case 'home':
        return api.request('notes/timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        });
      case 'global':
        return api.request('notes/global-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        });
      case 'local':
        return api.request('notes/local-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        });
      case 'hybrid':
        return api.request('notes/hybrid-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        });
    }
  };

  const query = useInfiniteQuery({
    queryKey: timelineQueryKey(type),
    queryFn: async ({ pageParam }) => {
      const notes = await fetcher({ pageParam });
      return registerNote(notes);
    },
    getNextPageParam: (lastPage) => lastPage.at(-1),
    initialPageParam: 'zzzzzzzzzzzzzzzzzzzzzzzz',
    staleTime: Number.POSITIVE_INFINITY,
  });

  return query;
};

export const useHomeTimeline = () => useTimeline('home');
export const useGlobalTimeline = () => useTimeline('global');
