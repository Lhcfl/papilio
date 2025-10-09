import { createStore } from 'idb-keyval'

export const getCurrentUserSiteIDB = () => {
  const storeName = `site:${getUserSiteOrNull()}`
  const tokenName = `tok:${getUserTokenOrNull().slice(0, 20)}`

  return createStore(storeName, tokenName)
}
