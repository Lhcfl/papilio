import { GuessFileIcon } from '@/components/file/guess-file-icon';
import { MkImage } from '@/components/mk-image';
import { Badge } from '@/components/ui/badge';
import type { DriveFile } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export function MkDriveFile({ file }: { file: DriveFile }) {
  const { t } = useTranslation();
  const isImage = file.type.startsWith('image/');

  return (
    <div className="border p-2 flex flex-col gap-1 items-center justify-center rounded-lg">
      {isImage ? (
        <MkImage
          image={file}
          containerAspectRatio={1}
          className="w-full aspect-[1/1]"
          disableMenu
          disableSensitiveOverlay
        />
      ) : (
        <div className="w-full aspect-[4/3] flex items-center justify-center bg-accent rounded-md">
          <GuessFileIcon file={file} />
        </div>
      )}
      <div>{file.isSensitive && <Badge>{t('sensitive')}</Badge>}</div>
      <div className="break-all text-sm text-center">{file.name}</div>
    </div>
  );
}
