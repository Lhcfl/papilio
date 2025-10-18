/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect } from 'react';
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import type { EmojiSimple, Note } from 'misskey-js/entities.js';
import type { NoteUpdatedEvent } from 'misskey-js/streaming.types.js';
import type { NoteWithExtension } from '@/types/note';
import { injectMisskeyApi, injectMisskeyStream } from '@/services/inject-misskey-api';
import { useMe } from '@/stores/me';
import { isPureRenote } from 'misskey-js/note.js';

const flatten = (notes: (NoteWithExtension & Note)[]): NoteWithExtension[] =>
  notes.length == 0
    ? []
    : [
        ...flatten(notes.map((n) => n.reply).filter(Boolean) as Note[]),
        ...flatten(notes.map((n) => n.renote).filter(Boolean) as Note[]),
        ...notes,
      ];

class NoteSingletonManager {
  notes = new Map<string, ReturnType<typeof atom<NoteWithExtension>>>();
  global_null = atom<null>(null);

  register(notes: NoteWithExtension[]) {
    const stream = injectMisskeyStream();
    const ns = flatten(notes);
    const store = getDefaultStore();

    for (const n of ns) {
      const old = this.notes.get(n.id);
      if (old) {
        store.set(old, n);
      } else {
        const a = atom(n);
        stream.send('sr', { id: n.id });

        if (import.meta.env.DEV) {
          console.log('[NoteSingletonManager]: subscribed:', n.id);
        }

        this.notes.set(n.id, a);
      }
    }
  }

  patch(noteId: string, patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>)) {
    const store = getDefaultStore();
    const a = this.notes.get(noteId);
    if (!a) return;
    store.set(a, (old) => ({ ...old, ...(typeof patch === 'function' ? patch(old) : patch) }));
  }

  unregister(noteId: string) {
    const stream = injectMisskeyStream();
    const store = getDefaultStore();
    const a = this.notes.get(noteId);
    if (!a) return;
    if (import.meta.env.DEV) {
      console.log('[NoteSingletonManager]: unsubscribed:', noteId);
    }
    stream.send('un', { id: noteId });
    store.set(a, (old) => ({ ...old, isDeleted: true }));
    this.notes.delete(noteId);
  }
}

const GlobalNoteSingletonManager = new NoteSingletonManager();

export function registerNote(notes: NoteWithExtension[]) {
  GlobalNoteSingletonManager.register(notes);
  return notes.map((n) => n.id);
}

export function patchNote(
  noteId: string,
  patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>),
) {
  GlobalNoteSingletonManager.patch(noteId, patch);
}

export function useNoteUpdateListener() {
  const meId = useMe((me) => me.id);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[NoteUpdateListener]: subscribing to noteUpdated');
    }

    const api = injectMisskeyApi();
    const stream = injectMisskeyStream();

    async function onNoteUpdated({ type, id, body }: NoteUpdatedEvent) {
      if (import.meta.env.DEV) {
        console.log('[NoteUpdateListener]: noteUpdated', { type, id, body });
      }
      switch (type) {
        // Sharkey have "replied"
        case 'replied' as never: {
          const { id } = body as unknown as { id: string };
          try {
            const note = await api.request('notes/show', { noteId: id });
            // SAFETY: the note is a reply, so it must have replyId
            GlobalNoteSingletonManager.patch(note.replyId!, (note) => ({ repliesCount: note.repliesCount + 1 }));
            GlobalNoteSingletonManager.register([note]);
          } catch {
            /* empty */
          }
          return;
        }

        case 'reacted': {
          GlobalNoteSingletonManager.patch(id, (note) => {
            const emoji = body.emoji as string | EmojiSimple | null;
            const updates: Partial<NoteWithExtension> = {};

            if (typeof emoji === 'object' && emoji != null && 'url' in emoji) {
              updates.reactionEmojis = { ...note.reactionEmojis, [emoji.name]: emoji.url };
            }

            updates.reactions = { ...note.reactions, [body.reaction]: (note.reactions[body.reaction] ?? 0) + 1 };

            if (body.userId === meId) {
              updates.myReaction = body.reaction;
            }

            return updates;
          });
          return;
        }

        case 'unreacted': {
          GlobalNoteSingletonManager.patch(id, (note) => {
            const updates: Partial<NoteWithExtension> = {};

            updates.reactions = Object.fromEntries(
              Object.entries(note.reactions)
                .map(([name, count]) => {
                  if (name === body.reaction) {
                    return [name, Math.max(0, count - 1)] as const;
                  } else {
                    return [name, count] as const;
                  }
                })
                .filter(([, count]) => count > 0),
            );

            if (body.userId === meId) {
              updates.myReaction = null;
            }

            return updates;
          });
          return;
        }

        case 'pollVoted': {
          GlobalNoteSingletonManager.patch(id, (note) => {
            // sharkey have poll
            const poll = note.poll;
            const choice = (body as unknown as { choice: number | null }).choice;
            if (choice == null) return {};
            if (poll == null) return {};

            const choices = [...poll.choices];

            choices[choice] = {
              ...choices[choice],
              votes: choices[choice].votes + 1,
              ...(body.userId === meId
                ? {
                    isVoted: true,
                  }
                : {}),
            };

            return { poll: { ...poll, choices } };
          });
          return;
        }

        case 'deleted': {
          GlobalNoteSingletonManager.unregister(id);
          return;
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
          GlobalNoteSingletonManager.patch(id, body as Partial<NoteWithExtension>);
          return;
        }

        default: {
          console.log('unhandled noteUpdated event', { type, id, body });
          return {};
        }
      }
    }

    stream.on('noteUpdated', onNoteUpdated);

    return () => {
      console.log('[NoteUpdateListener]: unsubscribing from noteUpdated');
      stream.off('noteUpdated', onNoteUpdated);
    };
  }, [meId]);
}

export const useNoteValue = (noteId: string | null | undefined) => {
  const a = noteId == null ? GlobalNoteSingletonManager.global_null : GlobalNoteSingletonManager.notes.get(noteId);
  return useAtomValue(a ?? GlobalNoteSingletonManager.global_null);
};

export const useAppearNote = (note: NoteWithExtension | null) => {
  const a =
    note == null
      ? null
      : isPureRenote(note)
        ? GlobalNoteSingletonManager.notes.get(note.renoteId)
        : GlobalNoteSingletonManager.notes.get(note.id);

  return useAtomValue(a ?? GlobalNoteSingletonManager.global_null);
};

//   type NoteSingleton = {
//   notes: Record<string, NoteWithExtension | undefined>
//   register: (...note: NoteWithExtension[]) => string[]
//   unregister: (noteId: string) => void
//   patch: (
//     noteId: string,
//     patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>),
//   ) => void
// }

// export const NoteUpdateListener = create<NoteSingleton>((set) => {
//   const stream = injectMisskeyStream()

//   return {
//     notes: {},
//     register: (...notes: NoteWithExtension[]) => {
//       const ns = flatten(notes)

//       set(state => ({
//         notes: {
//           ...state.notes,
//           ...Object.fromEntries(ns.map(n => [n.id, n])),
//         },
//       }))

//       if (import.meta.env.DEV) {
//         console.log(
//           '[NoteUpdateListener]: subscribed:',
//           ns.map(n => n.id),
//         )
//       }

//       for (const n of ns) {
//         stream.send('sr', { id: n.id })
//       }

//       return notes.map(n => n.id)
//     },

//     unregister: (noteId: string) => {
//       set((state) => {
//         const newNotes = { ...state.notes }
//         delete newNotes[noteId]
//         return { notes: newNotes }
//       })
//       stream.send('un', { id: noteId })
//     },

//     patch: (
//       noteId: string,
//       patch: Partial<NoteWithExtension> | ((note: NoteWithExtension) => Partial<NoteWithExtension>),
//     ) =>
//       set((state) => {
//         const note = state.notes[noteId]
//         if (note == null) return {}
//         return {
//           notes: { ...state.notes, [noteId]: { ...note, ...(typeof patch === 'function' ? patch(note) : patch) } },
//         }
//       }),
//   }
// })
