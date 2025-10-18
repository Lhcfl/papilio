/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { EmojiSimple } from 'misskey-js/entities.js';
import { create } from 'zustand';

interface EmojisState {
  emojis: EmojiSimple[];
  emojisMap: Map<string, EmojiSimple>;
  setEmojis: (emojis: EmojiSimple[]) => void;
}

export const useEmojis = create<EmojisState>((set) => ({
  emojis: [],
  emojisMap: new Map(),
  setEmojis: (emojis) => {
    set({
      emojis,
      emojisMap: new Map(emojis.map((e) => [e.name, e])),
    });
  },
}));
