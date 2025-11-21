/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { GuessFileIcon } from '@/components/file/guess-file-icon';
import { MkImage } from '@/components/mk-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DriveFile } from '@/types/drive-file';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export function MkDriveFile({ file, className, ...props }: { file: DriveFile } & HTMLProps<HTMLDivElement>) {
  const { t } = useTranslation();
  const isImage = file.type.startsWith('image/');

  return (
    <div className={cn('flex flex-col items-center justify-center gap-1 rounded-lg border p-2', className)} {...props}>
      {isImage ? (
        <MkImage
          image={file}
          containerAspectRatio={1}
          className="aspect-square w-full"
          disableMenu
          disableSensitiveOverlay
        />
      ) : (
        <div className="bg-accent flex aspect-4/3 w-full items-center justify-center rounded-md">
          <GuessFileIcon file={file} />
        </div>
      )}
      <div>{file.isSensitive && <Badge>{t('sensitive')}</Badge>}</div>
      <div className="text-center text-sm wrap-break-word">{file.name}</div>
    </div>
  );
}
