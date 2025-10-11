import clsx from 'clsx'
import { MkNoteActions } from './note/mk-note-actions'
import { MkNoteBody } from './note/mk-note-body'
import { MkNoteHeader } from './note/mk-note-header'
import { MkNoteReactions } from './note/mk-note-reactions'
import { MkNoteRenoteTip } from './note/mk-note-renote-tip'
import type { HTMLProps } from 'react'

export const MkNote = (props: { noteId: string, isSubNote?: boolean } & HTMLProps<HTMLDivElement>) => {
  const { noteId, isSubNote, className: classNameProps, ...divProps } = props
  const note = useNoteValue(noteId)
  const appearNote = useAppearNote(note)
  const { mutate: translate } = useTranslateAction(noteId)

  useDebugger('MkNote', noteId)

  if (note == null || appearNote == null) {
    return <div>[deleted]</div>
  }

  const pureRenote = isPureRenote(note)

  return (
    <div className={clsx('mk-note flex flex-col p-2 relative', classNameProps)} {...divProps}>
      {pureRenote && <MkNoteRenoteTip note={note} />}
      <MkNoteHeader note={appearNote} />
      <div className={clsx({ 'pl-12': isSubNote })}>
        <MkNoteBody note={appearNote} />
        <MkNoteReactions note={appearNote} />
        <MkNoteActions onTranslate={translate} note={appearNote} />
      </div>
      {isSubNote && <div className="note-sub-line absolute -bottom-2 top-6 left-9 border" />}
    </div>
  )
}
