/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { cn } from '@/lib/utils';
import { LinkIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export const MkUrl = (
  props: {
    url: string;
    navigationBehavior?: unknown;
    children?: React.ReactNode;
    noIcon?: boolean;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  const { url, navigationBehavior, children, noIcon, ...rest } = props;

  // TODO
  void navigationBehavior;

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className={cn('text-tertiary hover:underline', {
        'wrap-break-word': children,
        'break-all': !children,
      })}
      {...rest}
    >
      {noIcon ? null : <LinkIcon className="mr-1 inline size-4 align-[-0.13em]" />}
      {children ?? url}
    </a>
  );
};
