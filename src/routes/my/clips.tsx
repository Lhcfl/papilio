/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/mk-infinite-scroll';
import { MkTime } from '@/components/mk-time';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useMe } from '@/stores/me';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PaperclipIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/clips')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const noteEachClipsLimit = useMe((me) => me.policies.noteEachClipsLimit);
  return (
    <DefaultLayout title={t('clips')}>
      <MkInfiniteScroll
        queryKey={['clips']}
        queryFn={({ pageParam }) => misskeyApi('clips/list', { untilId: pageParam })}
        // misskey bug here, it always returns all clips
        getNextPageParam={() => undefined}
      >
        {(clip) => (
          <Item asChild>
            <Link to="/clips/$id" params={{ id: clip.id }}>
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
            </Link>
          </Item>
        )}
      </MkInfiniteScroll>
    </DefaultLayout>
  );
}
