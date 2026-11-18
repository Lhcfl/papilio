/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkMfm } from '@/components/mk-mfm';
import { getNoteExcerpt } from '@/lib/note-excerpt';
import type { NoteWithExtension } from '@/types/note';
import { QuoteIcon, ReplyIcon } from 'lucide-react';
import type { NoteDraft } from 'misskey-js/entities.js';

export function MkNoteExcerpt({ note }: { note: NoteWithExtension | NoteDraft }) {
  return (
    <span>
      {note.replyId && <ReplyIcon className="size-[1em] inline mr-1" />}
      {note.renoteId && <QuoteIcon className="size-[1em] inline mr-1" />}
      <MkMfm text={getNoteExcerpt(note)} author={note.user} emojiUrls={'emojis' in note ? note.emojis : {}} inline />
    </span>
  );
}
