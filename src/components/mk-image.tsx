/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { DriveFile } from '@/types/drive-file';
import type { HTMLProps } from 'react';
import { MkBlurHash } from '@/components/mk-blurhash';
import { cn } from '@/lib/utils';
import { EyeClosedIcon, EyeIcon, EyeOffIcon, HeartCrackIcon, MoreHorizontalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { Button } from '@/components/ui/button';
import { useMe } from '@/stores/me';
import { fileQueryOptions, useMarkAsNotSensitive, useMarkAsSensitive } from '@/hooks/use-file';
import { useQuery } from '@tanstack/react-query';

export const MkImage = ({
  image: initialImage,
  containerAspectRatio = 1,
  disableMenu,
  disableSensitiveOverlay,
  disableNoAltTextHint,
  loadRawImages,
  imgProps,
  className,
  overrideMenu,
  ...rest
}: {
  image: DriveFile;
  containerAspectRatio?: number;
  disableMenu?: boolean;
  disableSensitiveOverlay?: boolean;
  disableNoAltTextHint?: boolean;
  loadRawImages?: boolean;
  overrideMenu?: Menu;
  imgProps?: HTMLProps<HTMLImageElement>;
} & HTMLProps<HTMLDivElement>) => {
  const { data: image } = useQuery({
    ...fileQueryOptions(initialImage.id),
    initialData: initialImage,
  });

  const [hidden, setHidden] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const { className: imgClassName, ...restImgProps } = imgProps ?? {};
  const meId = useMe((me) => me.id);
  const iAmAdmin = useMe((me) => me.isAdmin);
  const url = loadRawImages ? image.url : (image.thumbnailUrl ?? image.url);
  const aspect =
    image.properties.width && image.properties.height ? image.properties.width / image.properties.height : 1;
  const isMyImage = image.userId === meId;
  const isSensitive = disableSensitiveOverlay ? false : image.isSensitive;

  const imageHidden = hidden ?? isSensitive;
  const markAsSensitive = useMarkAsSensitive(image.id);
  const markAsNotSensitive = useMarkAsNotSensitive(image.id);

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

  const showBlurHash = loading || (imageHidden && !disableSensitiveOverlay);

  const menu: Menu = [
    {
      type: 'group',
      id: 'grp1',
      items: [
        { type: 'label', id: 'lbl', label: t('image') },
        null,
        {
          type: 'item',
          id: 'toggle-hidden',
          label: imageHidden ? t('show') : t('hide'),
          icon: imageHidden ? <EyeIcon /> : <EyeClosedIcon />,
          onClick: () => {
            setHidden(!imageHidden);
          },
        },
      ],
    },
    (iAmAdmin || isMyImage) && {
      type: 'group',
      id: 'grp-admin',
      items: [
        null, // separator
        isSensitive
          ? {
              type: 'item',
              id: 'unmark-sensitive',
              variant: 'destructive',
              icon: <EyeIcon />,
              label: t('unmarkAsSensitive'),
              onClick: () => {
                void markAsNotSensitive();
              },
            }
          : {
              type: 'item',
              id: 'mark-sensitive',
              variant: 'destructive',
              icon: <EyeOffIcon />,
              label: t('markAsSensitive'),
              onClick: () => {
                void markAsSensitive();
              },
            },
      ],
    },
  ];

  return (
    <div
      className={clsx(
        'mk-image bg-accent relative flex w-full items-center justify-center overflow-hidden rounded-md',
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
          alt={image.comment ?? image.name}
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-200', imgClassName, {
            'opacity-0': showBlurHash,
            'opacity-100': !showBlurHash,
          })}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setLoading(false);
          }}
          onError={() => {
            setLoading(false);
          }}
          {...restImgProps}
        />
        <MkBlurHash
          className={cn('transform-opacity absolute inset-0 h-full w-full object-cover duration-200', {
            'opacity-100': showBlurHash,
            'opacity-0': !showBlurHash,
          })}
          id={'image:' + image.id}
          blurhash={image.blurhash}
        />
      </div>
      {!disableSensitiveOverlay && (
        <button
          className={cn(
            'transform-opacity absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/30 duration-200',
            imageHidden ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setHidden(false);
          }}
          aria-label="Show sensitive content"
        >
          <div className="flex flex-col items-center p-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] drop-shadow-black">
            <EyeClosedIcon className="size-8" />
            <div className="mt-2 text-sm">
              {t('sensitive')}
              <br />
              {t('clickToShow')}
            </div>
            {image.comment && <div className="mt-2 line-clamp-3 text-sm">ALT: {image.comment}</div>}
          </div>
        </button>
      )}
      {!disableNoAltTextHint && (isMyImage || image.comment != null) && (
        <Tooltip>
          <TooltipTrigger className="bg-foreground/50 text-background absolute top-2 right-2 z-10 rounded-md px-2 py-1 text-xs backdrop-blur">
            <div>{image.comment ? <span>ALT</span> : <HeartCrackIcon className="size-4" />}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-90">{image.comment ?? t('thisPostIsMissingAltText')}</div>
          </TooltipContent>
        </Tooltip>
      )}
      {!disableMenu && (
        <MenuOrDrawer menu={overrideMenu ?? menu}>
          <Button size="icon-sm" className="bg-foreground/50 absolute right-2 bottom-2 z-10 backdrop-blur">
            <MoreHorizontalIcon />
          </Button>
        </MenuOrDrawer>
      )}
    </div>
  );
};
