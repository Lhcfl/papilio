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
import { getNoteRemoteUrl, getNoteRoute } from '@/lib/note';
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

const withToast = (props: { mutateAsync: (...args: never[]) => Promise<unknown> }) => () =>
  props.mutateAsync().catch((e: Error) => toast.error(e.message));

export const useNoteMenu = (props: { note: NoteWithExtension; onTranslate: () => void }) => {
  const { t } = useTranslation();
  const { note, onTranslate } = props;
  const meId = useMe((me) => me.id);
  const isAdmin = useMe((me) => me.isAdmin);
  const isMine = meId === note.userId;
  const remoteUrl = getNoteRemoteUrl(note);

  const deleteNoteAction = useDeleteNoteAction(note.id);
  const favorite = withToast(useFavoriteNoteAction(note.id));
  const unfavorite = withToast(useUnfavoriteNoteAction(note.id));
  const muteThread = withToast(useThreadMuteAction(note.id));
  const unmuteThread = withToast(useThreadUnmuteAction(note.id));

  const onDelete = useAfterConfirm(
    {
      title: t('deleteConfirm'),
      description: t('noteDeleteConfirm'),
      variant: 'destructive',
      confirmText: t('delete'),
      confirmIcon: <Trash2Icon />,
    },
    () => deleteNoteAction.mutateAsync().then(() => toast.success(t('deleted'))),
  );

  function copyContent() {
    copyToClipboard(note.cw + '\n\n' + note.text);
    toast.success(t('copiedToClipboard'));
  }

  function copyLink() {
    copyToClipboard(new URL('/notes/' + note.id, window.location.origin).toString());
    toast.success(t('copiedToClipboard'));
  }

  function copyRemoteLink() {
    copyToClipboard(remoteUrl);
    toast.success(t('copiedToClipboard'));
  }

  function share() {
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
      type: 'group',
      items: [
        { type: 'label', label: t('note') },
        { type: 'item', to: getNoteRoute(note.id), icon: <InfoIcon />, label: t('details') },
        { type: 'item', onClick: copyContent, icon: <CopyIcon />, label: t('copyContent') },
        { type: 'item', onClick: copyLink, icon: <LinkIcon />, label: t('copyLink') },
        { type: 'item', onClick: copyRemoteLink, icon: <LinkIcon />, label: t('copyRemoteLink') },
        { type: 'item', href: remoteUrl, icon: <ExternalLinkIcon />, label: t('showOnRemote') },
        { type: 'item', onClick: share, icon: <ShareIcon />, label: t('share') },
        { type: 'item', onClick: onTranslate, icon: <LanguagesIcon />, label: t('translate') },
      ],
    },
    {
      type: 'group',
      items: [
        null, // separator
        note.isFavorited
          ? { type: 'item', onClick: () => unfavorite(), icon: <StarIcon />, label: t('unfavorite') }
          : { type: 'item', onClick: () => favorite(), icon: <StarIcon />, label: t('favorite') },
        { type: 'item', icon: <PaperclipIcon />, label: t('clip'), onClick: () => toast.info('not implemented') },
        note.isMutingThread
          ? { type: 'item', onClick: () => unmuteThread(), icon: <BellOffIcon />, label: t('unmuteThread') }
          : { type: 'item', onClick: () => muteThread(), icon: <BellOffIcon />, label: t('muteThread') },
      ],
    },
    !isMine && {
      type: 'group',
      items: [
        null, // separator
        { type: 'item', icon: <FlagIcon />, label: t('reportAbuse'), onClick: () => toast.info('not implemented') },
      ],
    },
    (isMine || isAdmin) && {
      type: 'group',
      items: [
        null, // separator
        { type: 'item', variant: 'destructive', onClick: onDelete, icon: <Trash2Icon />, label: t('delete') },
      ],
    },
  ];

  return menu;
};
