import { Image } from '@heroui/image';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';

export function MkPostFormPhotos(
  props: {
    files: DriveFile[];
  } & HTMLProps<HTMLDivElement>,
) {
  const { files, className, ...rest } = props;
  const images = files.filter((f) => f.type.startsWith('image/'));

  if (images.length === 0) return null;
  return (
    <div className={className} {...rest}>
      <div className="flex items-center justify-start gap-2">
        {images.map((image) => (
          <div key={image.id} className="w-20 h-20 overflow-hidden border rounded-md">
            <Image src={image.url} alt={image.name} className="object-fit" />
          </div>
        ))}
      </div>
    </div>
  );
}
