import { CircleXIcon } from 'lucide-react'
import type { EmojisResponse } from 'misskey-js/entities.js'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { MisskeyGlobalContext } from '@/hooks/use-misskey-global'
import { PERSIST_GC_TIME } from '@/plugins/persister'
import { getUserSite, injectMisskeyApi } from '@/services/inject-misskey-api'

export const MisskeyGlobalProvider = (props: { children: React.ReactNode }) => {
  const api = injectMisskeyApi()
  const site = getUserSite()
  const { t } = useTranslation()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => api.request('i', {}),
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const emojisQuery = useQuery({
    queryKey: ['custom-emojis'],
    refetchInterval: 1000 * 60 * 60, // 1 hours
    queryFn: () => fetch(new URL('/api/emojis', api.origin)).then(r => r.json()) as Promise<EmojisResponse>,
    select: data => data.emojis,
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  const metaQuery = useQuery({
    queryKey: ['site-info'],
    queryFn: () => api.request('meta', {}),
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  /** Descriptions and Queries */
  const queries = [
    ['emoji', emojisQuery],
    ['site info', metaQuery],
    ['me', meQuery],
  ] as const

  if (queries.some(([, q]) => q.isError)) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleXIcon />
            </EmptyMedia>
            <EmptyTitle>{t('error')}</EmptyTitle>
            <EmptyDescription>
              <ul>
                {queries.map(
                  ([name, query]) =>
                    query.error && (
                      <li>
                        <b>
                          Loading
                          {name}
                          :
                          {' '}
                        </b>
                        <span>{query.error?.message}</span>
                      </li>
                    ),
                )}
              </ul>
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => window.location.reload()}>{t('reload')}</Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (queries.some(([, q]) => !q.data)) {
    return (
      <div className="w-screen h-screen">
        <div className="absolute w-screen h-screen flex justify-center items-center">
          <Spinner className="size-8" />
        </div>
        <ul className="font-mono text-sm p-4">
          <li>Booting Papilio...</li>
          {queries.map(([name, query]) => (
            <li key={name}>
              {query.isLoading
                ? (
                    <span className="text-yellow-500">[LOADING]</span>
                  )
                : (
                    <span className="text-green-500">[OK]</span>
                  )}
&nbsp;
              {name}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const emojis = emojisQuery.data!
  const emojisMap = new Map(emojis.map(e => [e.name, e]))

  // all loaded
  return (
    <MisskeyGlobalContext.Provider
      value={{
        site,
        emojis,
        emojisMap,
        meta: metaQuery.data!,
        me: meQuery.data!,
      }}
    >
      {props.children}
    </MisskeyGlobalContext.Provider>
  )
}
