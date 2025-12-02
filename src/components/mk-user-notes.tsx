/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { registerNote } from '@/hooks/note';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { MkNote } from '@/components/mk-note';
import { useTranslation } from 'react-i18next';
import { PinIcon } from 'lucide-react';
import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import type { Endpoints } from '@/types/sharkey-api';

export const MkUserNotes = (props: {
  userId: string;
  pinnedNotes?: string[];
  opts?: Partial<Endpoints['users/notes']['req']>;
}) => {
  const { userId, pinnedNotes = [], opts } = props;
  const { t } = useTranslation();

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
      <MkInfiniteScroll
        queryKey={['users/notes', userId, opts]}
        queryFn={({ pageParam }) =>
          misskeyApi('users/notes', {
            userId,
            untilId: pageParam,
            limit: 30,
            allowPartial: true,
            ...opts,
          }).then((ns) => registerNote(ns))
        }
      >
        {(id) => <MkNote noteId={id} showReply />}
      </MkInfiniteScroll>
    </div>
  );
};
