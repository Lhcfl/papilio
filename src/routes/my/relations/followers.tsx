/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useUserFollowersInfiniteQuery } from '@/hooks/use-user';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { CommonRouteComponent } from '@/routes/my/relations/-common';
import { useMe } from '@/stores/me';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
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
      icon={() => <ArrowLeftIcon className="size-4" />}
      bulkableAction={async (userId: string) => {
        await misskeyApi('following/invalidate', { userId });
      }}
      actionName={t('breakFollow')}
    />
  );
}
