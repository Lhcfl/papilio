import { api, Stream } from 'misskey-js'

let apiClient: api.APIClient | null = null

export const injectMisskeyApi = () => {
  if (apiClient) {
    return apiClient
  }
  const origin = getUserSite()
  const credential = getUserToken()
  return (apiClient = new api.APIClient({ origin, credential }))
}

let stream: Stream | null = null

export const injectMisskeyStream = () => {
  if (stream) {
    return stream
  }
  const origin = getUserSite()
  const token = getUserToken()
  return (stream = new Stream(origin, { token }))
}

export const storeUserSite = (site: string) => {
  localStorage.setItem('site', site)
}

export const getUserSiteOrNull = (): string => {
  return localStorage.getItem('site') || 'NULL'
}

export const getUserTokenOrNull = (): string => {
  return localStorage.getItem('token') || 'NULL'
}

export const getUserSite = (): string => {
  const site = localStorage.getItem('site')
  if (!site) {
    throw new Error('Site is not set')
  }
  return site
}

const getUserToken = (): string => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token is not set')
  }
  return token
}

export const storeUserToken = (token: string) => {
  localStorage.setItem('token', token)
}
