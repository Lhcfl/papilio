import { LoadingTrigger } from '@/components/loading-trigger';
import { MkAnnouncement } from '@/components/mk-announcement';
import { MkError } from '@/components/mk-error';
import { Spinner } from '@/components/ui/spinner';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CalendarCheckIcon, HourglassIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/announcements')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <DefaultLayout
      tabs={[
        {
          value: 'current' as const,
          label: t('currentAnnouncements'),
          icon: <HourglassIcon />,
          comp: <Announcements value="current" />,
        },
        {
          value: 'previous' as const,
          label: t('pastAnnouncements'),
          icon: <CalendarCheckIcon />,
          comp: <Announcements value="previous" />,
        },
      ]}
    />
  );
}

function Announcements(props: { value: 'current' | 'previous' }) {
  const { data, isFetchingNextPage, isPending, fetchNextPage, hasNextPage, error, refetch } = useInfiniteQuery({
    queryKey: ['announcements', props.value],
    queryFn: ({ pageParam }) =>
      misskeyApi('announcements', { untilId: pageParam, isActive: props.value === 'current' }),
    initialPageParam: 'zzzzzzzzzzzz',
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  return (
    <div>
      {error && <MkError error={error} retry={() => refetch()} />}
      <div className="flex flex-col gap-2">
        {data?.pages.flat().map((a) => (
          <MkAnnouncement key={a.id} item={a} />
        ))}
      </div>
      <LoadingTrigger onShow={() => hasNextPage && fetchNextPage()} />
      {(isPending || isFetchingNextPage) && (
        <div className="w-full p-3 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
