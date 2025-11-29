/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { NoteWithExtension } from '@/types/note';
import { MkNoteBody } from '@/components/note/mk-note-body';
import { MkNoteHeader } from '@/components/note/mk-note-header';
import { useNoteValue } from '@/hooks/note';
import type { ComponentProps, HTMLProps } from 'react';
import { cn } from '@/lib/utils';

export const MkNoteSimple = (
  props: {
    noteId: NoteWithExtension['id'];
    disableRouteOnClick?: boolean;
    isSubNote?: boolean;
    showLeftLine?: boolean;
    bodyProps?: Omit<
      ComponentProps<typeof MkNoteBody>,
      'note' | 'showQuoteAsIcon' | 'showReplyAsIcon' | 'disableLinkPreview'
    >;
    appendHeader?: React.ReactNode;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { noteId, className, disableRouteOnClick, isSubNote, showLeftLine, bodyProps, appendHeader, ...rest } = props;
  const note = useNoteValue(noteId);
  if (!note) return null;
  return (
    <div className={cn('mk-note-simple relative p-2', className)} {...rest}>
      <MkNoteHeader note={note} append={appendHeader} />
      <div
        className={cn({
          'pl-14': isSubNote,
        })}
      >
        <MkNoteBody
          {...bodyProps}
          note={note}
          showReplyAsIcon
          showQuoteAsIcon
          disableLinkPreview
          disableRouteOnClick={disableRouteOnClick}
        />
      </div>
      {isSubNote && showLeftLine && <div className="note-sub-line absolute top-6 -bottom-2 left-9 border-l-2" />}
    </div>
  );
};
