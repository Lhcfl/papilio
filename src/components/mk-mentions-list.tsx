/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { LoadingTrigger } from './loading-trigger';
import { MkNote } from './mk-note';
import { Spinner } from './ui/spinner';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';

export const MkMentionsList = (props: { visibility?: 'specified' }) => {
  const api = injectMisskeyApi();

  const { visibility } = props;

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['mentions', visibility],
    queryFn: ({ pageParam }) =>
      api.request('notes/mentions', { untilId: pageParam, limit: 30, visibility }).then((ns) => registerNote(ns)),
    getNextPageParam: (lastPage) => lastPage.at(-1),
    initialPageParam: 'zzzzzzzzzzzzzzzzzzzzz',
  });

  return (
    <div className="mk-mentions w-full">
      {isError && <div>Error loading mentions</div>}
      {data?.pages.flat().map((m) => (
        <MkNote key={m} noteId={m} />
      ))}
      {(isLoading || isFetchingNextPage) && (
        <div className="w-full p-3 flex justify-center">
          <Spinner />
        </div>
      )}
      <LoadingTrigger className="w-full h-1" onShow={() => hasNextPage && fetchNextPage()} />
    </div>
  );
};
