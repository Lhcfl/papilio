/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MeDetailed } from 'misskey-js/entities.js';
import { create } from 'zustand';

interface MeState {
  me: null | MeDetailed;
  setMe: (user: MeDetailed | null) => void;
}

export const useSetableMe = create<MeState>((set) => ({
  me: null,
  setMe: (user) => {
    set({ me: user });
  },
}));

export function useMe(): MeDetailed;
export function useMe<T>(selector: (m: MeDetailed) => T): T | undefined;
export function useMe<T>(selector?: (m: MeDetailed) => T) {
  return useSetableMe((s) => {
    const me = s.me;
    if (me == null) return undefined;
    return selector ? selector(me) : me;
  });
}
