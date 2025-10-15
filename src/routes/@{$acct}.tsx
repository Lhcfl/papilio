import { MkAvatar } from '@/components/mk-avatar';
import { MkError } from '@/components/mk-error';
import { MkUserCard } from '@/components/mk-user-card';
import { MkUserCardSkeleton } from '@/components/mk-user-card-skeleton';
import { MkUserName } from '@/components/mk-user-name';
import { MkUserNotes } from '@/components/mk-user-notes';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { acct } from 'misskey-js';
import type { UserDetailed } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/@{$acct}')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username, host } = acct.parse(Route.useParams().acct);
  const { t } = useTranslation();
  const api = injectMisskeyApi();

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user', username, host],
    queryFn: () =>
      api.request('users/show', { username, host }).then((res) => {
        registerNote(res.pinnedNotes);
        res.pinnedNotes = [];
        return res;
      }),
  });

  const title = t('user');
  const pageTitle = user?.name ?? user?.username ?? title;

  return (
    <DefaultLayout
      title={t('user')}
      pageTitle={pageTitle}
      headerLeft={
        user && (
          <div className="flex gap-1 items-center">
            <MkAvatar user={user} avatarProps={{ className: 'size-6' }} />
            <MkUserName user={user} className="text-sm max-w-40 line-clamp-1" />
          </div>
        )
      }
    >
      <UserMain user={user} error={error} isPending={isPending} />
    </DefaultLayout>
  );
}

const UserMain = (props: { user: UserDetailed | undefined; error: Error | null; isPending: boolean }) => {
  const { user, error, isPending } = props;

  return (
    <div>
      {user && (
        <div>
          <MkUserCard user={user} className="-mt-2 -mx-2" />
          <MkUserNotes userId={user.id} pinnedNotes={user.pinnedNoteIds} />
        </div>
      )}
      {error && <MkError error={error} />}
      {isPending && <MkUserCardSkeleton />}
    </div>
  );
};
