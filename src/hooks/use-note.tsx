/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect } from 'react';
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import type { EmojiSimple, Note } from 'misskey-js/entities.js';
import type { NoteUpdatedEvent } from 'misskey-js/streaming.types.js';
import type { NoteWithExtension } from '@/types/note';
import { injectMisskeyStream, misskeyApi } from '@/services/inject-misskey-api';
import { useMe } from '@/stores/me';
import { isPureRenote } from 'misskey-js/note.js';

const flatten = (notes: NoteWithExtension[]): NoteWithExtension[] =>
  notes.length == 0
    ? []
    : [
        ...flatten(notes.map((n) => (n as Note).reply).filter(Boolean) as NoteWithExtension[]),
        ...flatten(notes.map((n) => (n as Note).renote).filter(Boolean) as NoteWithExtension[]),
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
      console.log('[NoteUpdateListener]: 🟢 subscribing to noteUpdated');
    }
    const stream = injectMisskeyStream();

    function onNoteUpdated({ type, id, body }: NoteUpdatedEvent) {
      if (import.meta.env.DEV) {
        console.log(`[NoteUpdateListener]: ${type} -> ${id}`, body);
      }
      document.dispatchEvent(new CustomEvent(`papi:NoteUpdated/${id}`, { detail: { type, body } }));
      switch (type) {
        // Sharkey have "replied"
        case 'replied' as never: {
          // this id is the reply's id
          const { id } = body as unknown as { id: string };
          markAsChanged(id); // notes/show will return the replied note's reply count, which will update the replied note's state
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
          console.log('[NoteUpdateListener] ❌ unhandled noteUpdated event', { type, id, body });
          return {};
        }
      }
    }

    stream.on('noteUpdated', onNoteUpdated);

    return () => {
      console.log('[NoteUpdateListener]: 🔴 unsubscribing from noteUpdated');
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
      : isPureRenote(note as Note)
        ? GlobalNoteSingletonManager.notes.get(note.renoteId!)
        : GlobalNoteSingletonManager.notes.get(note.id);

  return useAtomValue(a ?? GlobalNoteSingletonManager.global_null);
};

/**
 * Due to network issues, or known bugs (e.g. renoting in users page won't trigger timeline.note event)
 * Sometimes the main channel may miss some updates, causing the note state to be inconsist.
 *
 * This function will setup a fallback listener to re-fetch the note after 2 seconds,
 * unless the main channel notifies an update before that.
 *
 * Please call this function in mutation hooks that may cause note state changes.
 * @param noteId Note ID
 */
export const markAsChanged = (noteId: string) => {
  const timeout = setTimeout(() => {
    if (import.meta.env.DEV) {
      console.log(`[NoteUpdate]: ♻️ re-fetching note ${noteId} due to timeout`);
    }
    void misskeyApi('notes/show', { noteId }).then((note) => {
      registerNote([note]);
    });
  }, 2000);

  document.addEventListener(
    `papi:NoteUpdated/${noteId}`,
    () => {
      clearTimeout(timeout);
    },
    {
      once: true,
    },
  );
};

// Debugging utilities
if (import.meta.env.DEV) {
  const w = window as unknown as Record<string, unknown>;
  w.getDefaultAtomStore = getDefaultStore;
  w.getNoteDataById = (noteId: string) => {
    const atom = GlobalNoteSingletonManager.notes.get(noteId);
    if (!atom) return 'no such atom';
    return getDefaultStore().get(atom);
  };
}
