/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import type { HTMLAttributes } from 'react';

export const MkHashTag = ({
  name,
  className,
  disableRoute,
  ...props
}: {
  name: string;
  className?: string;
  disableRoute?: boolean;
} & HTMLAttributes<HTMLAnchorElement>) => {
  if (disableRoute) {
    return <span className={cn('break-all break-words text-tertiary', className)}>#{name}</span>;
  }

  return (
    <Link
      to="/tag/$tag"
      params={{ tag: name }}
      className={cn('break-all break-words text-tertiary hover:underline', className)}
      {...props}
    >
      #{name}
    </Link>
  );
};
