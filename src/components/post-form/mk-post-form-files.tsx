/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DriveFile } from 'misskey-js/entities.js';
import { useState, type HTMLProps } from 'react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { GuessFileIcon } from '@/components/note/mk-note-file';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeIcon, MoreHorizontalIcon, TextInitialIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { usePermanentlyDeleteFileAction, useUpdateFileAction } from '@/hooks/use-file';
import { useTranslation } from 'react-i18next';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { ImagesLightbox } from '@/components/images-lightbox';
import { cn, onlyWhenNonInteractableContentClicked } from '@/lib/utils';

export function MkPostFormFiles(
  props: {
    files: DriveFile[];
    updateFiles: (f: (files: DriveFile[]) => DriveFile[]) => void;
  } & HTMLProps<HTMLDivElement>,
) {
  const { files, className, updateFiles, ...rest } = props;
  const images = files.filter((f) => f.type.startsWith('image/'));
  const others = files.filter((f) => !f.type.startsWith('image/'));
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0 && others.length === 0) return null;

  return (
    <div className={className} {...rest}>
      <div className="flex items-center justify-start gap-2">
        {images.map((image, index) => (
          <PostFormImage
            key={image.id}
            file={image}
            updateFiles={updateFiles}
            onClick={onlyWhenNonInteractableContentClicked(() => {
              setOpen(true);
              setCurrentIndex(index);
            })}
          />
        ))}
      </div>
      {images.length > 0 && others.length > 0 && <div className="my-2" />}
      <div className="flex flex-col gap-2">
        {others.map((file) => (
          <PostFormFile key={file.id} file={file} updateFiles={updateFiles} />
        ))}
      </div>
      <ImagesLightbox
        images={images}
        open={open}
        setOpen={setOpen}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}

function usePostFormFileMenu(props: {
  updateFiles: (f: (files: DriveFile[]) => DriveFile[]) => void;
  file: DriveFile;
}) {
  const { file, updateFiles } = props;
  const { t } = useTranslation();
  const { mutateAsync: permanentlyDeleteFile } = usePermanentlyDeleteFileAction(file.id);
  const { mutateAsync: updateFile } = useUpdateFileAction(file.id);

  const deleteWithConfirm = useAfterConfirm(
    {
      title: t('areYouSure'),
      description: t('driveFileDeleteConfirm', { name: file.name }),
      confirmIcon: <Trash2Icon />,
      confirmText: t('deleteFile'),
      variant: 'destructive',
    },
    async () => {
      updateFiles((fs) => fs.filter((f) => f.id !== file.id));
      await permanentlyDeleteFile();
    },
  );

  const menu: Menu = [
    {
      type: 'group',
      id: 'file-actions',
      items: [
        { type: 'label', id: 'file-label', label: t('file') },
        file.isSensitive
          ? {
              type: 'item',
              id: 'unmark-sensitive',
              icon: <EyeClosedIcon />,
              label: t('unmarkAsSensitive'),
              onClick: async () => {
                const updated = await updateFile({ isSensitive: false });
                updateFiles((fs) => fs.map((f) => (f.id === file.id ? updated : f)));
              },
            }
          : {
              type: 'item',
              id: 'mark-sensitive',
              icon: <EyeIcon />,
              label: t('markAsSensitive'),
              onClick: async () => {
                const updated = await updateFile({ isSensitive: true });
                updateFiles((fs) => fs.map((f) => (f.id === file.id ? updated : f)));
              },
            },
      ],
    },
    {
      type: 'group',
      id: 'file-destructive-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'remove',
          icon: <XIcon />,
          label: t('attachCancel'),
          onClick: () => {
            updateFiles((fs) => fs.filter((f) => f.id !== file.id));
          },
        },
        {
          type: 'item',
          id: 'permanently-delete',
          icon: <Trash2Icon />,
          label: t('deleteFile'),
          onClick: () => {
            void deleteWithConfirm();
          },
          variant: 'destructive',
        },
      ],
    },
  ];

  return menu;
}

const PostFormImage = ({
  file,
  updateFiles,
  onClick,
  className,
  ...props
}: { file: DriveFile; updateFiles: (f: (files: DriveFile[]) => DriveFile[]) => void } & HTMLProps<HTMLDivElement>) => {
  const menu = usePostFormFileMenu({ file, updateFiles });

  const badges = [
    { id: 'sensitive', condition: file.isSensitive, icon: EyeClosedIcon },
    { id: 'alt', condition: !!file.comment, icon: TextInitialIcon },
  ];

  return (
    <div className={cn('w-20 h-20 lg:w-30 lg:h-30 overflow-hidden border rounded-md relative', className)} {...props}>
      <img src={file.url} alt={file.name} className="w-full h-full object-cover" onClick={onClick} />
      <MenuOrDrawer menu={menu}>
        <Button variant="secondary" size="icon-sm" className="absolute right-1 top-1 z-10 border">
          <MoreHorizontalIcon />
        </Button>
      </MenuOrDrawer>
      <div className="absolute bottom-1 right-1 flex items-center gap-1">
        {badges.map((badge) =>
          badge.condition ? (
            <div key={badge.id} className="flex items-center bg-accent rounded-sm border p-1">
              <badge.icon className="size-3" />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

const PostFormFile = ({
  file,
  updateFiles,
}: {
  file: DriveFile;
  updateFiles: (f: (files: DriveFile[]) => DriveFile[]) => void;
}) => {
  const menu = usePostFormFileMenu({ file, updateFiles });

  return (
    <Item key={file.id} className="w-full" size="sm" variant="muted">
      <ItemMedia variant="icon">
        <GuessFileIcon file={file} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{file.name}</ItemTitle>
        <ItemDescription className="text-xs">{file.comment}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <MenuOrDrawer menu={menu}>
          <Button size="icon" variant="outline">
            <MoreHorizontalIcon />
          </Button>
        </MenuOrDrawer>
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            updateFiles((fs) => fs.filter((f) => f.id !== file.id));
          }}
        >
          <XIcon />
        </Button>
      </ItemActions>
    </Item>
  );
};
