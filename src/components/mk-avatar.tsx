/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MkBlurHash } from '@/components/mk-blurhash';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { MkUserCard } from '@/components/mk-user-card';
import { useUserQuery } from '@/hooks/use-user';
import { MkUserCardSkeleton } from '@/components/mk-user-card-skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { acct } from 'misskey-js';

export const MkAvatar = (
  props: {
    user: User;
    avatarProps?: React.ComponentProps<typeof Avatar>;
    disableHoverCard?: boolean;
    disableRouteLink?: boolean;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { user, avatarProps, disableHoverCard, disableRouteLink, ...rest } = props;

  return (
    <div className="mk-avatar" {...rest}>
      {disableHoverCard ? (
        <MkAvatarMain user={user} {...avatarProps} disableRouteLink={disableRouteLink} />
      ) : (
        <HoverCard>
          <HoverCardTrigger asChild>
            <MkAvatarMain user={user} {...avatarProps} disableRouteLink={disableRouteLink} />
          </HoverCardTrigger>
          <HoverCardContent asChild className="w-80 h-100 p-0">
            <ScrollArea>
              <MkAvatarHoverCard user={user} />
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

const MkAvatarMain = (
  props: {
    user: User;
    disableRouteLink?: boolean;
  } & React.ComponentProps<typeof Avatar>,
) => {
  const { user, disableRouteLink, ...avatarProps } = props;
  const { className: avatarClassNameProps, ...avatarPropsRest } = avatarProps;
  return (
    <Avatar className={cn('rounded-md', avatarClassNameProps)} {...avatarPropsRest} asChild>
      <Link to="/@{$acct}" params={{ acct: acct.toString(user) }} disabled={disableRouteLink}>
        <AvatarPrimitive.Fallback className="relative overflow-hidden">
          <MkBlurHash id={'user:' + user.id} blurhash={user.avatarBlurhash} className="w-full h-full" />
        </AvatarPrimitive.Fallback>
        <AvatarImage src={user.avatarUrl} loading="lazy" decoding="async" />
      </Link>
    </Avatar>
  );
};

const MkAvatarHoverCard = (props: { user: User } & HTMLProps<HTMLDivElement>) => {
  const { user, className, ...rest } = props;
  const { data, isPending } = useUserQuery(user.id);

  return (
    <div className={cn('mk-avatar-hover-card', className)} {...rest}>
      {isPending && <MkUserCardSkeleton />}
      {data && <MkUserCard user={data} />}
    </div>
  );
};
