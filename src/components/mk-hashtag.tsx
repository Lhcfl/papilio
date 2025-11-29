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
  noNavigate,
  ...props
}: {
  name: string;
  className?: string;
  noNavigate?: boolean;
} & HTMLAttributes<HTMLAnchorElement>) => {
  if (noNavigate) {
    return <span className={cn('text-tertiary wrap-break-word', className)}>#{name}</span>;
  }

  return (
    <Link
      to="/tag/$tag"
      params={{ tag: name }}
      className={cn('text-tertiary wrap-break-word hover:underline', className)}
      {...props}
    >
      #{name}
    </Link>
  );
};
