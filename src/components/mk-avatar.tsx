/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@/types/user';
import type { CSSProperties, HTMLProps } from 'react';
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
import type { UserDetailed as SkUserDetailed } from '@@/sharkey-js/entities';
import { usePreference } from '@/stores/perference';
import { useMisskeyForkFeatures } from '@/stores/node-info';

export const MkAvatar = (
  props: {
    user: User;
    avatarProps?: React.ComponentProps<typeof Avatar>;
    disableHoverCard?: boolean;
    disableRouteLink?: boolean;
  } & HTMLProps<HTMLDivElement>,
) => {
  const isTouch = navigator.maxTouchPoints > 0;
  const { user, avatarProps, disableHoverCard = isTouch, disableRouteLink, ...rest } = props;

  return (
    <div className="mk-avatar" {...rest}>
      {disableHoverCard ? (
        <MkAvatarMain user={user} {...avatarProps} disableRouteLink={disableRouteLink} />
      ) : (
        <HoverCard>
          <HoverCardTrigger asChild>
            <MkAvatarMain user={user} {...avatarProps} disableRouteLink={disableRouteLink} />
          </HoverCardTrigger>
          <HoverCardContent asChild className="h-100 w-80 p-0">
            <ScrollArea>
              <MkAvatarHoverCard user={user} />
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

function getDecorationStyle(decoration: SkUserDetailed['avatarDecorations'][number]): CSSProperties {
  const ret: CSSProperties = {};
  if (decoration.angle != null) {
    ret.rotate = `${decoration.angle * 360}deg`;
  }
  if (decoration.offsetX != null || decoration.offsetY != null) {
    ret.translate = `${(decoration.offsetX ?? 0) * 100}% ${(decoration.offsetY ?? 0) * 100}%`;
  }
  if (decoration.flipH) {
    ret.scale = '-1 1';
  }
  if (decoration.showBelow) {
    ret.zIndex = '0';
  }
  return ret;
}

const MkAvatarMain = (
  props: {
    user: User;
    disableRouteLink?: boolean;
  } & React.ComponentProps<typeof Avatar>,
) => {
  const { user, disableRouteLink, ...avatarProps } = props;
  const { className: avatarClassNameProps, ...avatarPropsRest } = avatarProps;
  const hasAvatarDecorations = useMisskeyForkFeatures().avatarDecorations;
  const showAvatarDecorations = usePreference((s) => s.showAvatarDecorations) && hasAvatarDecorations;

  return (
    <div className="relative">
      <Avatar className={cn('rounded-md', avatarClassNameProps)} {...avatarPropsRest} asChild>
        <Link to="/@{$acct}" params={{ acct: acct.toString(user) }} disabled={disableRouteLink}>
          <AvatarPrimitive.Fallback className="relative overflow-hidden">
            <MkBlurHash id={'user:' + user.id} blurhash={user.avatarBlurhash} className="h-full w-full" />
          </AvatarPrimitive.Fallback>
          <AvatarImage
            src={user.avatarUrl ?? undefined}
            loading="lazy"
            decoding="async"
            alt={`avatar of @${user.username}`}
          />
        </Link>
      </Avatar>
      {showAvatarDecorations &&
        user.avatarDecorations.map((decoration) => (
          <img
            key={decoration.id}
            className="z-index-1 pointer-events-none absolute -top-1/2 -left-1/2 w-2/1 max-w-2/1"
            src={decoration.url}
            decoding="async"
            loading="lazy"
            style={getDecorationStyle(decoration)}
            onError={(ev) => {
              ev.currentTarget.style = 'display: none';
            }}
          />
        ))}
    </div>
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
