/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkAvatar } from '@/components/mk-avatar';
import { MkUrl } from '@/components/mk-url';
import { MkUserCard } from '@/components/mk-user-card';
import { MkUserCardSkeleton } from '@/components/mk-user-card-skeleton';
import { MkUserName } from '@/components/mk-user-name';
import { MkUserNotes } from '@/components/mk-user-notes';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  BanIcon,
  ExternalLinkIcon,
  ImageIcon,
  NotebookIcon,
  RefreshCcw,
  ReplyAllIcon,
  VolumeOffIcon,
} from 'lucide-react';
import { acct } from 'misskey-js';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/layouts/sidebar-layout';
import { HeaderLeftPortal, HeaderRightPortal } from '@/components/header-portal';
import { queryClient } from '@/plugins/persister';
import { getAcctUserQueryOptions } from '@/hooks/use-user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/@{$acct}')({
  component: RouteComponent,
  loader: ({ params }) => {
    const { username, host } = acct.parse(params.acct);
    return queryClient.ensureQueryData(getAcctUserQueryOptions({ username, host }));
  },
  pendingComponent: () => <MkUserCardSkeleton />,
});

function RouteComponent() {
  const { username, host } = acct.parse(Route.useParams().acct);
  const { t } = useTranslation();
  const { data: user, refetch, isRefetching } = useSuspenseQuery(getAcctUserQueryOptions({ username, host }));
  const pageTitle = user.name ?? user.username;

  return (
    <div className="-mt-2">
      <PageTitle title="" pageTitle={pageTitle} />
      <HeaderLeftPortal>
        <div className="flex items-center gap-1">
          <MkAvatar user={user} avatarProps={{ className: 'size-6' }} />
          <MkUserName user={user} className="line-clamp-1 max-w-40 text-sm" />
        </div>
      </HeaderLeftPortal>
      <HeaderRightPortal>
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={isRefetching}
          className={cn(isRefetching && 'animate-spin')}
          onClick={() => {
            void refetch();
            void queryClient.invalidateQueries({
              predicate: (query) => query.queryKey[0] === 'users/notes' && query.queryKey[1] === user.id,
            });
          }}
        >
          <RefreshCcw />
        </Button>
      </HeaderRightPortal>
      <div className="-mx-2">
        {user.isSuspended && (
          <div className="flex items-center gap-2 bg-red-500 p-4 text-sm text-white">
            <BanIcon className="size-4 shrink-0" />
            {t('userSuspended')}
          </div>
        )}
        {user.isSilenced && (
          <div className="bg-muted flex items-center gap-2 p-4 text-sm">
            <VolumeOffIcon className="size-4 shrink-0" />
            {t('userSilenced')}
          </div>
        )}
        {user.host != null && (
          <div className="flex items-center gap-2 p-4 text-sm">
            <ExternalLinkIcon className="size-4 shrink-0" />
            <span>
              {t('remoteUserCaution')} <MkUrl url={user.url!}>{t('openRemoteProfile')}</MkUrl>
            </span>
          </div>
        )}
      </div>
      <MkUserCard user={user} className="-mx-2" />
      <Tabs defaultValue="notes">
        <TabsList className="w-full">
          <TabsTrigger value="notes">
            <NotebookIcon /> {t('notes')}
          </TabsTrigger>
          <TabsTrigger value="all">
            <ReplyAllIcon /> {t('all')}
          </TabsTrigger>
          <TabsTrigger value="withFiles">
            <ImageIcon /> {t('withFiles')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <MkUserNotes userId={user.id} pinnedNotes={user.pinnedNoteIds} />
        </TabsContent>
        <TabsContent value="all">
          <MkUserNotes
            userId={user.id}
            opts={{
              withChannelNotes: true,
              withRenotes: true,
              withReplies: true,
            }}
          />
        </TabsContent>
        <TabsContent value="withFiles">
          <MkUserNotes
            userId={user.id}
            opts={{
              withFiles: true,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
