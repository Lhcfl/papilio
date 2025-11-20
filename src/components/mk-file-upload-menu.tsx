/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HardDriveUploadIcon, LinkIcon, UploadCloudIcon, UploadIcon, XIcon } from 'lucide-react';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { useTranslation } from 'react-i18next';
import { useUploader, type UploadFileOptions } from '@/hooks/use-uploader';
import type { DriveFile } from 'misskey-js/entities.js';
import { MkDriveFileSelect } from '@/components/mk-drive-file-select';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createStreamChannel, misskeyApi } from '@/lib/inject-misskey-api';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export const MkFileUploadMenu = (props: {
  label?: string;
  children: React.ReactNode;
  limit?: number;
  onUpload: (promises: Promise<DriveFile>[]) => void;
}) => {
  const { label, children, limit = Number.POSITIVE_INFINITY, onUpload } = props;
  const { t } = useTranslation();
  const [openDriveSelect, setOpenDriveSelect] = useState(false);
  const [openUrlUpload, setOpenUrlUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useUploader();

  function uploadFilesFromDevice(opts: UploadFileOptions) {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = limit > 1;
    input.onchange = () => {
      if (!input.files) return;
      const files = Array.from(input.files);
      onUpload(files.map((file) => uploadFile(file, opts)));
    };
    input.click();
  }

  const { mutateAsync: uploadFromUrl } = useMutation({
    mutationKey: ['upload-from-url'],
    mutationFn: async ({ url, folderId }: { url: string; folderId?: string }) => {
      const id = crypto.randomUUID();
      const channel = createStreamChannel('main');
      const ret = new Promise<DriveFile>((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(t('_reversi.timeout')));
        }, 60 * 1000);
        channel.on('urlUploadFinished', ({ marker, file }) => {
          if (marker === id) {
            resolve(file);
            channel.dispose();
          }
        });
      });
      setIsUploading(true);
      await misskeyApi('drive/files/upload-from-url', { url, folderId, marker: id }).finally(() => {
        setIsUploading(false);
        setOpenUrlUpload(false);
      });
      return ret;
    },
  });

  const menu: Menu = [
    { type: 'label', id: 'upload-label', label: label ?? t('attachFile') },
    {
      type: 'item',
      id: 'upload',
      icon: <UploadIcon />,
      label: `${t('upload')} (${t('compress')})`,
      onClick: () => {
        uploadFilesFromDevice({ keepOriginal: false });
      },
    },
    {
      type: 'item',
      id: 'upload-raw',
      icon: <UploadIcon />,
      label: t('upload'),
      onClick: () => {
        uploadFilesFromDevice({ keepOriginal: true });
      },
    },
    {
      type: 'item',
      id: 'upload-from-url',
      icon: <UploadCloudIcon />,
      label: t('uploadFromUrl'),
      onClick: () => {
        setOpenUrlUpload(true);
      },
    },
    {
      type: 'item',
      id: 'upload-from-drive',
      icon: <HardDriveUploadIcon />,
      label: t('fromDrive'),
      onClick: () => {
        setOpenDriveSelect(true);
      },
    },
  ];

  return (
    <>
      <MenuOrDrawer menu={menu}>{children}</MenuOrDrawer>
      <MkDriveFileSelect
        open={openDriveSelect}
        setOpen={setOpenDriveSelect}
        limit={limit}
        onFileSelect={(files) => {
          setOpenDriveSelect(false);
          onUpload(files.map((f) => Promise.resolve(f)));
        }}
      />
      <Dialog open={openUrlUpload} onOpenChange={setOpenUrlUpload}>
        <DialogContent>
          <DialogTitle>{t('uploadFromUrl')}</DialogTitle>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              const formData = new FormData(ev.currentTarget);
              const url = formData.get('url') as string | null;
              if (!url) return;
              onUpload([uploadFromUrl({ url })]);
            }}
          >
            <InputGroup>
              <InputGroupAddon>
                <LinkIcon />
              </InputGroupAddon>
              <InputGroupInput type="url" name="url" placeholder={t('imageUrl')} />
            </InputGroup>
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button variant="outline" type="reset">
                  <XIcon /> {t('cancel')}
                </Button>
              </DialogClose>
              <Button type="submit">
                {isUploading ? <Spinner /> : <UploadCloudIcon />}
                {t('uploadFromUrl')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
