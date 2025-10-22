/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { LinkIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export const MkUrl = (
  props: {
    url: string;
    navigationBehavior?: unknown;
    children?: React.ReactNode;
  } & HTMLAttributes<HTMLAnchorElement>,
) => {
  const { url, navigationBehavior, children, ...rest } = props;

  // TODO
  void navigationBehavior;

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className="text-tertiary break-words break-all hover:underline"
      {...rest}
    >
      <LinkIcon className="mr-1 inline size-4 align-[-0.13em]" />
      {children ?? url}
    </a>
  );
};
