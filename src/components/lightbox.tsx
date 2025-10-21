/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DriveFile } from 'misskey-js/entities.js';
import type { ComponentProps } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import './lightbox.css';
import { TextInitialIcon } from 'lucide-react';
import { createRoot } from 'react-dom/client';

export const LightboxGallery = ({ children }: { children: React.ReactNode }) => (
  <Gallery
    withDownloadButton
    withCaption
    uiElements={[
      {
        name: 'toggle-caption',
        appendTo: 'bar',
        isButton: true,
        order: 9,
        title: 'Toggle caption',
        ariaLabel: 'Toggle caption',
        onClick: () => {
          document.querySelector('.pswp__default-caption.pswp__hide-on-close')?.classList.toggle('hidden');
        },
        onInit: (el) => {
          createRoot(el).render(
            <div className="w-full h-full flex items-center justify-center text-(--pswp-icon-color)">
              <TextInitialIcon className="size-5" />
            </div>,
          );
        },
      },
    ]}
  >
    {children}
  </Gallery>
);

export const LightboxItem = ({
  children,
  image,
  ...props
}: {
  image: DriveFile;
} & ComponentProps<typeof Item>) => {
  return (
    <Item
      original={image.url}
      thumbnail={image.thumbnailUrl ?? undefined}
      width={image.properties.width}
      height={image.properties.height}
      caption={image.comment ?? image.name}
      {...props}
    >
      {children}
    </Item>
  );
};
