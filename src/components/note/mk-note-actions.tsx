import { HeartIcon, MinusIcon, MoreHorizontalIcon, QuoteIcon, RepeatIcon, ReplyIcon, SmilePlusIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Spinner } from '../ui/spinner'
import { MkNoteMenu } from './mk-note-menu'
import { MkEmojiPickerPopup } from '../mk-emoji-picker-popup'

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

export const MkNoteActions = (props: { note: NoteWithExtension, onTranslate: () => void }) => {
  const { note, onTranslate } = props
  const { t } = useTranslation()

  const isRenoted = note.isRenoted

  const { mutate: renote, isPending: isRenoting } = useRenoteAction(note.id)
  const { mutate: unrenote, isPending: isUnrenoting } = useUnrenoteAction(note.id)
  const { mutate: like, isPending: isReacting } = useLikeNoteAction(note.id)
  const { mutate: unreact, isPending: isUnReacting } = useUndoReactNoteAction(note.id)
  const { mutate: react } = useReactNoteAction(note.id)

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
              onClick={() => unrenote(void null, {
                onSuccess: () => toast.success(t('unrenote')),
              })}
            />
          )
        : (
            <MkNoteActionButton
              icon={<RepeatIcon />}
              count={note.renoteCount}
              disabled={note.visibility !== 'public' && note.visibility !== 'home'}
              loading={isRenoting}
              onClick={() =>
                renote(props.note.visibility as 'public' | 'home', {
                  onSuccess: () => toast.success(t('renoted')),
                })}
            />
          )}
      <MkNoteActionButton icon={<QuoteIcon />} onClick={() => console.log('implement quote')} />
      {note.myReaction == null
        ? (
            <>
              <MkNoteActionButton icon={<HeartIcon />} onClick={() => like()} loading={isReacting} />
              <MkEmojiPickerPopup onEmojiChoose={emoji => react(`:${emoji.name}:`)} autoClose>
                <MkNoteActionButton
                  count={note.reactionCount}
                  icon={<SmilePlusIcon />}
                  loading={isReacting}
                />
              </MkEmojiPickerPopup>
            </>
          )
        : (
            <MkNoteActionButton icon={<MinusIcon />} onClick={() => unreact()} loading={isUnReacting} />
          )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MkNoteActionButton icon={<MoreHorizontalIcon />} />
        </DropdownMenuTrigger>
        <MkNoteMenu onTranslate={onTranslate} note={note} />
      </DropdownMenu>
    </div>
  )
}
