/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useNoteValue } from '@/hooks/use-note';
import { MkMfm } from '@/components/mk-mfm';
import { getNoteExcerpt } from '@/services/note-excerpt';
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
      className="mk-note-reply-line px-2 pt-2 flex relative gap-4 items-center cursor-pointer"
      onClick={withNoSelection(withStopPrevent(onExpand))}
    >
      <MkAvatar user={note.user} className="ml-1 z-10" />
      <div className="body line-clamp-2 w-full text-sm text-muted-foreground">
        {note.isHidden ? (
          <span className="inline-flex gap-1 items-center">
            <LockIcon className="size-4" />({t('private')})
          </span>
        ) : (
          <MkMfm text={getNoteExcerpt(note)} author={note.user} inline />
        )}
      </div>

      <div className="note-reply-line absolute -bottom-2 top-6 left-7 border-l-2" />
    </div>
  );
};
