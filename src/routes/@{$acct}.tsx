import { MkError } from '@/components/mk-error';
import { MkUserCard } from '@/components/mk-user-card';
import { Spinner } from '@/components/ui/spinner';
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
    queryFn: () => api.request('users/show', { username, host }),
  });

  const title = t('user');
  const pageTitle = user?.name || user?.username || title;

  return (
    <DefaultLayout title={t('user')} pageTitle={pageTitle}>
      <UserMain user={user} error={error} isPending={isPending} />
    </DefaultLayout>
  );
}

const UserMain = (props: { user: UserDetailed | undefined; error: Error | null; isPending: boolean }) => {
  const { user, error, isPending } = props;

  return (
    <div>
      {user && <MkUserCard user={user} className="-mt-2 -mx-2" />}
      {error && <MkError error={error} />}
      {isPending && <Spinner />}
    </div>
  );
};
