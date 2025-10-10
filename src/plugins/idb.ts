import { createStore } from 'idb-keyval'

export const getCurrentUserSiteIDB = () => {
  const storeName = `site:${injectCurrentSiteOrNull()}`
  const tokenName = `tok:${getUserTokenOrNull().slice(0, 20)}`

  return createStore(storeName, tokenName)
}
