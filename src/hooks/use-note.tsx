import type { EmojiSimple, Note } from 'misskey-js/entities.js'
import type { NoteUpdatedEvent } from 'misskey-js/streaming.types.js'
import { create } from 'zustand'
import type { NoteWithExtension } from '@/types/note'

type NoteSingleton = {
  notes: Record<string, NoteWithExtension | undefined>
  register: (...note: NoteWithExtension[]) => string[]
  unregister: (noteId: string) => void
  patch: (noteId: string, patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>)) => void
}

const flatten = (notes: (NoteWithExtension & Note)[]): NoteWithExtension[] => notes.length == 0
  ? []
  : [
      ...flatten(notes.map(n => n.reply).filter(Boolean) as Note[]),
      ...flatten(notes.map(n => n.renote).filter(Boolean) as Note[]),
      ...notes,
    ]

export const useNoteSingleton = create<NoteSingleton>((set) => {
  const stream = injectMisskeyStream()

  return {
    notes: {},
    register: (...notes: NoteWithExtension[]) => {
      const ns = flatten(notes)

      set(state => ({
        notes: {
          ...state.notes,
          ...Object.fromEntries(ns.map(n => [n.id, n])),
        },
      }))

      if (import.meta.env.DEV) {
        console.log('[useNoteSingleton]: subscribed:', ns.map(n => n.id))
      }

      for (const n of ns) {
        stream.send('sr', { id: n.id })
      }

      return notes.map(n => n.id)
    },
    unregister: (noteId: string) => {
      set((state) => {
        const newNotes = { ...state.notes }
        delete newNotes[noteId]
        return { notes: newNotes }
      })
      stream.send('un', { id: noteId })
    },
    patch: (noteId: string, patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>)) => set((state) => {
      const note = state.notes[noteId]
      if (note == null) return {}
      return { notes: { ...state.notes, [noteId]: { ...note, ...(typeof patch === 'function' ? patch(note) : patch) } } }
    }),
  }
})

export function useNoteUpdateListener() {
  const api = injectMisskeyApi()
  const stream = injectMisskeyStream()
  const patch = useNoteSingleton(s => s.patch)
  const register = useNoteSingleton(s => s.register)
  const unregister = useNoteSingleton(s => s.unregister)
  const meId = useMe(me => me.id)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[useNoteSingleton]: subscribing to noteUpdated')
    }

    async function onNoteUpdated({ type, id, body }: NoteUpdatedEvent) {
      if (import.meta.env.DEV) {
        console.log('[useNoteSingleton]: noteUpdated', { type, id, body })
      }
      switch (type) {
        // Sharkey have "replied"
        case 'replied' as never: {
          const { id } = body as unknown as { id: string }
          try {
            const note = await api.request('notes/show', { noteId: id })
            // SAFETY: the note is a reply, so it must have replyId
            patch(note.replyId!, note => ({ repliesCount: note.repliesCount + 1 }))
            register(note)
          }
          catch {
            /* empty */
          }
          return
        }

        case 'reacted': return patch(id, (note) => {
          const emoji = body.emoji as string | EmojiSimple | null
          const updates: Partial<NoteWithExtension> = {}

          if (typeof emoji === 'object' && emoji != null && 'url' in emoji) {
            updates.reactionEmojis = { ...note.reactionEmojis, [emoji.name]: emoji.url }
          }

          updates.reactions = { ...note.reactions, [body.reaction]: (note.reactions[body.reaction] ?? 0) + 1 }

          if (body.userId === meId) {
            updates.myReaction = body.reaction
          }

          return updates
        })

        case 'unreacted': return patch(id, (note) => {
          const updates: Partial<NoteWithExtension> = {}

          updates.reactions = Object.fromEntries(Object.entries(note.reactions).map(([name, count]) => {
            if (name === body.reaction) {
              return [name, Math.max(0, count - 1)] as const
            }
            else {
              return [name, count] as const
            }
          }).filter(([, count]) => count > 0))

          if (body.userId === meId) {
            updates.myReaction = null
          }

          return updates
        })

        case 'pollVoted': return patch(id, (note) => {
          // sharkey have poll
          const poll = note.poll
          const choice = (body as unknown as { choice: number }).choice
          if (choice == null) return {}
          if (poll == null) return {}

          const choices = [...(poll.choices ?? [])]

          choices[choice] = {
            ...choices[choice],
            votes: choices[choice].votes + 1,
            ...(body.userId === meId
              ? {
                  isVoted: true,
                }
              : {}),
          }

          return { poll: { ...poll, choices } }
        })

        case 'deleted': return unregister(id)

          // fix sharkey stelpolva
          // case 'madePrivate' as any: {
          //   if (meId === note.value.userId) {
          //     note.value.visibility = 'specified'
          //   }
          //   else {
          //     // perform delete
          //     note.value.isDeleted = true
          //     deleteNote(
          //       note.value.id,
          //       note.value.userId === meId && isPureRenote(note.value),
          //     )
          //   }
          //   break
          // }

          // fix sharkey
        case 'updated' as never: return patch(id, body as Partial<NoteWithExtension>)

        default: {
          console.log('unhandled noteUpdated event', { type, id, body })
          return {}
        }
      }
    }

    stream.on('noteUpdated', onNoteUpdated)

    return () => {
      console.log('[useNoteSingleton]: unsubscribing from noteUpdated')
      stream.off('noteUpdated', onNoteUpdated)
    }
  }, [api, meId, patch, register, stream, unregister])
}

export const useAppearNote = (noteId: string) => useNoteSingleton((s) => {
  const note = s.notes[noteId]
  if (!note) return undefined
  if (isPureRenote(note)) {
    return s.notes[note.renoteId]
  }
  return note
})
