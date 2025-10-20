/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HardDriveUploadIcon, UploadCloudIcon, UploadIcon } from 'lucide-react';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUploader, type UploadFileOptions } from '@/hooks/use-uploader';
import type { DriveFile } from 'misskey-js/entities.js';
import { MkDriveFileSelect } from '@/components/mk-drive-file-select';
import { useState } from 'react';

export const MkFileUploadMenu = (props: {
  children: React.ReactNode;
  allowMultiple?: boolean;
  onUpload: (promises: Promise<DriveFile>[]) => void;
}) => {
  const { children, allowMultiple = true, onUpload } = props;
  const { t } = useTranslation();
  const [openDriveSelect, setOpenDriveSelect] = useState(false);

  const uploadFile = useUploader();

  function uploadFilesFromDevice(opts: UploadFileOptions) {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = allowMultiple;
    input.onchange = () => {
      if (!input.files) return;
      const files = Array.from(input.files);
      onUpload(files.map((file) => uploadFile(file, opts)));
    };
    input.click();
  }

  const menu: Menu = [
    { type: 'label', id: 'upload-label', label: t('attachFile') },
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
      onClick: () => toast.error('Not implemented yet'),
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
        onFileSelect={(files) => {
          setOpenDriveSelect(false);
          onUpload(files.map((f) => Promise.resolve(f)));
        }}
      />
    </>
  );
};
