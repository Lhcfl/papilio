/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderRightPortal } from '@/components/header-portal';
import { MkTime } from '@/components/mk-time';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { listlistQueryOptions } from '@/hooks/list';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryClient } from '@/plugins/persister';
import { useMe } from '@/stores/me';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { GlobeIcon, LockIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/lists/')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(listlistQueryOptions()),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { data, refetch, isRefetching } = useSuspenseQuery(listlistQueryOptions());
  const userEachUserListsLimit = useMe((me) => me.policies.userEachUserListsLimit);

  return (
    <div>
      <PageTitle title={t('lists')} />
      <HeaderRightPortal>
        <Button variant="ghost" size="icon" title={t('reload')} onClick={() => refetch()}>
          <RefreshCwIcon className={isRefetching ? 'animate-spin' : undefined} />
        </Button>
      </HeaderRightPortal>
      <ItemGroup>
        {data.map((item) => (
          <Item key={item.id} asChild>
            <Link to="/my/lists/$id" params={{ id: item.id }}>
              <ItemContent>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription>
                  <span>
                    {t('createdAt')}: <MkTime time={item.createdAt} />
                  </span>
                  <span className="ml-2">
                    {item.userIds?.length ?? 0} / {userEachUserListsLimit} {t('users')}
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemMedia variant="icon">{item.isPublic ? <GlobeIcon /> : <LockIcon />}</ItemMedia>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
