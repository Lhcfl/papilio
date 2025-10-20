/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCurrentUserIDBName } from '@/plugins/idb';
import type { SwitchCaseResponseType as SkSwitchCaseResponseType } from '@@/sharkey-js/api.types';
import type { Endpoints, SkEndpoints, SwitchCaseResponseType } from '@/types/sharkey-api';
import { Stream, api, type Channels } from 'misskey-js';
import type { Connection } from 'misskey-js/streaming.js';

export const site = localStorage.getItem('site') ?? null;
export const token = localStorage.getItem('token') ?? null;

let apiClient: api.APIClient | null = null;

export type EndpointParamType<E extends keyof Endpoints> = Endpoints[E]['req'];

// to fix misskey-js typing issue
export function misskeyApi<E extends keyof Endpoints>(
  endpoint: E,
  params: Endpoints[E]['req'],
): Promise<SwitchCaseResponseType<E, Endpoints[E]['req']>> {
  return injectMisskeyApi().request(endpoint as never, params as never);
}

export const sharkeyApi = misskeyApi as <E extends keyof SkEndpoints>(
  endpoint: E,
  params: SkEndpoints[E]['req'],
) => Promise<SkSwitchCaseResponseType<E, SkEndpoints[E]['req']>>;

/**
 * Injects the Misskey API client.
 * only use for non-sharkey-api typed requests
 * @returns
 */
export const injectMisskeyApi = () => {
  if (apiClient) {
    return apiClient;
  }
  if (!site || !token) {
    throw new Error('Misskey API client is not initialized: site or token is missing');
  }
  apiClient = new api.APIClient({ origin: site, credential: token });
  return apiClient;
};

let stream: Stream | null = null;

export const injectMisskeyStream = () => {
  if (stream) {
    return stream;
  }
  stream = new Stream(site!, { token: token! });
  setInterval(() => {
    stream!.heartbeat();
  }, 10000);
  return stream;
};

/**
 * simpliy a wrapper of injectMisskeyStream().useChannel
 * `use[A-Z]\w*` name means a hook for react compiler, but this is not a hook.
 * we have to rename it so react compiler won't complain.
 * @param channel
 * @param params
 * @param name
 * @returns
 */
export function createStreamChannel<C extends keyof Channels>(
  channel: C,
  params?: Channels[C]['params'],
  name?: string,
): Connection<Channels[C]> {
  return injectMisskeyStream().useChannel(channel, params, name);
}

export const storeUserSite = (site: string) => {
  localStorage.setItem('site', site);
};

export const storeUserToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getRelativeUrl = (href: string) => new URL(href, site!).toString();

export const logout = () => {
  indexedDB.deleteDatabase(getCurrentUserIDBName());
  localStorage.removeItem('token');
  localStorage.removeItem('site');
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      window.location.reload();
      resolve();
    }, 1000),
  );
};

export const saveToAccountList = ({ token, site }: { token: string; site: string }) => {
  const saved_accounts = JSON.parse(localStorage.getItem('saved_accounts') ?? '[]') as {
    token: string;
    site: string;
  }[];
  const new_saved_accounts = [{ token, site }, ...saved_accounts.filter((x) => x.token != token)];
  localStorage.setItem('saved_accounts', JSON.stringify(new_saved_accounts));
  localStorage.setItem('token', token);
  localStorage.setItem('site', site);
};

export const getAccountList = (): { token: string; site: string }[] => {
  const ret = JSON.parse(localStorage.getItem('saved_accounts') ?? '[]') as {
    token: string;
    site: string;
  }[];

  if (token != null) {
    return [{ token, site: site! }, ...ret.filter((x) => x.token != token)];
  }
  return ret;
};
