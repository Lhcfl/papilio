import { MkNotification } from './mk-notification'

const fetcher = (untilId: string) => injectMisskeyApi().request('i/notifications-grouped', {
  untilId,
  limit: 30,
}).then(ns => ns.map((n) => {
  if ('note' in n) {
    registerNote(n.note)
  }
  return n
}))

export type FetchedNotification = Awaited<ReturnType<typeof fetcher>>[number]

export const MkNotifications = () => {
  const { data } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => fetcher(pageParam),
    initialPageParam: 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam: lastPage => lastPage.at(-1)?.id,
  })

  const notifications = data?.pages.flat()

  return (
    <div>
      {notifications?.map(n => (
        <MkNotification key={n.id} notification={n} />
      ))}
    </div>
  )
}
