/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import {
  BellOffIcon,
  CopyIcon,
  ExternalLinkIcon,
  FlagIcon,
  InfoIcon,
  LanguagesIcon,
  LinkIcon,
  PaperclipIcon,
  ShareIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import type { NoteWithExtension } from '@/types/note';
import { useMe } from '@/stores/me';
import { getNoteRemoteUrl } from '@/lib/note';
import { copyToClipboard } from '@/lib/utils';
import { getNoteExcerpt } from '@/services/note-excerpt';
import {
  useDeleteNoteAction,
  useFavoriteNoteAction,
  useThreadMuteAction,
  useThreadUnmuteAction,
  useUnfavoriteNoteAction,
} from '@/hooks/note-actions';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import type { Menu } from '../menu-or-drawer';
import { errorMessageSafe } from '@/lib/error';
import { linkOptions } from '@tanstack/react-router';

const withToast = (props: { mutateAsync: (...args: never[]) => Promise<unknown> }, successMessage: string) => () =>
  props
    .mutateAsync()
    .then(() => toast.success(successMessage))
    .catch((e: unknown) => toast.error(errorMessageSafe(e)));

export const useNoteMenu = (props: { note: NoteWithExtension; onTranslate: () => void }) => {
  const { t } = useTranslation();
  const { note, onTranslate } = props;
  const meId = useMe((me) => me.id);
  const isAdmin = useMe((me) => me.isAdmin);
  const isMine = meId === note.userId;
  const remoteUrl = getNoteRemoteUrl(note);

  const deleteNoteAction = useDeleteNoteAction(note.id);
  const favorite = withToast(useFavoriteNoteAction(note.id), t('favorited'));
  const unfavorite = withToast(useUnfavoriteNoteAction(note.id), t('unfavorite'));
  const muteThread = withToast(useThreadMuteAction(note.id), t('muteThread'));
  const unmuteThread = withToast(useThreadUnmuteAction(note.id), t('unmuteThread'));

  const onDelete = useAfterConfirm(
    {
      title: t('deleteConfirm'),
      description: t('noteDeleteConfirm'),
      variant: 'destructive',
      confirmText: t('delete'),
      confirmIcon: <Trash2Icon />,
    },
    () => deleteNoteAction.mutateAsync().then(() => void toast.success(t('deleted'))),
  );

  function share() {
    // navigator.share is not supported in all browsers
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.share) {
      navigator
        .share({
          title: t('shareWithNote'),
          text: getNoteExcerpt(note),
          url: remoteUrl,
        })
        .catch(() => {
          /* no-op */
        });
    }
  }

  const menu: Menu = [
    {
      id: 'g-common',
      type: 'group',
      items: [
        { id: 'note-label', type: 'label', label: t('note') },
        {
          id: 'show-note',
          type: 'item',
          to: linkOptions({
            to: '/notes/$id',
            params: { id: note.id },
          }),
          icon: <InfoIcon />,
          label: t('details'),
        },
        {
          id: 'copy-content',
          type: 'item',
          onClick: () => void copyToClipboard((note.cw ?? '') + '\n\n' + (note.text ?? '')),
          icon: <CopyIcon />,
          label: t('copyContent'),
        },
        {
          id: 'copy-link',
          type: 'item',
          onClick: () => void copyToClipboard(new URL('/notes/' + note.id, window.location.origin).toString()),
          icon: <LinkIcon />,
          label: t('copyLink'),
        },
        {
          id: 'copy-remote-link',
          type: 'item',
          onClick: () => void copyToClipboard(remoteUrl),
          icon: <LinkIcon />,
          label: t('copyRemoteLink'),
        },
        { id: 'show-on-remote', type: 'item', href: remoteUrl, icon: <ExternalLinkIcon />, label: t('showOnRemote') },
        { id: 'share', type: 'item', onClick: share, icon: <ShareIcon />, label: t('share') },
        { id: 'translate', type: 'item', onClick: onTranslate, icon: <LanguagesIcon />, label: t('translate') },
      ],
    },
    {
      id: 'g-interact',
      type: 'group',
      items: [
        null, // separator
        note.isFavorited
          ? { id: 'unfavorite', type: 'item', onClick: () => unfavorite(), icon: <StarIcon />, label: t('unfavorite') }
          : { id: 'favorite', type: 'item', onClick: () => favorite(), icon: <StarIcon />, label: t('favorite') },
        {
          id: 'clip',
          type: 'item',
          icon: <PaperclipIcon />,
          label: t('clip'),
          onClick: () => toast.info('not implemented'),
        },
        note.isMutingThread
          ? {
              id: 'unmute-thread',
              type: 'item',
              onClick: () => unmuteThread(),
              icon: <BellOffIcon />,
              label: t('unmuteThread'),
            }
          : {
              id: 'mute-thread',
              type: 'item',
              onClick: () => muteThread(),
              icon: <BellOffIcon />,
              label: t('muteThread'),
            },
      ],
    },
    !isMine && {
      id: 'g-other',
      type: 'group',
      items: [
        null, // separator
        {
          id: 'report-abuse',
          type: 'item',
          icon: <FlagIcon />,
          label: t('reportAbuse'),
          onClick: () => toast.info('not implemented'),
        },
      ],
    },
    (isMine || isAdmin) && {
      id: 'g-manage',
      type: 'group',
      items: [
        null, // separator
        {
          id: 'delete',
          type: 'item',
          variant: 'destructive',
          onClick: onDelete,
          icon: <Trash2Icon />,
          label: t('delete'),
        },
      ],
    },
  ];

  return menu;
};
