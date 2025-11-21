/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import type { DriveFile } from '@/types/drive-file';
import type { HTMLProps } from 'react';

export const MkVideo = (props: { video: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { video, className, ...rest } = props;
  return (
    <div
      className={clsx(
        'mk-image bg-muted relative flex w-full items-center justify-center overflow-hidden rounded-md',
        className,
      )}
      {...rest}
    >
      <video src={video.url} controls className="h-full w-full" />
    </div>
  );
};
