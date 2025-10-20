/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import { useState, type HTMLProps } from 'react';
import { MkImage } from '@/components/mk-image';
import { ImagesLightbox } from '@/components/images-lightbox';
import { MkVideo } from '@/components/mk-video';
import { cond } from '@/lib/match';

export const MkNoteImages = (props: { images: DriveFile[] } & HTMLProps<HTMLDivElement>) => {
  const { images, className: classNameProp, ...rest } = props;
  const count = images.length;

  const aspectRatio = (image?: DriveFile) => {
    const { width, height } = image?.properties ?? {};
    if (!width || !height) return 4 / 3;
    return width / height;
  };

  const twoImageBothWide = aspectRatio(images[0]) > 1.5 && aspectRatio(images[1]) > 1.5;

  const className = clsx('mk-note-images w-full text-center gap-2', classNameProp, {
    'images-1': count === 1,
    'images-2 aspect-[16/9] grid': count === 2,
    'grid-cols-2': count === 2 && !twoImageBothWide,
    'grid-rows-2': count === 2 && twoImageBothWide,
    'images-3 aspect-[16/9] grid grid-cols-2 ': count === 3,
    'images-4 aspect-[16/9] grid grid-cols-2 grid-rows-2': count === 4,
    'images-many grid grid-cols-2': count > 5,
  });

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (count === 0) return null;

  return (
    <>
      <div className={className} data-images-count={count} {...rest}>
        {images.map((image, index) =>
          image.type.startsWith('video/') ? (
            <MkVideo
              key={image.id}
              video={image}
              className={clsx('cursor-zoom-in', { 'row-span-2': count === 3 && index === 0 })}
            />
          ) : (
            <MkImage
              key={image.id}
              image={image}
              containerAspectRatio={cond([
                [count === 1, Math.max(aspectRatio(image), 3 / 4)],
                [count === 2 && !twoImageBothWide, 8 / 9],
                [count === 2 && twoImageBothWide, 16 / 4.5],
                [count === 3 && index === 0, 16 / 18],
                [count >= 3, 16 / 9],
              ])}
              style={count == 1 ? { aspectRatio: Math.max(aspectRatio(image), 3 / 4) } : undefined}
              className={clsx('cursor-zoom-in max-h-150', { 'row-span-2': count === 3 && index === 0 })}
              onClick={() => {
                setOpen(true);
                setCurrentIndex(index);
              }}
            />
          ),
        )}
      </div>
      <ImagesLightbox
        images={images}
        open={open}
        setOpen={setOpen}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
};
