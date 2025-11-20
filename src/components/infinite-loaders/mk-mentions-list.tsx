/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNote } from '@/components/mk-note';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';

export const MkMentionsList = (props: { visibility?: 'specified' }) => {
  const { visibility } = props;

  return (
    <MkInfiniteScroll
      className="mk-mentions w-full"
      queryKey={['mentions', visibility]}
      queryFn={({ pageParam }) =>
        misskeyApi('notes/mentions', { untilId: pageParam, limit: 30, visibility }).then((ns) => registerNote(ns))
      }
    >
      {(id) => <MkNote key={id} noteId={id} />}
    </MkInfiniteScroll>
  );
};
