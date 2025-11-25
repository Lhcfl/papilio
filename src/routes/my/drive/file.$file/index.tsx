/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { GuessFileIcon } from '@/components/file/guess-file-icon';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { MkImage } from '@/components/mk-image';
import { MkTime } from '@/components/mk-time';
import { MkUrl } from '@/components/mk-url';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  fileQueryOptions,
  useMarkAsNotSensitive,
  useMarkAsSensitive,
  usePermanentlyDeleteFileWithConfirmAction,
  useUpdateFileAction,
} from '@/hooks/use-file';
import { PageTitle } from '@/layouts/sidebar-layout';
import { toHumanReadableFileSize } from '@/lib/file';
import { EditFileCaptionModal } from '@/modals/edit-file-caption-modal';
import { InputModal } from '@/modals/input-modal';
import { queryClient } from '@/plugins/persister';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  CalendarArrowUpIcon,
  DownloadIcon,
  Edit2Icon,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/drive/file/$file/')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.refetchQueries(fileQueryOptions(params.file)),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { file: id } = Route.useParams();
  const { data: file } = useSuspenseQuery(fileQueryOptions(id));

  const [fileName, setFileName] = useState(file.name);

  const navigate = useNavigate();
  const { mutateAsync } = useUpdateFileAction(id);
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
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
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
          <MkImage className="aspect-square" containerAspectRatio={1} image={file} overrideMenu={menu} loadRawImages />
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
        <FileInfoRow icon={<TextCursorInputIcon />} title={t('fileName')} content={file.name}>
          <InputModal
            title={t('rename')}
            value={fileName}
            updateValue={setFileName}
            onOk={() => mutateAsync({ name: fileName })}
          >
            <Button variant="ghost">
              <Edit2Icon />
            </Button>
          </InputModal>
        </FileInfoRow>
        <FileInfoRow
          icon={<TextCursorInputIcon />}
          title={t('caption')}
          content={file.comment ?? <span className="text-muted-foreground">({t('nothing')})</span>}
        >
          <EditFileCaptionModal
            file={file}
            onOk={(s) => {
              void mutateAsync({ comment: s });
            }}
          >
            <Button variant="ghost">
              <Edit2Icon />
            </Button>
          </EditFileCaptionModal>
        </FileInfoRow>
        <FileInfoRow
          icon={<CalendarArrowUpIcon />}
          title={t('_fileViewer.uploadedAt')}
          content={<MkTime time={file.createdAt} mode="detail" colored={false} />}
        />
        <FileInfoRow icon={<FolderIcon />} title={t('folder')} content={file.folder?.name ?? '(' + t('drive') + ')'} />
        <FileInfoRow icon={<FileType2Icon />} title={t('_fileViewer.type')} content={file.type} />
        <FileInfoRow
          icon={<ScalingIcon />}
          title={t('_fileViewer.size')}
          content={toHumanReadableFileSize(file.size)}
        />
        <FileInfoRow icon={<LinkIcon />} title={t('_fileViewer.url')} content={<MkUrl url={file.url} noIcon />} />
      </div>
    </div>
  );
}

function FileInfoRow({
  icon,
  title,
  content,
  children,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  content: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-x-3 rounded-lg border px-4 py-3 text-sm">
      <div className="shrink-0 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current">{icon}</div>
      <div className="flex w-0 flex-[1_1] flex-col gap-y-0.5">
        <div className="text-muted-foreground">{title}</div>
        <div>{content}</div>
      </div>
      {children}
    </div>
  );
}
