/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi } from '@/lib/inject-misskey-api';
import { PERSIST_GC_TIME } from '@/plugins/persister';
import { queryOptions } from '@tanstack/react-query';

export const metaQueryOpts = queryOptions({
  queryKey: ['meta'],
  queryFn: () => misskeyApi('meta', { detail: true }),
  gcTime: PERSIST_GC_TIME,
  staleTime: 1000 * 60 * 60, // 1 hour
});
