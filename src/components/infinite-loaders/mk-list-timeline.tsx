/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { registerNote } from '@/hooks/note';
import { INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

const listQueryOptions = (listId: string) =>
  infiniteQueryOptions({
    queryKey: ['user-list-timeline', listId],
    queryFn: ({ pageParam: untilId }) =>
      misskeyApi('notes/user-list-timeline', {
        listId,
        untilId,
      }).then((res) => registerNote(res)),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1),
  });

export function MkListTimeline(props: { listId: string }) {
  const query = useInfiniteQuery(listQueryOptions(props.listId));

  return (
    <MkInfiniteScrollByData infiniteQueryResult={query}>{(note) => <MkNote noteId={note} />}</MkInfiniteScrollByData>
  );
}
