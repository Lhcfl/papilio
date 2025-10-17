import type { DriveFile } from 'misskey-js/entities.js';
import { useState, type HTMLProps } from 'react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item';
import { GuessFileIcon } from '../note/mk-note-file';
import { Button } from '../ui/button';
import { MoreHorizontalIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { usePermanentlyDeleteFileAction } from '@/hooks/use-file';
import { useTranslation } from 'react-i18next';
import { MenuOrDrawer, type Menu } from '../menu-or-drawer';
import { ImagesLightbox } from '../images-lightbox';
import { cn } from '@/lib/utils';

export function MkPostFormFiles(
  props: {
    files: DriveFile[];
    removeFile: (file: DriveFile) => void;
  } & HTMLProps<HTMLDivElement>,
) {
  const { files, className, removeFile, ...rest } = props;
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
            removeFile={removeFile}
            onClick={() => {
              setOpen(true);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
      {images.length > 0 && others.length > 0 && <div className="my-2" />}
      <div className="flex flex-col gap-2">
        {others.map((file) => (
          <PostFormFile key={file.id} file={file} removeFile={removeFile} />
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

function usePostFormFileMenu(props: { removeFile: (file: DriveFile) => void; file: DriveFile }) {
  const { file, removeFile } = props;
  const { t } = useTranslation();
  const { mutateAsync: permanentlyDeleteFile } = usePermanentlyDeleteFileAction(file.id);

  const deleteWithConfirm = useAfterConfirm(
    {
      title: t('areYouSure'),
      description: t('driveFileDeleteConfirm', { name: file.name }),
      confirmIcon: <Trash2Icon />,
      confirmText: t('deleteFile'),
      variant: 'destructive',
    },
    async () => {
      removeFile(file);
      await permanentlyDeleteFile();
    },
  );

  const menu: Menu = [
    {
      type: 'group',
      id: 'file-actions',
      items: [
        { type: 'label', id: 'file-label', label: t('file') },
        {
          type: 'item',
          id: 'remove',
          icon: <XIcon />,
          label: t('attachCancel'),
          onClick: () => {
            removeFile(file);
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
  removeFile,
  className,
  ...props
}: { file: DriveFile; removeFile: (file: DriveFile) => void } & HTMLProps<HTMLDivElement>) => {
  const menu = usePostFormFileMenu({ file, removeFile });

  return (
    <div className={cn('w-20 h-20 lg:w-30 lg:h-30 overflow-hidden border rounded-md relative', className)} {...props}>
      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
      <MenuOrDrawer menu={menu}>
        <Button variant="outline" size="icon-sm" className="absolute right-1 top-1 z-10">
          <MoreHorizontalIcon />
        </Button>
      </MenuOrDrawer>
    </div>
  );
};

const PostFormFile = ({ file, removeFile }: { file: DriveFile; removeFile: (file: DriveFile) => void }) => {
  const menu = usePostFormFileMenu({ file, removeFile });

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
            removeFile(file);
          }}
        >
          <XIcon />
        </Button>
      </ItemActions>
    </Item>
  );
};
