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
    noNavigate?: boolean;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  const { url, navigationBehavior, children, noIcon, noNavigate, ...rest } = props;

  // TODO
  void navigationBehavior;

  const text = children ?? decodeURIComponent(url);

  const Comp = noNavigate ? 'span' : UrlA;

  return (
    <Comp
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className={cn('text-primary', {
        'wrap-break-word': children,
        'break-all': !children,
        'hover:underline': !noNavigate,
      })}
      {...rest}
    >
      {noIcon ? null : <LinkIcon className="mr-[0.25em] inline size-[1em] align-[-0.13em]" />}
      {text}
    </Comp>
  );
};

// oxlint-disable-next-line jsx-a11y/anchor-has-content -- label and children arrive through `props`
const UrlA = (props: HTMLProps<HTMLAnchorElement>) => <a rel="noopener noreferrer" target="_blank" {...props} />;
