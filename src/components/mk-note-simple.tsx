import type { NoteWithExtension } from '@/types/note'
import { MkNoteBody } from './note/mk-note-body'
import { MkNoteHeader } from './note/mk-note-header'

export const MkNoteSimple = (props: { note: NoteWithExtension }) => {
  return (
    <div className="mk-note-simple p-2">
      <MkNoteHeader note={props.note} />
      <MkNoteBody note={props.note} showReplyIcon stopQuote disableLinkPreview />
    </div>
  )
}
