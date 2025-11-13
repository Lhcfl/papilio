/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { justGiveMeTheNoteByIdWithoutReactivity } from '@/hooks/use-note';
import type { NoteWithExtension } from '@/types/note';
import type { NoteDraft } from 'misskey-js/entities.js';

export const getNoteExcerpt = (note: NoteWithExtension | NoteDraft) => {
  let text = '';
  if (note.cw) {
    text += 'CW: ';
    text += note.cw;
    text += '\n\n';
  } else {
    if (note.text) {
      text += note.text;
      text += '\n\n';
    }
  }
  if (note.files?.length) {
    text += `(${note.files.length} files)`;
  }
  if (note.renoteId) {
    const renote = justGiveMeTheNoteByIdWithoutReactivity(note.renoteId);
    if (renote) {
      text += 'RT: ' + getNoteExcerpt(renote);
      text += '\n\n';
    }
  }
  if (note.replyId) {
    const reply = justGiveMeTheNoteByIdWithoutReactivity(note.replyId);
    if (reply) {
      text += 'RE: ' + getNoteExcerpt(reply);
      text += '\n\n';
    }
  }

  return text;
};
