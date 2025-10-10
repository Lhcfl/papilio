import type { EmojiSimple } from 'misskey-js/entities.js'
import type { NoteUpdatedEvent } from 'misskey-js/streaming.types.js'
import { create } from 'zustand'
import type { NoteWithExtension } from '@/types/note'

type NoteSingleton = {
  notes: Record<string, NoteWithExtension>
  register: (...note: NoteWithExtension[]) => string[]
  unregister: (noteId: string) => void
  startListening: (meId?: string) => { dispose: () => void }
}

export const useNoteSingleton = create<NoteSingleton>((set) => {
  const stream = useMisskeyStream()
  const api = useMisskeyApi()

  return {
    notes: {},
    register: (...note: NoteWithExtension[]) => {
      set(state => ({
        notes: { ...state.notes, ...Object.fromEntries(note.map(n => [n.id, n])) },
      }))
      return note.map((n) => {
        stream.send('sr', { id: n.id })
        return n.id
      })
    },
    unregister: (noteId: string) => {
      set((state) => {
        const newNotes = { ...state.notes }
        delete newNotes[noteId]
        return { notes: newNotes }
      })
      stream.send('un', { id: noteId })
    },
    startListening: (meId?: string) => {
      if (import.meta.env.DEV) {
        console.log('[useNoteSingleton]: subscribing to noteUpdated')
      }

      async function onNoteUpdated({ type, id, body }: NoteUpdatedEvent) {
        switch (type) {
          // Sharkey have "replied"
          case 'replied' as never: {
            const { id } = body as unknown as { id: string }
            try {
              const note = await api.request('notes/show', { noteId: id })
              set(state => ({
                notes: Object.fromEntries(Object.entries(state.notes)
                  .map(([id, v]) => [id, v.id === note.replyId ? { ...v, repliesCount: v.repliesCount + 1 } : v])
                  .concat([[note.id, note]])),
              }))
            }
            catch {
              /* empty */
            }
            return
          }

          case 'reacted': return set((state) => {
            const note = state.notes[id]
            if (note == null) return {}
            const emoji = body.emoji as string | EmojiSimple | null

            if (typeof emoji === 'object' && emoji != null && 'url' in emoji) {
              note.reactionEmojis[emoji.name] = emoji.url
            }

            note.reactions[body.reaction] ??= 0
            note.reactions[body.reaction]++

            if (body.userId === meId) {
              note.myReaction = body.reaction
            }

            return { notes: { ...state.notes, [note.id]: note } }
          })

          case 'unreacted': return set((state) => {
            const note = state.notes[id]
            if (note == null) return {}
            note.reactions[body.reaction] ??= 1
            note.reactions[body.reaction]--
            if (note.reactions[body.reaction] === 0) {
              delete note.reactions[body.reaction]
            }

            if (body.userId === meId) {
              note.myReaction = null
            }

            return { notes: { ...state.notes, [note.id]: note } }
          })

          case 'pollVoted': return set((state) => {
            const note = state.notes[id]
            if (note == null) return {}
            // sharkey have poll
            const choice = (body as unknown as { choice: number }).choice
            if (choice == null) return {}

            const choices = [...(note.poll?.choices ?? [])]
            choices[choice] = {
              ...choices[choice],
              votes: choices[choice].votes + 1,
              ...(body.userId === meId
                ? {
                    isVoted: true,
                  }
                : {}),
            }

            note.poll!.choices = choices

            return { notes: { ...state.notes, [note.id]: note } }
          })

          case 'deleted': return set((state) => {
            const notes = { ...state.notes }
            delete notes[id]

            return { notes }
          })

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
          case 'updated' as never: return set((state) => {
            const note = state.notes[id]
            if (note == null) return {}
            return { notes: { ...state.notes, [note.id]: { ...note, ...(body as Partial<NoteWithExtension>) } } }
          })

          default: {
            console.log('unhandled noteUpdated event', { type, id, body })
            return {}
          }
        }
      }

      stream.on('noteUpdated', onNoteUpdated)

      return { dispose: () => {
        console.log('[useNoteSingleton]: unsubscribing from noteUpdated')
        stream.off('noteUpdated', onNoteUpdated)
      } }
    },
  }
})
