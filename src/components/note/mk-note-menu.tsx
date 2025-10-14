import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
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
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

const withToast = (props: { mutateAsync: (...args: never[]) => Promise<unknown> }) => () =>
  props.mutateAsync().catch((e: Error) => toast.error(e.message));

export const MkNoteMenu = (props: { note: NoteWithExtension; onTranslate: () => void }) => {
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

  return (
    <DropdownMenuContent align="start">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-sm text-muted-foreground">{t('note')}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to={getNoteRoute(note.id)}>
            <InfoIcon />
            {t('details')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyContent}>
          <CopyIcon />
          {t('copyContent')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <LinkIcon />
          {t('copyLink')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyRemoteLink}>
          <LinkIcon />
          {t('copyRemoteLink')}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={remoteUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon />
            {t('showOnRemote')}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={share}>
          <ShareIcon />
          {t('share')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTranslate}>
          <LanguagesIcon />
          {t('translate')}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuSeparator />
        {note.isFavorited ? (
          <DropdownMenuItem onClick={() => unfavorite()}>
            <StarIcon />
            {t('unfavorite')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => favorite()}>
            <StarIcon />
            {t('favorite')}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <PaperclipIcon />
          {t('clip')}
        </DropdownMenuItem>
        {note.isMutingThread ? (
          <DropdownMenuItem onClick={() => unmuteThread()}>
            <BellOffIcon />
            {t('unmuteThread')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => muteThread()}>
            <BellOffIcon />
            {t('muteThread')}
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      {!isMine && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FlagIcon />
              {t('reportAbuse')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
      {(isMine || isAdmin) && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2Icon />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
    </DropdownMenuContent>
  );
};
