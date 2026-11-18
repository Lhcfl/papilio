/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
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

  return text;
};
