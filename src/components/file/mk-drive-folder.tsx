/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DriveFolder } from 'misskey-js/entities.js';
import { Item, ItemContent, ItemHeader, ItemMedia } from '@/ui/item';
import { Link } from '@tanstack/react-router';
import { FolderIcon } from 'lucide-react';
import type { HTMLProps } from 'react';

export function MkDriveFolder({
  folder,
  onClick,
  ...props
}: { folder: DriveFolder } & Omit<HTMLProps<HTMLDivElement>, 'onClick'> &
  Pick<HTMLProps<HTMLButtonElement>, 'onClick'>) {
  const inner = (
    <>
      <ItemMedia variant="icon">
        <FolderIcon />
      </ItemMedia>
      <ItemContent>
        <ItemHeader>{folder.name}</ItemHeader>
      </ItemContent>
    </>
  );
  return (
    <div className="mk-drive-folder" {...props}>
      {onClick == null ? (
        <Item
          variant="outline"
          className="w-full"
          render={<Link to="/my/drive/folder/$folder" params={{ folder: folder.id }} />}
        >
          {inner}
        </Item>
      ) : (
        <Item variant="outline" className="w-full" render={<button onClick={onClick} />}>
          {inner}
        </Item>
      )}
    </div>
  );
}
