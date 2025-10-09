import type { Note } from 'misskey-js/entities.js'

export type NoteWithExtension = Note & {
  /** Sharkey extension. Mark a note as renoted */
  isRenoted?: boolean
}
