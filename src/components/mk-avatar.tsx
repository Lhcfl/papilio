import type { User } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { MkBlurHash } from './mk-blurhash';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { getUserRoute } from '@/lib/user';

export const MkAvatar = (
  props: {
    user: User;
    avatarProps?: React.ComponentProps<typeof Avatar>;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { user, avatarProps, ...rest } = props;
  const { className: avatarClassNameProps, ...avatarPropsRest } = avatarProps || {};

  return (
    <div className="mk-avatar" {...rest}>
      <Avatar className={cn('rounded-md', avatarClassNameProps)} {...avatarPropsRest} asChild>
        <Link to={getUserRoute(user)}>
          <AvatarPrimitive.Fallback className="relative overflow-hidden">
            <MkBlurHash id={'user:' + user.id} blurhash={user.avatarBlurhash} className="w-full h-full" />
          </AvatarPrimitive.Fallback>
          <AvatarImage src={user.avatarUrl} loading="lazy" decoding="async" />
        </Link>
      </Avatar>
    </div>
  );
};
