/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderRightPortal } from '@/components/header-portal';
import { RelationInfinityLoader } from '@/components/relation/table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Progress } from '@/components/ui/progress';
import { useUserFollowersInfiniteQuery } from '@/hooks/use-user';
import { errorMessageSafe } from '@/lib/error';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { cn } from '@/lib/utils';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { useMe } from '@/stores/me';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCheckIcon, RefreshCw, UserMinus2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const Route = createFileRoute('/my/relations/followers')({
  component: RouteComponent,
});

function RouteComponent() {
  const meId = useMe((me) => me.id)!;
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [unfollowed, setUnfollowed] = useState<Set<string>>(() => new Set());
  const [hasStartedUnfollowing, setHasStartedUnfollowing] = useState(false);
  const query = useUserFollowersInfiniteQuery(meId);
  const { data, refetch, isRefetching } = query;

  async function unfollowSelected() {
    setHasStartedUnfollowing(true);
    for (const userId of selected) {
      try {
        await misskeyApi('following/invalidate', { userId });
      } catch (e) {
        toast.error(errorMessageSafe(e));
      }
      setUnfollowed((prev) => new Set(prev).add(userId));
    }
    setHasStartedUnfollowing(false);
    setSelected(new Set());
    await refetch();
    setUnfollowed(new Set());
  }

  const unfollowSelectedWithConfirm = useAfterConfirm(
    {
      title: 'Break Follow for Selected Users',
      description: `Are you sure you want to break follow ${selected.size} users?`,
      confirmText: t('unfollow'),
      variant: 'destructive',
    },
    () => void unfollowSelected(),
  );

  return (
    <div>
      <HeaderRightPortal>
        <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
          <RefreshCw className={cn(isRefetching && 'animate-spin')} />
        </Button>
      </HeaderRightPortal>

      {hasStartedUnfollowing && <Progress value={(unfollowed.size / selected.size) * 100} className="mb-2" />}
      <div className="controls mb-2 flex items-center justify-between">
        <div>
          <span>Selected {selected.size} users</span>
        </div>
        <ButtonGroup>
          <Button
            onClick={() => {
              setSelected(new Set(data?.pages.flat(2).map((item) => item.followerId)));
            }}
          >
            <CheckCheckIcon />
            {t('all')}
          </Button>

          <Button variant="destructive" onClick={() => unfollowSelectedWithConfirm()}>
            <UserMinus2Icon />
            {t('breakFollow')}
          </Button>
        </ButtonGroup>
      </div>

      <RelationInfinityLoader
        query={query}
        selected={selected}
        setSelected={setSelected}
        removed={unfollowed}
        kind="follower"
      />
    </div>
  );
}
