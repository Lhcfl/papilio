import type { DriveFolder } from 'misskey-js/entities.js';
import { Item, ItemContent, ItemHeader, ItemMedia } from '@/components/ui/item';
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
      <Item variant="outline" asChild>
        {onClick == null ? (
          <Link to="/my/drive/folder/$folder" params={{ folder: folder.id }}>
            {inner}
          </Link>
        ) : (
          <button onClick={onClick}>{inner}</button>
        )}
      </Item>
    </div>
  );
}
