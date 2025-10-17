import { HardDriveUploadIcon, UploadCloudIcon, UploadIcon } from 'lucide-react';
import { MenuOrDrawer, type Menu } from './menu-or-drawer';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const MkFileUploadMenu = (props: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  const menu: Menu = [
    { type: 'label', id: 'upload-label', label: t('attachFile') },
    {
      type: 'item',
      id: 'upload',
      icon: <UploadIcon />,
      label: `${t('upload')} (${t('compress')})`,
      onClick: () => toast.error('Not implemented yet'),
    },
    {
      type: 'item',
      id: 'upload-raw',
      icon: <UploadIcon />,
      label: t('upload'),
      onClick: () => toast.error('Not implemented yet'),
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
      onClick: () => toast.error('Not implemented yet'),
    },
  ];

  return <MenuOrDrawer menu={menu}>{props.children}</MenuOrDrawer>;
};
