/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import { MkNoteActions } from '@/components/note/mk-note-actions';
import { MkNoteBody } from '@/components/note/mk-note-body';
import { MkNoteHeader } from '@/components/note/mk-note-header';
import { MkNoteReactions } from '@/components/note/mk-note-reactions';
import { MkNoteRenoteTip } from '@/components/note/mk-note-renote-tip';
import { useState, type HTMLProps } from 'react';
import { useAppearNote, useNoteValue } from '@/hooks/note';
import { useTranslateAction } from '@/hooks/note-actions';
import { Button } from '@/components/ui/button';
import { FoldVerticalIcon } from 'lucide-react';
import { MkNoteReplyLine } from '@/components/note/mk-note-reply-line';
import { usePreference } from '@/stores/perference';
import { MkMuteableNote } from '@/components/note/mk-muteable-note';

export const MkNote = ({
  noteId,
  isSubNote,
  showReply = true,
  onClose,
  detailed,
  hideReplyIcon,
  className: classNameProps,
  decorationBottomRight,
  ...divProps
}: {
  noteId: string;
  /** SubNote 左边会空出来一块位置用来连线 */
  isSubNote?: boolean;
  decorationBottomRight?: React.ReactNode;
  showReply?: boolean;
  hideReplyIcon?: boolean;
  detailed?: boolean;
  onClose?: () => void;
} & HTMLProps<HTMLDivElement>) => {
  const note = useNoteValue(noteId);
  const appearNote = useAppearNote(note);
  const { mutate: translate } = useTranslateAction(appearNote?.id ?? '');
  const collapseNotesRepliedTo = usePreference((p) => p.collapseNotesRepliedTo);
  const [manualShowReplyState, setShowReplyState] = useState<'subNote' | 'inline' | null>(null);
  const showReplyState = manualShowReplyState ?? (collapseNotesRepliedTo ? 'inline' : 'subNote');

  if (note == null || appearNote == null) {
    return null;
  }

  const hasReply = note.repliesCount > 0;

  return (
    <MkMuteableNote
      note={note.id == appearNote.id ? null : note}
      appearNote={appearNote}
      className={clsx('mk-note relative flex flex-col p-2', classNameProps)}
      bypassMuteCheck={detailed}
      {...divProps}
    >
      {appearNote.id != note.id && <MkNoteRenoteTip note={note} />}
      {showReply && showReplyState === 'subNote' && appearNote.replyId != null && (
        <MkNote
          noteId={appearNote.replyId}
          isSubNote={true}
          className="reply-note -m-2"
          showReply={collapseNotesRepliedTo}
          onClose={() => {
            setShowReplyState('inline');
          }}
        />
      )}
      {showReply && showReplyState === 'inline' && appearNote.replyId != null && (
        <MkNoteReplyLine
          noteId={appearNote.replyId}
          onExpand={() => {
            setShowReplyState('subNote');
          }}
        />
      )}
      <MkNoteHeader note={appearNote} />
      <div className={clsx('relative', { 'pl-12': isSubNote })}>
        <MkNoteBody
          note={appearNote}
          disableLinkPreview={isSubNote}
          showQuoteAsIcon={isSubNote}
          showReplyAsIcon={isSubNote && !hideReplyIcon}
          detailed={detailed}
        />
        <MkNoteReactions note={appearNote} />
        <MkNoteActions onTranslate={translate} note={appearNote} />
        {isSubNote && onClose && (
          <Button
            className="note-close absolute top-3 left-7.5 z-10 -translate-x-1/2 rounded-full"
            onClick={onClose}
            variant="outline"
            size="icon-sm"
          >
            <FoldVerticalIcon />
          </Button>
        )}
      </div>
      {decorationBottomRight && <div className="absolute right-2 bottom-2">{decorationBottomRight}</div>}
      {/**
       * 回复树构造。
       * 对于每个 subnote, 并且有回复的话，显示左侧的连线。
       */}
      {isSubNote && hasReply && <div className="note-sub-line absolute top-6 -bottom-2 left-9 border-l-2" />}
    </MkMuteableNote>
  );
};
