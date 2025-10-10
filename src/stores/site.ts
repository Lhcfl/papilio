import type { MetaLite } from 'misskey-js/entities.js'
import { create } from 'zustand'

type SiteMetaState = {
  meta: MetaLite | null
  setMeta: (meta: MetaLite) => void
}

export const useSetableSiteMeta = create<SiteMetaState>(set => ({
  meta: null as null | MetaLite,
  setMeta: (meta: MetaLite | null) => set({ meta }),
}))

export const useSiteMeta = <T>(selector: (arg: MetaLite) => T) => useSetableSiteMeta((state) => {
  const meta = state.meta
  if (!meta) throw new Error('site meta is not set yet!')
  return selector(meta)
})
