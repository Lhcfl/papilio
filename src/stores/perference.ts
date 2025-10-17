import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const defaultPerference = {
  theme: 'light' as 'light' | 'dark',
};

type PropSetters<T> = Record<
  `set${Capitalize<string & keyof T>}`,
  (updater: T[keyof T] | ((prev: T[keyof T]) => T[keyof T])) => void
>;

type Perference = PropSetters<typeof defaultPerference> & typeof defaultPerference;

export const usePerference = create<Perference>()(
  persist(
    (set) => {
      function setKey<K extends keyof typeof defaultPerference>(
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
        (Object.keys(defaultPerference) as (keyof typeof defaultPerference)[]).map(
          <K extends keyof typeof defaultPerference>(key: K) => [
            `set${key.charAt(0).toUpperCase() + key.slice(1)}`,
            (v: Perference[K] | ((prev: Perference[K]) => Perference[K])) => {
              setKey(key, v);
            },
          ],
        ),
      ) as PropSetters<typeof defaultPerference>;

      return {
        ...defaultPerference,
        ...setters,
      };
    },
    {
      name: 'perference',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key, value]) =>
              key in defaultPerference && defaultPerference[key as keyof typeof defaultPerference] !== value,
          ),
        ),
    },
  ),
);
