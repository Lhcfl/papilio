/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as IDB from 'idb-keyval';
import { getCurrentUserSiteIDB } from '@/plugins/idb';
import type { EmojiSimple } from 'misskey-js/entities.js';

interface RecentEmojiStore {
  emojis: (string | EmojiSimple)[];
  pushEmoji: (emoji: string | EmojiSimple) => void;
  prependEmoji: (emoji: string | EmojiSimple) => void;
}

function emojiEq(a: string | EmojiSimple, b: string | EmojiSimple) {
  if (typeof a === 'string' && typeof b === 'string') {
    return a === b;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    return a.name === b.name;
  }
  return false;
}

export const useRecentEmojis = create<RecentEmojiStore>()(
  persist(
    (set) => ({
      emojis: [],
      pushEmoji: (emoji) =>
        set((state) => ({
          emojis: [emoji, ...state.emojis.filter((e) => !emojiEq(e, emoji))].slice(0, 50),
        })),
      prependEmoji: (emoji) =>
        set((state) => ({
          emojis: [emoji, ...state.emojis.filter((e) => !emojiEq(e, emoji))].slice(0, 50),
        })),
    }),
    {
      name: 'recent-emojis',
      storage: createJSONStorage(() => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getItem: (k) => IDB.get(k, getCurrentUserSiteIDB()).then((v) => v ?? null),
        setItem: (k, v) => IDB.set(k, v, getCurrentUserSiteIDB()),
        removeItem: (k) => IDB.del(k, getCurrentUserSiteIDB()),
      })),
    },
  ),
);
