/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { MkTime } from '@/components/mk-time';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { StarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/favorites')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <DefaultLayout title={t('favorites')}>
      <MkInfiniteScroll
        queryKey={['favorites']}
        queryFn={({ pageParam }) =>
          misskeyApi('i/favorites', { untilId: pageParam }).then((ns) => {
            registerNote(ns.map((x) => x.note));
            return ns;
          })
        }
      >
        {(n) => (
          <div key={n.id}>
            <div className="text-sm text-tertiary px-4 -mb-2 flex gap-2 items-center">
              <StarIcon className="size-4" />
              {t('favorited')} <MkTime time={n.createdAt} />
            </div>
            <MkNote noteId={n.noteId} />
          </div>
        )}
      </MkInfiniteScroll>
    </DefaultLayout>
  );
}
