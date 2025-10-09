import { MkNoteActions } from './note/mk-note-actions'
import { MkNoteBody } from './note/mk-note-body'
import { MkNoteHeader } from './note/mk-note-header'
import { MkNoteRenoteTip } from './note/mk-note-renote-tip'

export const MkNote = (props: { note: NoteWithExtension }) => {
  const appearNote = props.note.renote ?? props.note

  return (
    <div className="mk-note flex flex-col p-2">
      {props.note.renote && <MkNoteRenoteTip note={props.note} />}
      <MkNoteHeader note={appearNote} />
      <MkNoteBody note={appearNote} />
      <MkNoteActions note={appearNote} />
    </div>
  )
}
