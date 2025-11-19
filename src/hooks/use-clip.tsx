/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi } from '@/services/inject-misskey-api';
import { queryOptions, useMutation } from '@tanstack/react-query';

export const useCreateNewClipAction = () =>
  useMutation({
    mutationKey: ['clips/create'],
    mutationFn: (props: { name: string; description: string; isPublic: boolean }) => misskeyApi('clips/create', props),
    onSuccess: (_1, _2, _3, ctx) => {
      void ctx.client.refetchQueries({ queryKey: ['clips'] });
    },
  });

export function clipQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['clip', id],
    queryFn: () => misskeyApi('clips/show', { clipId: id }),
    staleTime: 10 * 1000,
  });
}
