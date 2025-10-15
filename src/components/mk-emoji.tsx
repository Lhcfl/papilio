import { useState } from 'react';

import clsx from 'clsx';
import Twemoji from 'twemoji';
import { injectCurrentSite } from '@/services/inject-misskey-api';
import { useEmojis } from '@/stores/emojis';
import { MenuOrDrawer, type Menu } from './menu-or-drawer';
import { HeartMinusIcon, InfoIcon, SmilePlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReactNoteAction, useUndoReactNoteAction } from '@/hooks/note-actions';

export const MkCustomEmoji = (props: {
  name: string;
  normal?: boolean;
  noStyle?: boolean;
  host?: string | null;
  url?: string;
  noteContext?: { noteId: string; myReaction?: string | null };
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
  const { t } = useTranslation();
  const emojisMap = useEmojis((s) => s.emojisMap);
  const site = injectCurrentSite();
  const [error, setError] = useState(false);

  const name = props.name.startsWith(':') ? props.name.slice(1, -1) : props.name;
  const [normalizedName, normalizedHost] = name.split('@');
  const isLocal = props.host == null && (normalizedHost == '.' || !normalizedHost);
  const url =
    props.url ??
    (isLocal
      ? emojisMap.get(normalizedName)?.url
      : new URL(props.host ? `/emoji/${name}@${props.host}.webp` : `/emoji/${name}.webp`, site).toString());
  const alt = `:${name}:`;

  const emojiFallbackUrl = new URL('/static-assets/emoji-unknown.png', site).toString();

  const { mutate: react } = useReactNoteAction(props.noteContext?.noteId ?? 'null');

  if ((!url || error) && props.fallbackToImage) {
    return (
      <span className="mk-custom-emoji error mk-custom-emoji-fallback">
        <img className={className} src={emojiFallbackUrl} alt={alt} title={alt} decoding="async" />
      </span>
    );
  }

  if (url) {
    const inner = (
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

    if (props.menu && props.noteContext) {
      const menu: Menu = [
        {
          type: 'group',
          id: 'g-0',
          items: [
            { type: 'label', label: inner, id: 'emoji' },
            (isLocal || emojisMap.has(normalizedName)) && {
              id: 'react',
              type: 'item',
              icon: <SmilePlusIcon />,
              label: t('doReaction'),
              onClick: () => {
                react(`:${normalizedName}:`);
              },
            },
            {
              id: 'info',
              type: 'item',
              icon: <InfoIcon />,
              label: t('info'),
              onClick: () => {
                console.log('...');
              },
            },
          ],
        },
      ];
      return (
        <MenuOrDrawer menu={menu}>
          <button>{inner}</button>
        </MenuOrDrawer>
      );
    } else {
      return inner;
    }
  }

  return <span className="mk-custom-emoji error">{alt}</span>;
};

export const MkEmoji = (props: {
  emoji: string;
  menu?: boolean;
  menuReaction?: boolean;
  noteContext?: { noteId: string; myReaction?: string | null };
  className?: string;
  innerClassName?: string;
}) => {
  const { mutate: react } = useReactNoteAction(props.noteContext?.noteId ?? 'null');
  const { mutate: unreact } = useUndoReactNoteAction(props.noteContext?.noteId ?? 'null');
  const { t } = useTranslation();

  const parsed = Twemoji.parse(props.emoji, {
    base: injectCurrentSite(),
    ext: '.svg',
    folder: '/twemoji',
    className: clsx('h-[1.25em] align-[-0.25em] transition-all inline', props.innerClassName),
  });

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  const inner = <span className={clsx('mk-emoji', props.className)} dangerouslySetInnerHTML={{ __html: parsed }} />;

  if (props.menu && props.noteContext) {
    const menu: Menu = [
      {
        type: 'group',
        id: 'g-0',
        items: [
          { type: 'label', label: inner, id: 'emoji' },
          props.noteContext.myReaction != props.emoji && {
            id: 'react',
            type: 'item',
            icon: <SmilePlusIcon />,
            label: t('doReaction'),
            onClick: () => {
              react(props.emoji);
            },
          },
          props.noteContext.myReaction === props.emoji && {
            id: 'unreact',
            type: 'item',
            icon: <HeartMinusIcon />,
            label: t('unlike'),
            onClick: () => {
              unreact();
            },
          },
        ],
      },
    ];
    return (
      <MenuOrDrawer menu={menu}>
        <button>{inner}</button>
      </MenuOrDrawer>
    );
  } else {
    return inner;
  }
};
