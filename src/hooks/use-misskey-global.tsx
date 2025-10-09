import type { EmojiSimple, MeDetailed, MetaLite } from 'misskey-js/entities.js'
import { createContext } from 'react'

export type MisskeyGlobalContextType = {
  site: string
  emojis: EmojiSimple[]
  emojisMap: Map<string, EmojiSimple>
  meta: MetaLite
  me: MeDetailed
}

export const MisskeyGlobalContext = createContext<MisskeyGlobalContextType | null>(null)

export const useMisskeyGlobal = () => useContext(MisskeyGlobalContext)!
