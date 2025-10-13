import { useTranslation } from 'react-i18next';
import { MoreVerticalIcon, RepeatIcon, Trash2Icon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MkVisibilityIcon } from './mk-visibility-icon';
import type { NoteWithExtension } from '@/types/note';
import { useMe } from '@/stores/me';
import { useDeleteNoteAction } from '@/hooks/note-actions';

export const MkNoteRenoteTip = (props: { note: NoteWithExtension }) => {
  const meId = useMe((me) => me.id);

  const isMine = props.note.userId === meId;

  return (
    <div className="mk-note-renote-tip p-2 flex gap-2 items-center text-muted-foreground">
      <RepeatIcon />
      <MkAvatar user={props.note.user} avatarProps={{ className: 'size-6' }} />
      <MkUserName user={props.note.user} className="flex-grow-1" />
      <div className="renote-info flex gap-2 items-center">
        {isMine && <RenoteMore note={props.note} />}
        <MkTime time={props.note.createdAt} className="text-sm" />
        <MkVisibilityIcon note={props.note} className="size-4" />
      </div>
    </div>
  );
};

const RenoteMore = (props: { note: NoteWithExtension }) => {
  const { note } = props;
  const { t } = useTranslation();

  const { mutate: unrenote } = useDeleteNoteAction(note.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={() => unrenote()}>
          <Trash2Icon />
          {t('unrenote')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
