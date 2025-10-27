/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { MkImage } from '@/components/mk-image';
import { MkVideo } from '@/components/mk-video';
import { cond } from '@/lib/match';
import { onlyWhenNonInteractableContentClicked } from '@/lib/utils';
import { LightboxGallery, LightboxItem } from '@/components/lightbox';
import { usePreference } from '@/stores/perference';

export const MkNoteImages = (props: { images: DriveFile[] } & HTMLProps<HTMLDivElement>) => {
  const { images, className: classNameProp, ...rest } = props;
  const count = images.length;
  const noteOneImageMaxAspectRatio = usePreference((s) => s.noteOneImageMaxAspectRatio);
  const loadRawImages = usePreference((s) => s.loadRawImages);

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

  const firstImageAspectRatio = aspectRatio(images[0]);
  const oneImageContainerAspectRatio = cond([
    [noteOneImageMaxAspectRatio === '16:9', Math.max(16 / 9, firstImageAspectRatio)],
    [noteOneImageMaxAspectRatio === '4:3', Math.max(4 / 3, firstImageAspectRatio)],
    [noteOneImageMaxAspectRatio === '1:1', Math.max(1 / 1, firstImageAspectRatio)],
    [noteOneImageMaxAspectRatio === '3:4', Math.max(3 / 4, firstImageAspectRatio)],
    [noteOneImageMaxAspectRatio === '2:3', Math.max(2 / 3, firstImageAspectRatio)],
  ]);

  if (count === 0) return null;

  return (
    <LightboxGallery>
      <div className={className} data-images-count={count} {...rest}>
        {images.map((image, index) =>
          image.type.startsWith('video/') ? (
            <MkVideo
              key={image.id}
              video={image}
              className={clsx('cursor-zoom-in', { 'row-span-2': count === 3 && index === 0 })}
            />
          ) : (
            <LightboxItem key={image.id} image={image}>
              {({ ref, open }) => (
                <MkImage
                  image={image}
                  loadRawImages={loadRawImages}
                  containerAspectRatio={cond([
                    [count === 1, oneImageContainerAspectRatio],
                    [count === 2 && !twoImageBothWide, 8 / 9],
                    [count === 2 && twoImageBothWide, 16 / 4.5],
                    [count === 3 && index === 0, 16 / 18],
                    [count >= 3, 16 / 9],
                  ])}
                  style={count == 1 ? { aspectRatio: oneImageContainerAspectRatio } : undefined}
                  className={clsx('max-h-150 cursor-zoom-in', { 'row-span-2': count === 3 && index === 0 })}
                  onClick={onlyWhenNonInteractableContentClicked(open)}
                  imgProps={{ ref }}
                />
              )}
            </LightboxItem>
          ),
        )}
      </div>
    </LightboxGallery>
  );
};
