import type { Note } from 'misskey-js/entities.js';

export type NoteWithExtension = Omit<
  Note & {
    /** Sharkey extension. Mark a note as renoted */
    isRenoted?: boolean;
    /** frontend extension. Mark a note as deleted */
    isDeleted?: boolean;
  },
  'reply' | 'renote'
>;
