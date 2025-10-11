import { MkNoteActions } from './note/mk-note-actions'
import { MkNoteBody } from './note/mk-note-body'
import { MkNoteHeader } from './note/mk-note-header'
import { MkNoteReactions } from './note/mk-note-reactions'
import { MkNoteRenoteTip } from './note/mk-note-renote-tip'

export const MkNote = (props: { noteId: string }) => {
  const note = useNoteSingleton(s => s.notes[props.noteId])
  const appearNote = useAppearNote(props.noteId)

  useDebugger('MkNote', props.noteId)

  if (note == null || appearNote == null) {
    return <div>[deleted]</div>
  }

  const pureRenote = isPureRenote(note)

  function translate() {
    console.log('implement translate')
  }

  return (
    <div className="mk-note flex flex-col p-2">
      {pureRenote && <MkNoteRenoteTip note={note} />}
      <MkNoteHeader note={appearNote} />
      <MkNoteBody note={appearNote} />
      <MkNoteReactions note={appearNote} />
      <MkNoteActions onTranslate={translate} note={appearNote} />
    </div>
  )
}
