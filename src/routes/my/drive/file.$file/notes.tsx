/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { registerNote } from '@/hooks/use-note';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/drive/file/$file/notes')({
  component: RouteComponent,
});

function RouteComponent() {
  const { file } = Route.useParams();

  return (
    <MkInfiniteScroll
      queryKey={['drive/files/attached-notes', file]}
      queryFn={({ pageParam }) =>
        misskeyApi('drive/files/attached-notes', {
          fileId: file,
          untilId: pageParam,
        }).then((res) => registerNote(res))
      }
    >
      {(id) => <MkNote noteId={id} />}
    </MkInfiniteScroll>
  );
}
