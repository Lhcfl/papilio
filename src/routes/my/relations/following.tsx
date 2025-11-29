/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useUserFollowingsInfiniteQuery } from '@/hooks/user';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { CommonRouteComponent } from '@/routes/my/relations/-common';
import { useMe } from '@/stores/me';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/relations/following')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const meId = useMe((me) => me.id)!;
  const query = useUserFollowingsInfiniteQuery(meId);

  return (
    <CommonRouteComponent
      query={query}
      icon={() => <ArrowRightIcon className="size-4" />}
      bulkableAction={async (userId: string) => {
        await misskeyApi('following/delete', { userId });
      }}
      actionName={t('unfollow')}
    />
  );
}
