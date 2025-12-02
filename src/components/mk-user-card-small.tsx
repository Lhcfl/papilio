/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkAvatar } from '@/components/mk-avatar';
import { MkMfm } from '@/components/mk-mfm';
import { MkUserName } from '@/components/mk-user-name';
import { MkUserBadges } from '@/components/user/mk-user-badges';
import { MkUserCardBanner } from '@/components/user/mk-user-card-banner';
import { MkUserCardButton } from '@/components/user/mk-user-card-button';
import { cn } from '@/lib/utils';
import type { UserDetailed } from '@/types/user';
import { Link } from '@tanstack/react-router';
import { acct } from 'misskey-js';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export function MkUserCardSmall({ user, className, ...props }: { user: UserDetailed } & HTMLProps<HTMLDivElement>) {
  const { t } = useTranslation();
  return (
    <div className={cn('mk-user-card-small relative flex flex-col overflow-hidden', className)} {...props}>
      <div className="absolute top-1 left-1 z-10">
        <MkUserBadges user={user} />
      </div>
      <div className="absolute top-1 right-1 z-10">
        <MkUserCardButton user={user} hideLabel size="icon-sm" />
      </div>
      <MkUserCardBanner
        url={user.bannerUrl}
        blurhash={user.bannerBlurhash}
        fallbackBlurHash={user.avatarBlurhash}
        className="h-24"
      />
      <div className="-mt-9 flex items-center gap-2 p-2">
        <MkAvatar user={user} disableHoverCard className="size-12" avatarProps={{ className: 'size-12 rounded-lg' }} />
        <Link to="/@{$acct}" params={{ acct: acct.toString(user) }} className="z-10 flex flex-col">
          <MkUserName
            user={user}
            className="line-clamp-1 overflow-hidden text-white text-shadow-black text-shadow-md"
          />
          <span className="text-xs">@{acct.toString(user)}</span>
        </Link>
      </div>
      <div className="grow px-2 pt-0">
        <div className="text-muted-foreground line-clamp-3 overflow-hidden text-sm">
          <MkMfm text={user.description ?? ''} />
        </div>
      </div>
      <div className="info p-2 pt-1 text-sm">
        <span className="mr-2">
          <span className="mr-1 font-bold">{user.notesCount}</span>
          <span>{t('notes')}</span>
        </span>
        <span className="mr-2">
          <span className="mr-1 font-bold">{user.followersCount}</span>
          <span>{t('followers')}</span>
        </span>
        <span>
          <span className="mr-1 font-bold">{user.followingCount}</span>
          <span>{t('following')}</span>
        </span>
      </div>
    </div>
  );
}
