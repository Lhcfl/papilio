import { Fragment } from 'react/jsx-runtime'
import { LoadingTrigger } from './loading-trigger'
import { MkNotification } from './mk-notification'
import { Spinner } from './ui/spinner'

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
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => fetcher(pageParam),
    initialPageParam: 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam: lastPage => lastPage.at(-1)?.id,
  })

  const notifications = data?.pages.flat()

  return (
    <div className="mk-notifications">
      {notifications?.map(n => (
        <Fragment key={n.id}>
          <MkNotification notification={n} />
          <hr className="w-[80%] m-auto" />
        </Fragment>
      ))}
      {isFetchingNextPage && <div className="w-full flex justify-center p-2"><Spinner /></div>}
      <LoadingTrigger className="w-full h-1" onShow={() => hasNextPage ? fetchNextPage() : undefined} />
    </div>
  )
}
