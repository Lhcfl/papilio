/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkTime } from '@/components/mk-time';
import { INITIAL_UNTIL_ID, misskeyApi } from '@/lib/inject-misskey-api';
import { CommonRouteComponent } from '@/routes/my/relations/-common';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { VolumeOffIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/relations/mute')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const query = useInfiniteQuery({
    queryKey: ['mute/list'],
    queryFn: ({ pageParam }) =>
      misskeyApi('mute/list', {
        limit: 90,
        untilId: pageParam,
      }).then((res) =>
        res.map((item) => ({
          id: item.id,
          user: item.mutee,
          createdAt: item.createdAt,
          expiresAt: item.expiresAt,
        })),
      ),
    initialPageParam: INITIAL_UNTIL_ID,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.id,
  });

  return (
    <CommonRouteComponent
      query={query}
      icon={(props) => (
        <span className="flex items-center gap-1">
          <VolumeOffIcon className="size-4" />
          <MkTime time={props.item.expiresAt} colored={false} />
        </span>
      )}
      bulkableAction={async (userId: string) => {
        await misskeyApi('mute/delete', { userId });
      }}
      actionName={t('unmute')}
    />
  );
}
