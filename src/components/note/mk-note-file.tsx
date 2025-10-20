/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { GuessFileIcon } from '@/components/file/guess-file-icon';

export const MkNoteFile = (props: { file: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { file, className: classNameProps, ...rest } = props;

  const className = clsx('p-2', classNameProps);

  return (
    <Item className={className} {...rest} size="sm" variant="muted" asChild>
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <ItemMedia variant="icon">
          <GuessFileIcon file={file} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{file.name}</ItemTitle>
          <ItemDescription className="text-xs">{file.comment}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  );
};
