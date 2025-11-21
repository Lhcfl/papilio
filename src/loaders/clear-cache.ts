/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { emojisopt } from '@/loaders/emoji-loader';
import { meopt } from '@/loaders/me-loader';
import { misskeyApi } from '@/lib/inject-misskey-api';
import type { QueryClient } from '@tanstack/react-query';
import { metaQueryOpts } from '@/loaders/meta-loader';

export function clearCache(queryClient: QueryClient) {
  return Promise.all([
    // MisskeyApi can force refetch even if cache exists
    misskeyApi('emojis', {}).then((emojis) => {
      queryClient.setQueryData(emojisopt.queryKey, emojis);
    }),
    queryClient.refetchQueries(meopt),
    queryClient.refetchQueries(metaQueryOpts),
    queryClient.refetchQueries({
      queryKey: ['node-info'],
    }),
  ]);
}
