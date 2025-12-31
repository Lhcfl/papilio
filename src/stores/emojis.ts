/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { EmojiSimple } from 'misskey-js/entities.js';
import { createContext, use } from 'react';

interface EmojisState {
  emojis: EmojiSimple[];
  emojisMap: Map<string, EmojiSimple>;
}

export const EmojisContext = createContext<EmojisState>({ emojis: [], emojisMap: new Map() });

export function useEmojis<T>(selector: (s: EmojisState) => T): T {
  'use no memo';
  const emojisState = use(EmojisContext);
  return selector(emojisState);
}
