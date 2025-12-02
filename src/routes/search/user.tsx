/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkUserCardSmall } from '@/components/mk-user-card-small';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAcctUserQueryOptions, getUserQueryOptions } from '@/hooks/user';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryAtom } from '@/routes/search/-atoms';
import type { UserDetailed } from '@/types/user';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { GlobeIcon, GlobeLockIcon, MapPinIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const query = useAtomValue(queryAtom);
  const [origin, setOrigin] = useState<'local' | 'combined' | 'remote'>('combined');

  const q = useInfiniteQuery({
    queryKey: ['search/users', query, origin],
    queryFn: ({ pageParam, client }) =>
      misskeyApi('users/search', {
        query,
        offset: pageParam,
        detail: true,
        origin,
      }).then((ret) => {
        const users = ret as UserDetailed[];
        users.forEach((u) => {
          client.setQueryData(getAcctUserQueryOptions(u).queryKey, u);
          client.setQueryData(getUserQueryOptions(u.id).queryKey, u);
        });
        return users;
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.reduce((a, b) => a + b.length, 0);
    },
    enabled: query.trim() !== '',
  });

  return (
    <Tabs
      className="@container"
      value={origin}
      onValueChange={(v) => {
        setOrigin(v as typeof origin);
      }}
    >
      <TabsList className="mt-2">
        <TabsTrigger value="combined">
          <GlobeIcon /> {t('all')}
        </TabsTrigger>
        <TabsTrigger value="local">
          <MapPinIcon /> {t('local')}
        </TabsTrigger>
        <TabsTrigger value="remote">
          <GlobeLockIcon /> {t('remote')}
        </TabsTrigger>
      </TabsList>
      {query != '' && (
        <div className="search-result">
          <Separator />
          <div className="search-result-label text-muted-foreground p-2 text-sm">{t('searchResult')}</div>
          <MkInfiniteScrollByData infiniteQueryResult={q} containerClassName="grid @xl:grid-cols-2 gap-2">
            {(u) => <MkUserCardSmall user={u} className="rounded-md border" />}
          </MkInfiniteScrollByData>
        </div>
      )}
    </Tabs>
  );
}
