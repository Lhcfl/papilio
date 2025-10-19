/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { site, token } from '@/services/inject-misskey-api';
import { createStore, type UseStore } from 'idb-keyval';

let store = null as UseStore | null;

export const getCurrentUserIDBName = () => {
  let storeName = 'default';
  if (token == null) {
    storeName = `site:${site ?? 'NULL'}`;
  } else {
    storeName = `tok:${token.slice(0, 20)}`;
  }
  return storeName;
};

export const getCurrentUserSiteIDB = () => {
  if (store) return store;
  return (store = createStore(getCurrentUserIDBName(), 'keyval'));
};
