/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useNoteValue } from '@/hooks/use-note';
import { MkMfm } from '@/components/mk-mfm';
import { getNoteExcerpt } from '@/lib/note-excerpt';
import { MkAvatar } from '@/components/mk-avatar';
import { withNoSelection, withStopPrevent } from '@/lib/utils';
import { LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MkNoteReplyLine = (props: { noteId: string; onExpand: () => void }) => {
  const { noteId, onExpand } = props;
  const note = useNoteValue(noteId);
  const { t } = useTranslation();
  if (note == null) return null;

  return (
    <div
      className="mk-note-reply-line relative flex cursor-pointer items-center gap-4 px-2 pt-2"
      onClick={withNoSelection(withStopPrevent(onExpand))}
    >
      <MkAvatar user={note.user} className="z-10 ml-1" />
      <div className="body text-muted-foreground line-clamp-2 w-full text-sm">
        {note.isHidden ? (
          <span className="inline-flex items-center gap-1">
            <LockIcon className="size-4" />({t('private')})
          </span>
        ) : (
          <MkMfm text={getNoteExcerpt(note)} author={note.user} inline />
        )}
      </div>

      <div className="note-reply-line absolute top-6 -bottom-2 left-7 border-l-2" />
    </div>
  );
};
