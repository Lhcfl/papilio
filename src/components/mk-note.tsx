/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import { MkNoteActions } from './note/mk-note-actions';
import { MkNoteBody } from './note/mk-note-body';
import { MkNoteHeader } from './note/mk-note-header';
import { MkNoteReactions } from './note/mk-note-reactions';
import { MkNoteRenoteTip } from './note/mk-note-renote-tip';
import { useState, type HTMLProps } from 'react';
import { useAppearNote, useNoteValue } from '@/hooks/use-note';
import { useTranslateAction } from '@/hooks/note-actions';
import { useDebugger } from '@/debug/debug';
import { isPureRenote } from 'misskey-js/note.js';
import { Button } from './ui/button';
import { FoldVerticalIcon } from 'lucide-react';
import { MkNoteReplyLine } from './note/mk-note-reply-line';

export const MkNote = (
  props: {
    noteId: string;
    /** SubNote 左边会空出来一块位置用来连线 */
    isSubNote?: boolean;
    decorationBottomRight?: React.ReactNode;
    showReply?: boolean;
    hideReplyIcon?: boolean;
    detailed?: boolean;
    onClose?: () => void;
  } & HTMLProps<HTMLDivElement>,
) => {
  const {
    noteId,
    isSubNote,
    showReply = true,
    onClose,
    detailed,
    hideReplyIcon,
    className: classNameProps,
    ...divProps
  } = props;
  const note = useNoteValue(noteId);
  const appearNote = useAppearNote(note);
  const { mutate: translate } = useTranslateAction(noteId);
  const [showReplyState, setShowReplyState] = useState<'subNote' | 'inline'>('inline');

  useDebugger('MkNote', noteId);

  if (note == null || appearNote == null) {
    return null;
  }

  const hasReply = note.repliesCount > 0;

  return (
    <div className={clsx('mk-note flex flex-col p-2 relative', classNameProps)} {...divProps}>
      {isPureRenote(note) && <MkNoteRenoteTip note={note} />}
      {showReply && showReplyState === 'subNote' && note.replyId != null && (
        <MkNote
          noteId={note.replyId}
          isSubNote={true}
          className="reply-note -m-2"
          onClose={() => {
            setShowReplyState('inline');
          }}
        />
      )}
      {showReply && showReplyState === 'inline' && note.replyId != null && (
        <MkNoteReplyLine
          noteId={note.replyId}
          onExpand={() => {
            setShowReplyState('subNote');
          }}
        />
      )}
      <MkNoteHeader note={appearNote} />
      <div className={clsx({ 'pl-12': isSubNote })}>
        <MkNoteBody
          note={appearNote}
          disableLinkPreview={isSubNote}
          showQuoteAsIcon={isSubNote}
          showReplyAsIcon={isSubNote && !hideReplyIcon}
          detailed={detailed}
        />
        <MkNoteReactions note={appearNote} />
        <MkNoteActions onTranslate={translate} note={appearNote} />
      </div>
      {props.decorationBottomRight && <div className="absolute bottom-2 right-2">{props.decorationBottomRight}</div>}
      {/**
       * 回复树构造。
       * 对于每个 subnote, 并且有回复的话，显示左侧的连线。
       */}
      {isSubNote && hasReply && <div className="note-sub-line absolute -bottom-2 top-6 left-9 border-l-2" />}
      {isSubNote && onClose && (
        <Button
          className="note-close absolute top-18 left-9 -translate-x-1/2 rounded-full"
          onClick={onClose}
          variant="outline"
          size="icon-sm"
        >
          <FoldVerticalIcon />
        </Button>
      )}
    </div>
  );
};
