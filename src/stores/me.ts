import type { MeDetailed } from 'misskey-js/entities.js'
import { create } from 'zustand'

type MeState = {
  me: null | MeDetailed
  setMe: (user: MeDetailed | null) => void
}

export const useMe = create<MeState>(set => ({
  me: null,
  setMe: user => set({ me: user }),
}))
