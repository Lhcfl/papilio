import clsx from 'clsx'
import { MkCustomEmoji, MkEmoji } from '../mk-emoji'

const NoteReaction = (props: { reaction: string, count: number, url?: string, meReacted?: boolean }) => {
  const { reaction, count, url, meReacted } = props
  const isCustomEmoji = reaction[0] === ':'
  const [name, host] = normalizeEmojiName(reaction)

  return (
    <div
      key={reaction}
      className={clsx('mk-note-reaction flex items-center border rounded-full px-2 py-1 text-sm', {
        'border-primary/30 bg-primary-foreground cursor-pointer': host == null,
        'border-primary/10': host != null,
        'border-tertiary bg-tertiary/10': meReacted,
      })}
    >
      {isCustomEmoji
        ? (
            <MkCustomEmoji name={name} host={host} url={url} fallbackToImage />
          )
        : (
            <MkEmoji emoji={name} className="h-[2em]" />
          )}
      <span className="ml-1 text-xs text-muted-foreground">{count}</span>
    </div>
  )
}

export const MkNoteReactions = (props: { note: NoteWithExtension }) => {
  const { note } = props
  let reactions = Object.entries(note.reactions)
  let myReaction = note.myReaction
  const { emojisMap } = useMisskeyGlobal()

  if (reactions.length === 0) {
    return null
  }

  // todo: make this configurable
  const mergeSiteReactions = true

  if (mergeSiteReactions) {
    const map = reactions.reduce((acc, [reaction, count]) => {
      const [normalizedName] = normalizeEmojiName(reaction)
      const emoji = emojisMap.get(normalizedName)
      if (emoji) {
        const name = `:${normalizedName}:`
        if (myReaction === reaction) {
          myReaction = name
        }
        acc[name] ||= 0
        acc[name] += count
      }
      else {
        acc[reaction] = count
      }
      return acc
    }, {} as Record<string, number>)
    reactions = Object.entries(map)
  }

  return (
    <div className="mk-note-reactions flex flex-wrap px-2 mt-2 gap-1">
      {reactions.sort(([, a], [, b]) => b - a).map(([reaction, count]) => (
        <NoteReaction key={reaction} reaction={reaction} count={count} url={note.reactionEmojis[reaction]} meReacted={myReaction === reaction} />
      ))}
    </div>
  )
}
