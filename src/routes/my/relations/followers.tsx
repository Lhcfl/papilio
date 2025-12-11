/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useUserFollowersInfiniteQuery } from '@/hooks/user';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { CommonRouteComponent } from '@/routes/my/relations/-common';
import { useMe } from '@/stores/me';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeftIcon, ArrowLeftRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/relations/followers')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const meId = useMe((me) => me.id)!;
  const query = useUserFollowersInfiniteQuery(meId);

  return (
    <CommonRouteComponent
      query={query}
      icon={({ item }) =>
        item.user.isFollowing ? (
          <ArrowLeftRightIcon className="size-4 text-green-700 dark:text-green-300" />
        ) : (
          <ArrowLeftIcon className="size-4" />
        )
      }
      bulkableAction={async (userId: string) => {
        await misskeyApi('following/invalidate', { userId });
      }}
      actionName={t('breakFollow')}
    />
  );
}
