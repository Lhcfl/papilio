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
import { MkNoteMergedRenoteTip } from '@/components/note/mk-note-merged-renote-tip';

/**
 * MkNote component representing a Misskey note with various features.\
 * Supports displaying replies, renotes, reactions, and actions.\
 */
export const MkNote = (
  props: {
    /** Note ID */
    noteId: string;
    /** SubNote 左边会空出来一块位置用来连线 */
    isSubNote?: boolean;
    /** Decoration component at the bottom right of the note */
    decorationBottomRight?: React.ReactNode;
    /**
     * Control the initial appearance of the replied, can be 'subNote', 'inline', or null
     * - When `null`, it follows the global setting
     * - When set to `'subNote'`, the reply will be shown as a sub-note initially
     * - When set to `'inline'`, the reply will be shown as a collapsed line initially
     * @default null
     */
    initialReplyAppearance?: 'subNote' | 'inline' | null;
    /**
     * Shows the merged renote IDs in the note's {@link MkNoteMergedRenoteTip} component
     */
    mergedRenoteIds?: string[];
    /**
     * Control whether to show the replied note
     * - When false, the replied note will not be shown
     * @default true
     */
    showReply?: boolean;
    /**
     * Control whether to hide the reply icon in the note body
     * @default false
     */
    hideReplyIcon?: boolean;
    /**
     * Control whether to show detailed {@linkcode MkNoteBody} content
     * When true, it will show full content without collapsing
     * @default false
     */
    detailed?: boolean;
    /**
     * Control whether the note shows a line indicating it has replies
     * If the note has visible replies or this prop is true, the line will be shown
     * @default undefined
     */
    hasReply?: boolean;
    /**
     * When it's not `undefined`, it will add a fold button to the note
     * Callback when the note is closed (only for sub-notes)
     */
    onClose?: () => void;
  } & HTMLProps<HTMLDivElement>,
) => {
  const {
    noteId,
    isSubNote,
    showReply = true,
    mergedRenoteIds,
    initialReplyAppearance = null,
    onClose,
    detailed,
    hideReplyIcon = false,
    className: classNameProps,
    decorationBottomRight,
    hasReply,
    ...divProps
  } = props;

  const note = useNoteValue(noteId);
  const appearNote = useAppearNote(note);
  const { mutate: translate } = useTranslateAction(appearNote?.id ?? '');
  const collapseNotesRepliedTo = usePreference((p) => p.collapseNotesRepliedTo);
  const [manualReplyAppearance, setReplyAppearance] = useState(initialReplyAppearance);
  const replyAppearance = manualReplyAppearance ?? (collapseNotesRepliedTo ? 'inline' : 'subNote');

  if (note == null || appearNote == null) {
    return null;
  }

  const hasReplyMerged = (note['papi:visibleRepliesCount'] ?? 0) > 0 || hasReply;

  return (
    <MkMuteableNote
      note={note.id == appearNote.id ? null : note}
      appearNote={appearNote}
      className={clsx('mk-note relative flex flex-col p-2', classNameProps)}
      bypassMuteCheck={detailed}
      {...divProps}
    >
      {mergedRenoteIds != null && mergedRenoteIds.length > 0 && <MkNoteMergedRenoteTip noteIds={mergedRenoteIds} />}
      {appearNote.id != note.id && <MkNoteRenoteTip note={note} />}
      {showReply && replyAppearance === 'subNote' && appearNote.replyId != null && (
        <MkNote
          noteId={appearNote.replyId}
          isSubNote={true}
          className="reply-note -m-2"
          showReply={collapseNotesRepliedTo}
          hasReply={true}
          initialReplyAppearance={initialReplyAppearance}
          onClose={() => {
            setReplyAppearance('inline');
          }}
        />
      )}
      {showReply && replyAppearance === 'inline' && appearNote.replyId != null && (
        <MkNoteReplyLine
          noteId={appearNote.replyId}
          onExpand={() => {
            setReplyAppearance('subNote');
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
      {isSubNote && hasReplyMerged && <div className="note-sub-line absolute top-6 -bottom-2 left-9 border-l-2" />}
    </MkMuteableNote>
  );
};
