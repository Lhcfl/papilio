/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Note, NoteDraft } from 'misskey-js/entities.js';

export const getNoteExcerpt = (note: Note | NoteDraft) => {
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
  if (note.renote) {
    text += 'RT: ' + getNoteExcerpt(note.renote);
    text += '\n\n';
  }
  if (note.reply) {
    text += 'RE: ' + getNoteExcerpt(note.reply);
    text += '\n\n';
  }

  return text;
};
