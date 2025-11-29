/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { registerNote } from '@/hooks/note';
import { PageTitle } from '@/layouts/sidebar-layout';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tag/$tag')({
  component: RouteComponent,
});

function RouteComponent() {
  const tag = Route.useParams().tag;

  return (
    <>
      <PageTitle title={`#${tag}`} />
      <MkInfiniteScroll
        queryKey={['tag', tag]}
        queryFn={() => misskeyApi('notes/search-by-tag', { tag }).then((ns) => registerNote(ns))}
      >
        {(n) => <MkNote noteId={n} />}
      </MkInfiniteScroll>
    </>
  );
}
