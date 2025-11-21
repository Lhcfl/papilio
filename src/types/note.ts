/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Note } from 'misskey-js/entities.js';
import type { Note as SharkeyNote } from '@@/sharkey-js/entities.js';
import type { Merge } from '@/types/utils';

export type NoteWithExtension = Omit<
  Merge<Note, SharkeyNote> & {
    /** frontend extension. Mark a note as deleted */
    isDeleted?: boolean;
    /** frontend extension. Mark a note as syncing */
    'papi:isSyncing:notes/state'?: boolean;
  },
  'reply' | 'renote'
>;
