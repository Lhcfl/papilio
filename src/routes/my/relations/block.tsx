/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { CommonRouteComponent } from '@/routes/my/relations/-common';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { BanIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/relations/block')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const query = useInfiniteQuery({
    queryKey: ['blocking/list'],
    queryFn: ({ pageParam }) =>
      misskeyApi('blocking/list', {
        limit: 90,
        untilId: pageParam,
      }).then((res) =>
        res.map((item) => ({
          id: item.id,
          user: item.blockee,
          createdAt: item.createdAt,
        })),
      ),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  return (
    <CommonRouteComponent
      query={query}
      icon={() => <BanIcon className="size-4" />}
      bulkableAction={async (userId: string) => {
        await misskeyApi('blocking/delete', { userId });
      }}
      actionName={t('unblock')}
    />
  );
}
