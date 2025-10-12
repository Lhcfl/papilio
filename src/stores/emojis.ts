import type { EmojiSimple } from 'misskey-js/entities.js';
import { create } from 'zustand';

type EmojisState = {
  emojis: EmojiSimple[];
  emojisMap: Map<string, EmojiSimple>;
  setEmojis: (emojis: EmojiSimple[]) => void;
};

export const useEmojis = create<EmojisState>((set) => ({
  emojis: [],
  emojisMap: new Map(),
  setEmojis: (emojis) =>
    set({
      emojis,
      emojisMap: new Map(emojis.map((e) => [e.name, e])),
    }),
}));
