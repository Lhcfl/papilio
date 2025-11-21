/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { PERSIST_GC_TIME, queryClient } from '@/plugins/persister';
import { injectMisskeyStream, site } from '@/lib/inject-misskey-api';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EmojisResponse } from 'misskey-js/entities.js';
import { useEffect, useEffectEvent } from 'react';
import { metaQueryOpts } from '@/loaders/meta-loader';

export const emojisopt = queryOptions({
  queryKey: ['custom-emojis'],
  refetchInterval: 1000 * 60 * 60, // 1 hours
  queryFn: () =>
    queryClient.ensureQueryData(metaQueryOpts).then((meta) => {
      // Misskey 12 and 12 forks, like Firefish and Iceshrimp, have emojis in meta, and do not have /api/emojis endpoint.
      if ('emojis' in meta) {
        return { emojis: meta.emojis } as EmojisResponse;
      } else {
        return fetch(new URL('/api/emojis', site!)).then((r) => r.json() as Promise<EmojisResponse>);
      }
    }),
  select: (data) => data.emojis,
  gcTime: PERSIST_GC_TIME,
  staleTime: 1000 * 60 * 60, // 1 hour
});

export function useEmojiLoader() {
  const query = useQuery(emojisopt);
  const queryClient = useQueryClient();

  const refetch = useEffectEvent(() => {
    void query.refetch();
  });

  useEffect(() => {
    const stream = injectMisskeyStream();
    stream.addListener('emojiUpdated', refetch);
    stream.addListener('emojiAdded', refetch);
    stream.addListener('emojiDeleted', refetch);
    return () => {
      stream.removeListener('emojiUpdated', refetch);
      stream.removeListener('emojiAdded', refetch);
      stream.removeListener('emojiDeleted', refetch);
    };
  }, [queryClient]);

  return query;
}
