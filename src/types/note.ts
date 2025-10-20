/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Note } from 'misskey-js/entities.js';
import type { Note as SharkeyNote } from '@@/sharkey-js/entities.js';

export type NoteWithExtension = Omit<
  Note &
    Partial<Omit<SharkeyNote, keyof Note>> & {
      /** frontend extension. Mark a note as deleted */
      isDeleted?: boolean;
      /** frontend extension. Mark a note as syncing */
      'papi:isSyncing:notes/state'?: boolean;
    },
  'reply' | 'renote'
>;
