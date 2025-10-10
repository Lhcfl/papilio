import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import type { DehydrateOptions } from '@tanstack/react-query'
import * as IDB from 'idb-keyval'
import { getCurrentUserSiteIDB } from './idb'

const PersisterIDB = getCurrentUserSiteIDB()

export const PERSIST_GC_TIME = 1000 * 60 * 60 * 24 // 24 hours

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchInterval: 1000 * 60 * 60, // 1 hour

    },
  },
})

export const localStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: key => IDB.get(key, PersisterIDB).then(obj => JSON.stringify(obj)),
    setItem: (key, value) => IDB.set(key, JSON.parse(value), PersisterIDB),
    removeItem: key => IDB.del(key, PersisterIDB),
  },
  key: 'query-persist',
})

export const dehydrateOptions: DehydrateOptions = {
  shouldDehydrateMutation: () => false,
  shouldDehydrateQuery: (query) => {
    if (import.meta.env.DEV) {
      if (query.gcTime >= PERSIST_GC_TIME) {
        console.log('[query] persisting:', query.queryKey)
      }
    }
    return query.gcTime >= PERSIST_GC_TIME // only persist queries with gcTime >= 24 hours
  },
}
