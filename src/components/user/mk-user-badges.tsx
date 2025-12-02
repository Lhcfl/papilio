/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserDetailed } from '@/types/user';
import { useTranslation } from 'react-i18next';
import { BanIcon, CircleXIcon, UserRoundPlusIcon, UsersRoundIcon, VolumeOffIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ComponentProps } from 'react';

export function MkUserBadges({ user, ...props }: { user: UserDetailed } & ComponentProps<typeof Badge>) {
  const { t } = useTranslation();

  // isXXXed means you are XXXed by the user
  // isXXXing means you are XXXing the user
  // e.g. isBlocking means you are blocking the user
  const badges = [
    { condition: user.isFollowed && user.isFollowing, label: t('mutualFollow'), icon: UsersRoundIcon },
    { condition: user.isFollowed && !user.isFollowing, label: t('followsYou'), icon: UserRoundPlusIcon },
    { condition: user.isFollowing && !user.isFollowed, label: t('following'), icon: UserRoundPlusIcon },
    { condition: user.isBlocked, label: t('blockingYou'), icon: CircleXIcon },
    { condition: user.isBlocking, label: t('blocked'), icon: BanIcon },
    { condition: user.isMuted, label: t('mute'), icon: VolumeOffIcon },
  ];

  return badges.map((badge) => {
    if (!badge.condition) return null;
    return (
      <Badge key={badge.label} {...props}>
        <badge.icon />
        {badge.label}
      </Badge>
    );
  });
}
