/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';

export const MkVideo = (props: { video: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { video, className, ...rest } = props;
  return (
    <div
      className={clsx(
        'mk-image relative w-full flex items-center justify-center bg-muted rounded-md overflow-hidden',
        className,
      )}
      {...rest}
    >
      <video src={video.url} controls className="w-full h-full" />
    </div>
  );
};
