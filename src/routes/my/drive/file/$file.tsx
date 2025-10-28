/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkImage } from '@/components/mk-image';
import { useFileQuery } from '@/hooks/use-file';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';
import type { DriveFile } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/drive/file/$file')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const fileId = Route.useParams().file;
  const { data: file } = useFileQuery(fileId);

  return <DefaultLayout title={t('file')}>{file && <FileRouteLoaded fileId={fileId} file={file} />}</DefaultLayout>;
}

function FileRouteLoaded(props: { fileId: string; file: DriveFile }) {
  const { file } = props;
  const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');

  return (
    <div>
      <div className="preview">
        {isImageOrVideo && <MkImage className="aspect-square" containerAspectRatio={1} image={file} />}
      </div>

      <div className="details">
        <h2>File Details</h2>
        <p>
          <strong>ID:</strong> {file.id}
        </p>
        <p>
          <strong>Name:</strong> {file.name}
        </p>
        <p>
          <strong>Type:</strong> {file.type}
        </p>
        <p>
          <strong>Size:</strong> {file.size} bytes
        </p>
        {/* Add more file details as needed */}
      </div>
    </div>
  );
}
