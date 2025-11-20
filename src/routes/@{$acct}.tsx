/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkAvatar } from '@/components/mk-avatar';
import { MkError } from '@/components/mk-error';
import { MkUrl } from '@/components/mk-url';
import { MkUserCard } from '@/components/mk-user-card';
import { MkUserCardSkeleton } from '@/components/mk-user-card-skeleton';
import { MkUserName } from '@/components/mk-user-name';
import { MkUserNotes } from '@/components/mk-user-notes';
import { registerNote } from '@/hooks/use-note';
import { injectMisskeyApi } from '@/lib/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { BanIcon, ExternalLinkIcon, VolumeOffIcon } from 'lucide-react';
import { acct } from 'misskey-js';
import type { UserDetailed } from '@/types/user';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/layouts/sidebar-layout';
import { HeaderLeftPortal } from '@/components/header-portal';

export const Route = createFileRoute('/@{$acct}')({
  component: RouteComponent,
});

function RouteComponent() {
  const { username, host } = acct.parse(Route.useParams().acct);
  const { t } = useTranslation();

  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user', username, host],
    queryFn: () =>
      injectMisskeyApi()
        .request('users/show', { username, host })
        .then((res) => {
          registerNote(res.pinnedNotes);
          res.pinnedNotes = [];
          return res;
        }),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const title = t('user');
  const pageTitle = user?.name ?? user?.username ?? title;

  return (
    <>
      <PageTitle title="" pageTitle={pageTitle} />
      <HeaderLeftPortal>
        {user && (
          <div className="flex items-center gap-1">
            <MkAvatar user={user} avatarProps={{ className: 'size-6' }} />
            <MkUserName user={user} className="line-clamp-1 max-w-40 text-sm" />
          </div>
        )}
      </HeaderLeftPortal>
      <UserMain user={user} error={error} isPending={isPending} />
    </>
  );
}

const UserMain = (props: { user: UserDetailed | undefined; error: Error | null; isPending: boolean }) => {
  const { user, error, isPending } = props;
  const { t } = useTranslation();

  return (
    <div>
      {user && (
        <div className="-mt-2">
          <div className="-mx-2">
            {user.isSuspended && (
              <div className="flex items-center gap-2 bg-red-500 p-4 text-sm text-white">
                <BanIcon className="size-4 flex-shrink-0" />
                {t('userSuspended')}
              </div>
            )}
            {user.isSilenced && (
              <div className="bg-muted flex items-center gap-2 p-4 text-sm">
                <VolumeOffIcon className="size-4 flex-shrink-0" />
                {t('userSilenced')}
              </div>
            )}
            {user.host != null && (
              <div className="flex items-center gap-2 p-4 text-sm">
                <ExternalLinkIcon className="size-4 flex-shrink-0" />
                <span>
                  {t('remoteUserCaution')} <MkUrl url={user.url!}>{t('openRemoteProfile')}</MkUrl>
                </span>
              </div>
            )}
          </div>
          <MkUserCard user={user} className="-mx-2" />
          <MkUserNotes userId={user.id} pinnedNotes={user.pinnedNoteIds} />
        </div>
      )}
      {error && <MkError error={error} />}
      {isPending && <MkUserCardSkeleton />}
    </div>
  );
};
