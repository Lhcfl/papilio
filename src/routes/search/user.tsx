/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll, MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkUserCard } from '@/components/mk-user-card';
import { MkUserCardSmall } from '@/components/mk-user-card-small';
import { getAcctUserQueryOptions, getUserQueryOptions } from '@/hooks/user';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryAtom } from '@/routes/search/-atoms';
import type { UserDetailed } from '@/types/user';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search/user')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const query = useAtomValue(queryAtom);

  const q = useInfiniteQuery({
    queryKey: ['search/users', query],
    queryFn: ({ pageParam, client }) =>
      misskeyApi('users/search', {
        query,
        offset: pageParam,
        detail: true,
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
    <div className="@container">
      {query != '' && (
        <MkInfiniteScrollByData infiniteQueryResult={q} containerClassName="grid @xl:grid-cols-2 gap-2">
          {(u) => <MkUserCardSmall user={u} className="rounded-md border" />}
        </MkInfiniteScrollByData>
      )}
    </div>
  );
}
