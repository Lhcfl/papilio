/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Link } from '@tanstack/react-router';
import { acct } from 'misskey-js';
import type { HTMLAttributes } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getRelativeUrl } from '@/services/inject-misskey-api';
import { cn } from '@/lib/utils';

const MkMentionInner = (props: { username: string; host: string | null; children?: React.ReactNode }) => {
  const { username, host, children } = props;
  const src = getRelativeUrl(`/avatar/@${acct.toString(props)}`);
  return (
    <span className="flex items-center">
      <Avatar className="mr-1 size-5">
        <AvatarImage src={src} />
      </Avatar>
      @{username}
      {host && <span className="opacity-70">@{host}</span>}
      {children}
    </span>
  );
};

export const MkMention = (
  props: {
    username: string;
    host: string | null;
    noNavigate?: boolean;
    children?: React.ReactNode;
  } & HTMLAttributes<HTMLSpanElement>,
) => {
  const { username, host, noNavigate, className, children, ...rest } = props;

  return (
    <span
      className={cn('mk-username bg-muted inline-block rounded-full px-2 py-0.5 align-middle text-sm', className)}
      {...rest}
    >
      {noNavigate ? (
        <span>
          <MkMentionInner username={username} host={host}>
            {children}
          </MkMentionInner>
        </span>
      ) : (
        <Link to={`/@${acct.toString({ username, host })}` as never}>
          <MkMentionInner username={username} host={host}>
            {children}
          </MkMentionInner>
        </Link>
      )}
    </span>
  );
};
