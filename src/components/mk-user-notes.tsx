import { registerNote } from '@/hooks/use-note';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MkError } from './mk-error';
import { MkNote } from './mk-note';
import { LoadingTrigger } from './loading-trigger';
import { Spinner } from './ui/spinner';
import { useTranslation } from 'react-i18next';
import { PinIcon } from 'lucide-react';

export const MkUserNotes = (props: { userId: string; pinnedNotes?: string[] }) => {
  const api = injectMisskeyApi();
  const { userId, pinnedNotes = [] } = props;
  const { t } = useTranslation();

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['user-notes', userId],
    queryFn: ({ pageParam }) =>
      api
        .request('users/notes', {
          userId,
          untilId: pageParam,
          limit: 30,
        })
        .then((ns) => registerNote(ns)),
    getNextPageParam: (lastPage) => lastPage.at(-1),
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialPageParam: 'zzzzzzzzzzzzzzzzz',
  });

  return (
    <div className="mk-user-notes w-full">
      {pinnedNotes.map((id) => (
        <div key={id}>
          <div className="text-sm text-tertiary px-4 -mb-2 flex gap-2 items-center">
            <PinIcon className="size-4" />
            {t('pinnedNote')}
          </div>
          <MkNote noteId={id} showReply />
        </div>
      ))}
      {pinnedNotes.length > 0 && <div className="mt-4" />}
      {data?.pages.flatMap((page) => page.map((id) => <MkNote key={id} noteId={id} showReply />))}
      {error && <MkError error={error} />}
      {(hasNextPage || isFetchingNextPage || isFetching) && (
        <div className="w-full flex justify-center my-4">
          <LoadingTrigger onShow={fetchNextPage}>
            <Spinner />
          </LoadingTrigger>
        </div>
      )}
    </div>
  );
};
