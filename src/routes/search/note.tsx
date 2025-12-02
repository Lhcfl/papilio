/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { Separator } from '@/components/ui/separator';
import { registerNote } from '@/hooks/note';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryAtom } from '@/routes/search/-atoms';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search/note')({
  component: RouteComponent,
  context: (ctx) => (console.log(ctx), { query: '' }),
});

function RouteComponent() {
  const { t } = useTranslation();
  const query = useAtomValue(queryAtom);

  return (
    <div>
      {query.trim() != '' && (
        <div className="search-result mt-4">
          <Separator />
          <div className="search-result-label text-muted-foreground p-2 text-sm">{t('searchResult')}</div>
          <MkInfiniteScroll
            queryKey={['search/notes', query]}
            queryFn={({ pageParam }) =>
              misskeyApi('notes/search', {
                query,
                untilId: pageParam,
              }).then((ns) => registerNote(ns))
            }
          >
            {(nid) => <MkNote noteId={nid} key={nid} />}
          </MkInfiniteScroll>
        </div>
      )}
    </div>
  );
}
