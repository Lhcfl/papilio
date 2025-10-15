import { LoadingTrigger } from '@/components/loading-trigger';
import { MkError } from '@/components/mk-error';
import { MkNote } from '@/components/mk-note';
import { MkTime } from '@/components/mk-time';
import { Spinner } from '@/components/ui/spinner';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { StarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/favorites')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const { data, isFetchingNextPage, isPending, fetchNextPage, hasNextPage, error, refetch } = useInfiniteQuery({
    queryKey: ['favorites'],
    queryFn: ({ pageParam }) =>
      misskeyApi('i/favorites', { untilId: pageParam }).then((ns) => {
        registerNote(ns.map((x) => x.note));
        return ns;
      }),
    initialPageParam: 'zzzzzzzzzzzz',
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  return (
    <DefaultLayout title={t('favorites')}>
      <div>
        {error && <MkError error={error} retry={() => refetch()} />}
        {data?.pages.flat().map((n) => (
          <div key={n.id}>
            <div className="text-sm text-tertiary px-4 -mb-2 flex gap-2 items-center">
              <StarIcon className="size-4" />
              {t('favorited')} <MkTime time={n.createdAt} />
            </div>
            <MkNote noteId={n.noteId} />
          </div>
        ))}
        <LoadingTrigger onShow={() => hasNextPage && fetchNextPage()} />
        {(isPending || isFetchingNextPage) && (
          <div className="w-full p-3 flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
