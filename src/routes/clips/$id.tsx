/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { MkTime } from '@/components/mk-time';
import { useQuery } from '@tanstack/react-query';
import { PaperclipIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/stores/me';

export const Route = createFileRoute('/clips/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const id = Route.useParams().id;
  const { data: clip } = useQuery({
    queryKey: ['clip', id],
    queryFn: () => misskeyApi('clips/show', { clipId: id }),
  });

  const { t } = useTranslation();
  const noteEachClipsLimit = useMe((me) => me.policies.noteEachClipsLimit);
  return (
    <DefaultLayout title={clip?.name}>
      {clip && (
        <Item variant="outline">
          <ItemMedia variant="icon">
            <PaperclipIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{clip.name}</ItemTitle>
            <ItemDescription>{clip.description}</ItemDescription>
            <ItemDescription>
              <MkTime time={clip.lastClippedAt} />
              {t('notesCount')}: {clip.notesCount} / {noteEachClipsLimit}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
      <MkInfiniteScroll
        queryKey={['clip/notes', id]}
        queryFn={({ pageParam }) =>
          misskeyApi('clips/notes', { clipId: id, untilId: pageParam }).then((ns) => registerNote(ns))
        }
      >
        {(noteId) => <MkNote noteId={noteId} />}
      </MkInfiniteScroll>
    </DefaultLayout>
  );
}
