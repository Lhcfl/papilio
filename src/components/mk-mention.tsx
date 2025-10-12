import { Link } from '@tanstack/react-router';
import { acct } from 'misskey-js';
import type { HTMLAttributes } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { getRelativeUrl } from '@/services/inject-misskey-api';
import { cn } from '@/lib/utils';

const MkMentionInner = (props: { username: string; host: string | null }) => {
  const { username, host } = props;
  const src = getRelativeUrl(`/avatar/@${acct.toString(props)}`);
  return (
    <span className="flex items-center">
      <Avatar className="size-5 mr-1">
        <AvatarImage src={src} />
      </Avatar>
      @{username}
      {host && <span className="opacity-70">@{host}</span>}
    </span>
  );
};

export const MkMention = (
  props: {
    username: string;
    host: string | null;
    noNavigate?: boolean;
  } & HTMLAttributes<HTMLSpanElement>,
) => {
  const { username, host, noNavigate, className, ...rest } = props;

  return (
    <span
      className={cn('mk-username inline-block align-middle text-sm bg-muted px-2 py-0.5 rounded-full', className)}
      {...rest}
    >
      {noNavigate ? (
        <span>
          <MkMentionInner username={username} host={host} />
        </span>
      ) : (
        <Link to={`/@${acct.toString({ username, host })}` as never}>
          <MkMentionInner username={username} host={host} />
        </Link>
      )}
    </span>
  );
};
