/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NoteWithExtension } from '@/types/note';
import { MkNoteBody } from './note/mk-note-body';
import { MkNoteHeader } from './note/mk-note-header';
import { useNoteValue } from '@/hooks/use-note';
import type { HTMLProps } from 'react';
import { cn } from '@/lib/utils';

export const MkNoteSimple = (
  props: { noteId: NoteWithExtension['id']; disableRouteOnClick?: boolean } & HTMLProps<HTMLDivElement>,
) => {
  const { noteId, className, disableRouteOnClick, ...rest } = props;
  const note = useNoteValue(noteId);
  if (!note) return null;
  return (
    <div className={cn('mk-note-simple p-2', className)} {...rest}>
      <MkNoteHeader note={note} />
      <MkNoteBody
        note={note}
        showReplyAsIcon
        showQuoteAsIcon
        disableLinkPreview
        disableRouteOnClick={disableRouteOnClick}
      />
    </div>
  );
};
