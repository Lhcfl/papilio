/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { MkBlurHash } from '@/components/mk-blurhash';
import { cn } from '@/lib/utils';

export const MkImage = (props: { image: DriveFile; containerAspectRatio?: number } & HTMLProps<HTMLDivElement>) => {
  const { image, containerAspectRatio = 1, className, ...rest } = props;
  const [loading, setLoading] = useState(true);
  const url = image.thumbnailUrl ?? image.url;
  const aspect =
    image.properties.width && image.properties.height ? image.properties.width / image.properties.height : 1;

  useEffect(() => {
    const img = new window.Image(image.properties.width, image.properties.height);
    img.src = url;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.onload = () => {
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
  }, [image.properties.height, image.properties.width, url]);

  return (
    <div
      className={clsx(
        'mk-image relative w-full flex items-center justify-center bg-muted rounded-md overflow-hidden',
        className,
      )}
      {...rest}
    >
      <div
        className={cn('relative overflow-hidden', {
          'w-full': aspect >= containerAspectRatio,
          'h-full': aspect < containerAspectRatio,
        })}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={url}
          alt={image.name || ''}
          className={cn('absolute inset-0 w-full h-full object-cover transition-opacity duration-200', {
            'opacity-0': loading,
            'opacity-100': !loading,
          })}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
          }}
        />
        <MkBlurHash
          className={cn('absolute inset-0 w-full h-full object-cover transform-opacity duration-200', {
            'opacity-100': loading,
            'opacity-0': !loading,
          })}
          id={'image:' + image.id}
          blurhash={image.blurhash}
        />
      </div>
    </div>
  );
};
