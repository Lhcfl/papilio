/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { cn } from '@/lib/utils';
import { LinkIcon } from 'lucide-react';
import type { HTMLAttributes, HTMLProps } from 'react';

export const MkUrl = (
  props: {
    url: string;
    navigationBehavior?: unknown;
    children?: React.ReactNode;
    noIcon?: boolean;
    noRoute?: boolean;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  const { url, navigationBehavior, children, noIcon, noRoute, ...rest } = props;

  // TODO
  void navigationBehavior;

  const text = children ?? decodeURIComponent(url);

  const Comp = noRoute ? 'span' : UrlA;

  return (
    <Comp
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className={cn('text-tertiary', {
        'wrap-break-word': children,
        'break-all': !children,
        'hover:underline': !noRoute,
      })}
      {...rest}
    >
      {noIcon ? null : <LinkIcon className="mr-1 inline size-4 align-[-0.13em]" />}
      {text}
    </Comp>
  );
};

const UrlA = (props: HTMLProps<HTMLAnchorElement>) => <a rel="noopener noreferrer" target="_blank" {...props} />;
