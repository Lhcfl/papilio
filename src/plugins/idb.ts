import { getUserTokenOrNull, injectCurrentSiteOrNull } from '@/services/inject-misskey-api';
import { createStore, type UseStore } from 'idb-keyval';

let store = null as UseStore | null;

export const getCurrentUserSiteIDB = () => {
  if (store) return store;

  const storeName = `site:${injectCurrentSiteOrNull()}`;
  const tokenName = `tok:${getUserTokenOrNull().slice(0, 20)}`;

  return (store = createStore(storeName, tokenName));
};
