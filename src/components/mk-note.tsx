import clsx from 'clsx'
import { MkNoteActions } from './note/mk-note-actions'
import { MkNoteBody } from './note/mk-note-body'
import { MkNoteHeader } from './note/mk-note-header'
import { MkNoteReactions } from './note/mk-note-reactions'
import { MkNoteRenoteTip } from './note/mk-note-renote-tip'
import type { HTMLProps } from 'react'

export const MkNote = (props: {
  noteId: string
  /** SubNote 左边会空出来一块位置用来连线 */
  isSubNote?: boolean
  repliesComponent?: React.ReactNode
} & HTMLProps<HTMLDivElement>) => {
  const { noteId, isSubNote, className: classNameProps, ...divProps } = props
  const note = useNoteValue(noteId)
  const appearNote = useAppearNote(note)
  const { mutate: translate } = useTranslateAction(noteId)

  useDebugger('MkNote', noteId)

  if (note == null || appearNote == null) {
    return <div>[deleted]</div>
  }

  const hasReply = note.repliesCount > 0

  return (
    <div className={clsx('mk-note flex flex-col p-2 relative', classNameProps)} {...divProps}>
      {isPureRenote(note) && <MkNoteRenoteTip note={note} />}
      <MkNoteHeader note={appearNote} />
      <div className={clsx({ 'pl-12': isSubNote })}>
        <MkNoteBody note={appearNote} />
        <MkNoteReactions note={appearNote} />
        <MkNoteActions onTranslate={translate} note={appearNote} />
      </div>
      {/**
        * 回复树构造。
        * 对于每个 subnote, 并且有回复的话，显示左侧的连线。
        */}
      {isSubNote && hasReply && <div className="note-sub-line absolute -bottom-2 top-6 left-9 border-l-2" />}
      {props.repliesComponent}
    </div>
  )
}
