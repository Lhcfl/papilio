import { Image } from '@heroui/image';
import clsx from 'clsx';
import type { DriveFile } from 'misskey-js/entities.js';
import type { HTMLProps } from 'react';
import { MkBlurHash } from './mk-blurhash';

export const MkImage = (props: { image: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { image, className, ...rest } = props;
  const [loading, setLoading] = useState(true);
  const url = image.thumbnailUrl || image.url;

  useEffect(() => {
    const img = new window.Image(image.properties.width, image.properties.height);
    img.src = url;
    img.decoding = 'async';
    img.loading = 'lazy';
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
  }, [image.properties.height, image.properties.width, url]);

  return (
    <div
      className={clsx(
        'mk-image relative w-full flex items-center justify-center bg-muted rounded-md overflow-hidden',
        className,
      )}
      {...rest}
    >
      <Image
        src={url}
        alt={image.name || ''}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute max-h-full max-w-full w-full h-full">
          <MkBlurHash className="w-full h-full" id={'image:' + image.id} blurhash={image.blurhash} />
        </div>
      )}
    </div>
  );
};
