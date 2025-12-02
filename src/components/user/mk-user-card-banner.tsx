/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkBlurHash } from '@/components/mk-blurhash';
import { cn } from '@/lib/utils';
import { useState, type HTMLProps } from 'react';

export function MkUserCardBanner(
  props: { url: string | null; blurhash: string | null; fallbackBlurHash?: string | null } & HTMLProps<HTMLDivElement>,
) {
  const { url, blurhash, fallbackBlurHash, className, ...rest } = props;
  const [loading, setLoading] = useState(true);
  const blurhash2 = blurhash ?? fallbackBlurHash ?? null;

  return (
    <div className={cn('mk-user-card-thumbnail relative w-full', className)} {...rest}>
      {url && (
        <img
          src={url}
          alt="banner"
          loading="lazy"
          className="h-full w-full object-cover"
          onLoad={() => {
            setLoading(false);
          }}
        />
      )}
      {(!url || loading) && blurhash2 != null && (
        <MkBlurHash blurhash={blurhash2} id={blurhash2} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
