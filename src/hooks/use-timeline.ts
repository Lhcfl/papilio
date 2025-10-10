import { useInfiniteQuery } from '@tanstack/react-query'

const TIMELINE_PAGE_SIZE = 30

export type TimelineTypes = 'home' | 'global' | 'local' | 'hybrid'

export const useTimeline = (type: TimelineTypes) => {
  const api = injectMisskeyApi()
  const stream = injectMisskeyStream()
  const queryClient = useQueryClient()
  const register = useNoteSingleton(s => s.register)
  const queryKey = ['timeline', type]

  const channelName = `${type}Timeline` as const

  useEffect(() => {
    console.log(`subscribing to channel ${channelName}`)
    const channel = stream.useChannel(channelName)
    channel.on('note', (note) => {
      console.log('new note received', note)
      const [id] = register(note)

      queryClient.setQueryData(queryKey, (data: (typeof query)['data']) => {
        console.log(data)
        const [page0, ...other] = data?.pages || [[]]
        const newPages = page0.length >= TIMELINE_PAGE_SIZE
          ? [[id], page0]
          : [[id, ...page0]]

        return data
          ? {
              pageParams: data.pageParams,
              pages: [...newPages, ...other],
            }
          : data
      })
    })
    return () => {
      if (import.meta.env.DEV) {
        console.log(`channel ${channelName} disposed`)
      }
      channel.dispose()
    }
  })

  const fetcher = ({ pageParam }: { pageParam?: string }) => {
    switch (type) {
      case 'home':
        return api.request('notes/timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        })
      case 'global':
        return api.request('notes/global-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        })
      case 'local':
        return api.request('notes/local-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        })
      case 'hybrid':
        return api.request('notes/hybrid-timeline', {
          limit: TIMELINE_PAGE_SIZE,
          untilId: pageParam,
        })
    }
  }

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const notes = await fetcher({ pageParam })
      return register(...notes)
    },
    getNextPageParam: lastPage => lastPage.at(-1),
    initialPageParam: 'zzzzzzzzzzzzzzzzzzzzzzzz',
    staleTime: Number.POSITIVE_INFINITY,
  })

  return query
}

export const useHomeTimeline = () => useTimeline('home')
export const useGlobalTimeline = () => useTimeline('global')
