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
import { EyeClosedIcon, EyeIcon, EyeOffIcon, HeartCrackIcon, MoreHorizontalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { Button } from '@/components/ui/button';
import { useMe } from '@/stores/me';
import { useUpdateFileAction } from '@/hooks/use-file';
import { useAfterConfirm } from '@/stores/confirm-dialog';

export const MkImage = (
  props: {
    image: DriveFile;
    containerAspectRatio?: number;
    disableMenu?: boolean;
    disableSensitiveOverlay?: boolean;
    imgProps?: HTMLProps<HTMLImageElement>;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { t } = useTranslation();
  const { image, containerAspectRatio = 1, disableMenu, disableSensitiveOverlay, className, imgProps, ...rest } = props;
  const { className: imgClassName, ...restImgProps } = imgProps ?? {};
  const [loading, setLoading] = useState(true);
  const [hiddenBecauseSensitive, setHiddenBecauseSensitive] = useState(image.isSensitive);
  const [manuallyMarkedSensitive, setManuallyMarkedSensitive] = useState<boolean | null>(null);
  const url = image.thumbnailUrl ?? image.url;
  const aspect =
    image.properties.width && image.properties.height ? image.properties.width / image.properties.height : 1;
  const meId = useMe((me) => me.id);
  const iAmAdmin = useMe((me) => me.isAdmin);
  const isMyImage = image.userId === meId;
  const isSensitive = disableSensitiveOverlay ? false : (manuallyMarkedSensitive ?? image.isSensitive);

  const { mutateAsync: update } = useUpdateFileAction(image.id);
  const markAsSensitive = useAfterConfirm(
    {
      title: t('markAsSensitive'),
      description: t('markAsSensitiveConfirm'),
      confirmIcon: <EyeOffIcon />,
      variant: 'destructive',
    },
    () =>
      update({ isSensitive: true }).then(() => {
        setHiddenBecauseSensitive(true);
        setManuallyMarkedSensitive(true);
      }),
  );
  const markAsNotSensitive = useAfterConfirm(
    {
      title: t('unmarkAsSensitive'),
      description: t('unmarkAsSensitiveConfirm'),
      confirmIcon: <EyeIcon />,
    },
    () =>
      update({ isSensitive: false }).then(() => {
        setHiddenBecauseSensitive(false);
        setManuallyMarkedSensitive(false);
      }),
  );

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

  const showBlurHash = loading || (hiddenBecauseSensitive && !disableSensitiveOverlay);

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
          label: hiddenBecauseSensitive ? t('show') : t('hide'),
          icon: hiddenBecauseSensitive ? <EyeIcon /> : <EyeClosedIcon />,
          onClick: () => {
            setHiddenBecauseSensitive(!hiddenBecauseSensitive);
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
        'mk-image relative w-full flex items-center justify-center bg-accent rounded-md overflow-hidden',
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
          className={cn('absolute inset-0 w-full h-full object-cover transition-opacity duration-200', imgClassName, {
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
          className={cn('absolute inset-0 w-full h-full object-cover transform-opacity duration-200', {
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
            'cursor-pointer bg-black/30 absolute inset-0 w-full h-full flex items-center justify-center transform-opacity duration-200 z-10',
            hiddenBecauseSensitive ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setHiddenBecauseSensitive(false);
          }}
          aria-label="Show sensitive content"
        >
          <div className="flex flex-col items-center text-white drop-shadow-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] p-3">
            <EyeClosedIcon className="size-8" />
            <div className="text-sm mt-2">
              {t('sensitive')}
              <br />
              {t('clickToShow')}
            </div>
            {image.comment && <div className="line-clamp-3 text-sm mt-2">ALT: {image.comment}</div>}
          </div>
        </button>
      )}
      {(isMyImage || image.comment != null) && (
        <Tooltip>
          <TooltipTrigger className="z-10 absolute top-2 right-2 px-2 py-1 backdrop-blur bg-foreground/50 text-background text-xs rounded-md">
            <div>{image.comment ? <span>ALT</span> : <HeartCrackIcon className="size-4" />}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-90">{image.comment ?? t('thisPostIsMissingAltText')}</div>
          </TooltipContent>
        </Tooltip>
      )}
      {!disableMenu && (
        <MenuOrDrawer menu={menu}>
          <Button size="icon-sm" className="absolute z-10 bottom-2 right-2 bg-foreground/50 backdrop-blur">
            <MoreHorizontalIcon />
          </Button>
        </MenuOrDrawer>
      )}
    </div>
  );
};
