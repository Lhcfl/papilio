/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkImage } from '@/components/mk-image';
import { fileQueryOptions } from '@/hooks/use-file';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryClient } from '@/plugins/persister';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/drive/file/$file')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(fileQueryOptions(params.file)),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { file: id } = Route.useParams();
  const { data: file } = useSuspenseQuery(fileQueryOptions(id));
  const isImageOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/');

  return (
    <div>
      <PageTitle title={t('file')} />
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
