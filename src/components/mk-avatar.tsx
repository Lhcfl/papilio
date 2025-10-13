import type { User } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { MkBlurHash } from './mk-blurhash';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { getUserRoute } from '@/lib/user';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { MkUserCard } from './mk-user-card';
import { useUserQuery } from '@/hooks/use-user';
import { MkUserCardSkeleton } from './mk-user-card-skeleton';
import { ScrollArea } from './ui/scroll-area';

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
      <Link to={getUserRoute(user)} disabled={disableRouteLink}>
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
