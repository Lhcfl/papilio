/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AllSettings } from '@/settings';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DefaultSettings } from '@/settings';

export function setterName<K extends string>(key: K): `set${Capitalize<K>}` {
  return `set${key.charAt(0).toUpperCase() + key.slice(1)}` as `set${Capitalize<K>}`;
}

type PropSetters<T> = Record<
  `set${Capitalize<string & keyof T>}`,
  (updater: T[keyof T] | ((prev: T[keyof T]) => T[keyof T])) => void
>;

type Perference = PropSetters<AllSettings> & AllSettings;

export const usePreference = create<Perference>()(
  persist(
    (set) => {
      function setKey<K extends keyof AllSettings>(
        key: K,
        updater: Perference[K] | ((prev: Perference[K]) => Perference[K]),
      ) {
        if (typeof updater === 'function') {
          set((state) => ({ [key]: updater(state[key]) }));
        } else {
          set({ [key]: updater });
        }
      }

      const setters = Object.fromEntries(
        (Object.keys(DefaultSettings) as (keyof AllSettings)[]).map(<K extends keyof AllSettings>(key: K) => [
          setterName(key),
          (v: Perference[K] | ((prev: Perference[K]) => Perference[K])) => {
            setKey(key, v);
          },
        ]),
      ) as PropSetters<AllSettings>;

      return {
        ...DefaultSettings,
        ...setters,
      };
    },
    {
      name: 'perference',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key, value]) => key in DefaultSettings && DefaultSettings[key as keyof AllSettings] !== value,
          ),
        ),
    },
  ),
);
