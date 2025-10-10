import type { EmojiSimple } from 'misskey-js/entities.js'
import { create } from 'zustand'
import type { NoteWithExtension } from '@/types/note'

type NoteSingleton = {
  notes: Record<string, NoteWithExtension>
  register: (...note: NoteWithExtension[]) => string[]
  unregister: (noteId: string) => void
  startListening: (meId?: string) => () => void
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

      stream.on('noteUpdated', ({ type, id, body }) => set((state) => {
        const note = state.notes[id]
        if (note == null) return {}
        switch (type) {
          // fix sharkey

          // case 'replied' as any: {

          //   try {
          //     // notes/show may throw if the current user can't see the note
          //     const replyNote = await account.api.request('notes/show', {
          //       noteId: (body as unknown as { id: string }).id,
          //     })

          //     cached(replyNote)
          //   }
          //   catch {
          //     /* empty */
          //   }
          //   break
          // }

          case 'reacted': {
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
          }

          case 'unreacted': {
            note.reactions[body.reaction] ??= 1
            note.reactions[body.reaction]--
            if (note.reactions[body.reaction] === 0) {
              delete note.reactions[body.reaction]
            }

            if (body.userId === meId) {
              note.myReaction = null
            }

            return { notes: { ...state.notes, [note.id]: note } }
          }

          case 'pollVoted': {
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
          }

          case 'deleted': {
            const notes = { ...state.notes }
            delete notes[note.id]

            return { notes }
          }

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
          case 'updated' as never: {
            return { notes: { ...state.notes, [note.id]: { ...note, ...(body as Partial<NoteWithExtension>) } } }
          }

          default: {
            console.log('unhandled noteUpdated event', { type, id, body })
            return {}
          }
        }
      }))

      return () => {
        console.log('[useNoteSingleton]: unsubscribing from noteUpdated')
        stream.off('noteUpdated')
      }
    },
  }
})
