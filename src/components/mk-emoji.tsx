import { useState } from 'react';

import clsx from 'clsx';
import Twemoji from 'twemoji';
import { injectCurrentSite } from '@/services/inject-misskey-api';
import { useEmojis } from '@/stores/emojis';

export const MkCustomEmoji = (props: {
  name: string;
  normal?: boolean;
  noStyle?: boolean;
  host?: string | null;
  url?: string;
  useOriginalSize?: boolean;
  menu?: boolean;
  menuReaction?: boolean;
  fallbackToImage?: boolean;
  innerClassName?: string;
}) => {
  const className = clsx(
    'inline align-middle transition-all',
    props.normal ? 'h-[1.25em] align-[-0.25em]' : 'h-[2em]',
    props.innerClassName,
  );
  const emojisMap = useEmojis((s) => s.emojisMap);
  const site = injectCurrentSite();
  const [error, setError] = useState(false);

  const name = props.name.startsWith(':') ? props.name.slice(1, -1) : props.name;
  const [normalizedName, normalizedHost] = name.split('@');
  const isLocal = props.host == null && (normalizedHost == '.' || !normalizedHost);
  const url = props.url
    ? props.url
    : isLocal
      ? emojisMap.get(normalizedName)?.url
      : new URL(props.host ? `/emoji/${name}@${props.host}.webp` : `/emoji/${name}.webp`, site).toString();
  const alt = `:${name}:`;

  const emojiFallbackUrl = new URL('/static-assets/emoji-unknown.png', site).toString();

  if ((!url || error) && props.fallbackToImage) {
    return (
      <span className="mk-custom-emoji error mk-custom-emoji-fallback">
        <img className={className} src={emojiFallbackUrl} alt={alt} title={alt} decoding="async" />
      </span>
    );
  }

  if (url) {
    return (
      <span className="mk-custom-emoji">
        <img
          className={className}
          src={url}
          alt={alt}
          title={alt}
          decoding="async"
          onError={() => {
            setError(true);
          }}
          onLoad={() => {
            setError(false);
          }}
        />
      </span>
    );
  }

  return <span className="mk-custom-emoji error">{alt}</span>;
};

export const MkEmoji = (
  props: { emoji: string; menu?: boolean; menuReaction?: boolean } & { className?: string; innerClassName?: string },
) => {
  const parsed = Twemoji.parse(props.emoji, {
    base: injectCurrentSite(),
    ext: '.svg',
    folder: '/twemoji',
    className: clsx('h-[1.25em] align-[-0.25em] transition-all inline', props.innerClassName),
  });
  return <span className={clsx('mk-emoji', props.className)} dangerouslySetInnerHTML={{ __html: parsed }} />;
};
