/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerNote } from '@/hooks/use-note';
import { injectMisskeyApi } from '@/lib/inject-misskey-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MkError } from '@/components/mk-error';
import { MkNote } from '@/components/mk-note';
import { LoadingTrigger } from '@/components/loading-trigger';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from 'react-i18next';
import { PinIcon } from 'lucide-react';

export const MkUserNotes = (props: { userId: string; pinnedNotes?: string[] }) => {
  const api = injectMisskeyApi();
  const { userId, pinnedNotes = [] } = props;
  const { t } = useTranslation();

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['user-notes', userId],
    queryFn: ({ pageParam }) =>
      api
        .request('users/notes', {
          userId,
          untilId: pageParam,
          limit: 30,
        })
        .then((ns) => registerNote(ns)),
    getNextPageParam: (lastPage) => lastPage.at(-1),
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialPageParam: 'zzzzzzzzzzzzzzzzz',
  });

  return (
    <div className="mk-user-notes w-full">
      {pinnedNotes.map((id) => (
        <div key={id}>
          <div className="text-tertiary -mb-2 flex items-center gap-2 px-4 text-sm">
            <PinIcon className="size-4" />
            {t('pinnedNote')}
          </div>
          <MkNote noteId={id} showReply />
        </div>
      ))}
      {pinnedNotes.length > 0 && <div className="mt-4" />}
      {data?.pages.flatMap((page) => page.map((id) => <MkNote key={id} noteId={id} showReply />))}
      {error && <MkError error={error} />}
      {(hasNextPage || isFetchingNextPage || isFetching) && (
        <div className="my-4 flex w-full justify-center">
          <LoadingTrigger onShow={fetchNextPage}>
            <Spinner />
          </LoadingTrigger>
        </div>
      )}
    </div>
  );
};
