/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { justGiveMeTheNoteByIdWithoutReactivity } from '@/hooks/note';
import { usePreference } from '@/stores/perference';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { Note as MisskeyNote } from 'misskey-js/entities.js';
import { isPureRenote } from 'misskey-js/note.js';

export function MkNotes({
  query,
  className,
}: {
  query: UseInfiniteQueryResult<InfiniteData<string[]>>;
  className?: string;
}) {
  const smartTimeline = usePreference((s) => s.smartTimeline);

  return (
    <MkInfiniteScrollByData infiniteQueryResult={query} flatDepth={0} className={className}>
      {(xs) =>
        smartTimeline ? <ThreadedNotes notes={xs} /> : xs.map((noteId) => <MkNote key={noteId} noteId={noteId} />)
      }
    </MkInfiniteScrollByData>
  );
}

/**
 * This component groups notes that reply to each other into a single thread.
 *
 * Before:
 * ```
 * C <- D | B <- C | A <- B
 * ```
 * After:
 * ```
 * A <- B <- C <- D
 * ```
 *
 * And forked replies are shown as separate notes:
 *
 * Before:
 * ```
 * C <- D | C <- D2 | B <- C | A <- B
 * ```
 *
 * Bad: (this will occupy too much vertical space)
 * ```
 * A <- B <- C <- D | A <- B <- C <- D2
 * ```
 *
 * Good:
 * ```
 * A <- B <- C <- D | C <- D2
 * ```
 */
function ThreadedNotes({ notes }: { notes: string[] }) {
  const noteIdSet = new Set(notes);
  const repliedNoteIds = new Set<string>();
  const subNoteDisplayNoteIds = new Set<string>();
  const sameRenoteSet = new Map<string, string[]>();

  const processedNotes = notes.map((noteId) => {
    const note = justGiveMeTheNoteByIdWithoutReactivity(noteId);
    if (note == null) {
      return { noteId, hidden: true };
    }

    const replyId = note.replyId;
    if (replyId != null && noteIdSet.has(replyId)) {
      // if the note replies to another note that is also replied by another note in the set, skips it
      if (!repliedNoteIds.has(replyId)) {
        repliedNoteIds.add(replyId);
        subNoteDisplayNoteIds.add(noteId);
      }
    }

    const renoteId = note.renoteId;
    if (isPureRenote(note as MisskeyNote) && renoteId != null) {
      const existing = sameRenoteSet.get(renoteId);
      sameRenoteSet.set(renoteId, [...(existing ?? []), noteId]);
      if (existing == null) {
        // first time seeing this renote, keep it
        return { noteId: renoteId, hidden: false };
      } else {
        // already seen, hide it
        return { noteId, hidden: true };
      }
    }

    return { noteId, hidden: false };
  });

  return processedNotes.map(({ noteId, hidden }) => {
    if (hidden) {
      return null;
    }
    return (
      <MkNote
        key={noteId}
        noteId={noteId}
        mergedRenoteIds={sameRenoteSet.get(noteId)}
        initialReplyAppearance={subNoteDisplayNoteIds.has(noteId) ? 'subNote' : null}
      />
    );
  });
}
