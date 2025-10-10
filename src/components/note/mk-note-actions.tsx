import { HeartIcon, MinusIcon, MoreHorizontalIcon, QuoteIcon, RepeatIcon, ReplyIcon, SmilePlusIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Spinner } from '../ui/spinner'
import { MkNoteMenu } from './mk-note-menu'

const MkNoteActionButton = (
  props: {
    icon: React.ReactNode
    count?: number
    loading?: boolean
    disabled?: boolean
    className?: string
    onClick?: () => void
  } & ComponentProps<typeof Button>,
) => {
  const { loading, icon, count = 0, ...rest } = props
  return (
    <Button variant="ghost" size={count > 0 ? 'default' : 'icon'} disabled={props.disabled || props.loading} {...rest}>
      {loading ? <Spinner /> : icon}
      {count > 0 && <span className="ml-1 text-sm">{count}</span>}
    </Button>
  )
}

export const MkNoteActions = (props: { note: NoteWithExtension }) => {
  const { note } = props

  const isRenoted = note.isRenoted

  const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id)
  const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id)
  const { mutate: like, isPending: isLiking } = useLikeNoteAction(note.id)
  const { mutate: unreact, isPending: isUnReacting } = useUndoReactNoteAction(note.id)

  return (
    <div className="mk-note-actions p-2">
      <MkNoteActionButton
        icon={<ReplyIcon />}
        count={note.repliesCount}
        disabled={false}
        loading={false}
        onClick={() => console.log('implement reply')}
      />
      {isRenoted
        ? (
            <MkNoteActionButton
              className="text-tertiary hover:bg-tertiary/10"
              icon={<RepeatIcon />}
              count={note.renoteCount}
              loading={isUnrenoting}
              onClick={() => unrenote()}
            />
          )
        : (
            <MkNoteActionButton
              icon={<RepeatIcon />}
              count={note.renoteCount}
              disabled={note.visibility !== 'public' && note.visibility !== 'home'}
              loading={isRenoting}
              onClick={() => renote(props.note.visibility as 'public' | 'home')}
            />
          )}
      <MkNoteActionButton icon={<QuoteIcon />} onClick={() => console.log('implement quote')} />
      {
        note.myReaction == null
          ? (
              <>
                <MkNoteActionButton icon={<HeartIcon />} onClick={() => like()} loading={isLiking} />
                <MkNoteActionButton
                  count={note.reactionCount}
                  icon={<SmilePlusIcon />}
                  onClick={() => console.log('implement smile')}
                  loading={isLiking}
                />
              </>
            )
          : (
              <MkNoteActionButton icon={<MinusIcon />} onClick={() => unreact()} loading={isUnReacting} />
            )
      }

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MkNoteActionButton icon={<MoreHorizontalIcon />} />
        </DropdownMenuTrigger>
        <MkNoteMenu note={note} />
      </DropdownMenu>
    </div>
  )
}
