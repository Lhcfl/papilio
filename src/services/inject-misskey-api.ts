import { Stream, api } from 'misskey-js';

let apiClient: api.APIClient | null = null;

export const injectMisskeyApi = () => {
  if (apiClient) {
    return apiClient;
  }
  const origin = injectCurrentSite();
  const credential = getUserToken();
  return (apiClient = new api.APIClient({ origin, credential }));
};

let stream: Stream | null = null;

export const injectMisskeyStream = () => {
  if (stream) {
    return stream;
  }
  const origin = injectCurrentSite();
  const token = getUserToken();
  stream = new Stream(origin, { token });
  setInterval(() => {
    stream!.heartbeat();
  }, 10000);
  return stream;
};

export const storeUserSite = (site: string) => {
  localStorage.setItem('site', site);
};

export const injectCurrentSiteOrNull = (): string => {
  return injectCurrentSite() || 'NULL';
};

export const getUserTokenOrNull = (): string => {
  return injectUserToken() || 'NULL';
};

let token: string | null;

export const injectUserToken = (): string | null => {
  if (token) {
    return token;
  }
  token = localStorage.getItem('token');
  return token;
};

let site: string | null;

export const injectCurrentSite = (): string => {
  if (site) {
    return site;
  }
  site = localStorage.getItem('site');
  if (!site) {
    throw new Error('Site is not set');
  }
  return site;
};

const getUserToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token is not set');
  }
  return token;
};

export const storeUserToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getRelativeUrl = (href: string) => new URL(href, injectCurrentSite()).toString();
