import { getUserTokenOrNull, injectCurrentSiteOrNull } from '@/services/inject-misskey-api';
import { createStore, type UseStore } from 'idb-keyval';

let store = null as UseStore | null;

export const getCurrentUserSiteIDB = () => {
  if (store) return store;
  const site = injectCurrentSiteOrNull();
  const token = getUserTokenOrNull();
  let storeName = 'default';
  if (token === 'NULL') {
    storeName = `site:${site}`;
  }
  storeName = `tok:${token.slice(0, 20)}`;

  return (store = createStore(storeName, 'keyval'));
};
