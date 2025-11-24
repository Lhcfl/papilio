/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { GuessFileIcon } from '@/components/file/guess-file-icon';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { MkImage } from '@/components/mk-image';
import { MkTime } from '@/components/mk-time';
import { MkUrl } from '@/components/mk-url';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  fileQueryOptions,
  useMarkAsNotSensitive,
  useMarkAsSensitive,
  usePermanentlyDeleteFileWithConfirmAction,
} from '@/hooks/use-file';
import { PageTitle } from '@/layouts/sidebar-layout';
import { toHumanReadableFileSize } from '@/lib/file';
import { queryClient } from '@/plugins/persister';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  CalendarArrowUpIcon,
  DownloadIcon,
  EyeClosedIcon,
  EyeIcon,
  FileType2Icon,
  FileWarningIcon,
  FolderIcon,
  LinkIcon,
  MoreHorizontalIcon,
  ScalingIcon,
  TextCursorInputIcon,
  Trash2Icon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/drive/file/$file')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(fileQueryOptions(params.file)),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { file: id } = Route.useParams();
  const { data: file } = useSuspenseQuery(fileQueryOptions(id));
  const navigate = useNavigate();
  const markAsSensitive = useMarkAsSensitive(id);
  const markAsNotSensitive = useMarkAsNotSensitive(id);
  const deleteWithConfirm = usePermanentlyDeleteFileWithConfirmAction(id, file.name, () =>
    navigate({ to: '/my/drive' }),
  );
  const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');
  const { isSensitive } = file;

  const menu: Menu = [
    { label: t('file'), type: 'label', id: 'file-label' },
    {
      type: 'item',
      icon: <DownloadIcon />,
      label: t('download'),
      id: 'download',
      onClick: () => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.click();
      },
    },
    isSensitive && {
      type: 'item',
      icon: <EyeIcon />,
      label: t('unmarkAsSensitive'),
      id: 'unmark-as-sensitive',
      onClick: markAsNotSensitive,
    },
    !isSensitive && {
      type: 'item',
      icon: <EyeClosedIcon />,
      label: t('markAsSensitive'),
      id: 'mark-as-sensitive',
      onClick: markAsSensitive,
    },
    {
      type: 'item',
      icon: <Trash2Icon />,
      label: t('delete'),
      variant: 'destructive',
      id: 'delete',
      onClick: deleteWithConfirm,
    },
  ];

  return (
    <div>
      <PageTitle title={t('file')} />
      <div className="preview relative flex max-h-100">
        {isSensitive && (
          <Badge className="absolute top-2 left-2 z-10">
            <FileWarningIcon /> {t('sensitive')}
          </Badge>
        )}
        {isImageOrVideo ? (
          <MkImage className="aspect-square" containerAspectRatio={1} image={file} overrideMenu={menu} />
        ) : (
          <Item variant="outline" className="w-full">
            <ItemMedia variant="icon">
              <GuessFileIcon file={file} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{file.name}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <MenuOrDrawer menu={menu}>
                <Button size="icon">
                  <MoreHorizontalIcon />
                </Button>
              </MenuOrDrawer>
            </ItemActions>
          </Item>
        )}
      </div>

      <div className="details *:mt-2">
        <Alert>
          <TextCursorInputIcon />
          <AlertDescription>{t('fileName')}</AlertDescription>
          <AlertTitle>{file.name}</AlertTitle>
        </Alert>
        <Alert>
          <TextCursorInputIcon />
          <AlertDescription>{t('caption')}</AlertDescription>
          <AlertTitle>{file.comment ?? '(' + t('nothing') + ')'}</AlertTitle>
        </Alert>
        <Alert>
          <CalendarArrowUpIcon />
          <AlertDescription>{t('_fileViewer.uploadedAt')}</AlertDescription>
          <AlertTitle>
            <MkTime time={file.createdAt} mode="detail" colored={false} />
          </AlertTitle>
        </Alert>
        <Alert>
          <FolderIcon />
          <AlertDescription>{t('folder')}</AlertDescription>
          <AlertTitle>{file.folder?.name ?? '(' + t('drive') + ')'}</AlertTitle>
        </Alert>
        <Alert>
          <FileType2Icon />
          <AlertDescription>{t('_fileViewer.type')}</AlertDescription>
          <AlertTitle>{file.type}</AlertTitle>
        </Alert>
        <Alert>
          <ScalingIcon />
          <AlertDescription>{t('_fileViewer.size')}</AlertDescription>
          <AlertTitle>{toHumanReadableFileSize(file.size)}</AlertTitle>
        </Alert>
        <Alert>
          <LinkIcon />
          <AlertDescription>{t('_fileViewer.url')}</AlertDescription>
          <AlertTitle>
            <MkUrl url={file.url} noIcon />
          </AlertTitle>
        </Alert>
      </div>
    </div>
  );
}
