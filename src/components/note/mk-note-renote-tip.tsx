import { useTranslation } from 'react-i18next';
import { MoreVerticalIcon, RepeatIcon, Trash2Icon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Button } from '@/components/ui/button';
import { MkVisibilityIcon } from './mk-visibility-icon';
import type { NoteWithExtension } from '@/types/note';
import { useMe } from '@/stores/me';
import { useDeleteNoteAction } from '@/hooks/note-actions';
import { MenuOrDrawer, type Menu } from '../menu-or-drawer';

export const MkNoteRenoteTip = (props: { note: NoteWithExtension }) => {
  const meId = useMe((me) => me.id);
  const { note } = props;
  const isMine = note.userId === meId;
  const { mutate: unrenote } = useDeleteNoteAction(note.id);
  const { t } = useTranslation();
  const menu: Menu = [
    {
      type: 'item',
      id: 'unrenote',
      icon: <Trash2Icon />,
      label: t('unrenote'),
      variant: 'destructive',
      onClick: () => {
        unrenote();
      },
    },
  ];

  return (
    <div className="mk-note-renote-tip p-2 flex gap-2 items-center text-muted-foreground">
      <RepeatIcon />
      <MkAvatar user={note.user} avatarProps={{ className: 'size-6' }} />
      <MkUserName user={note.user} className="flex-grow-1 flex-shrink-1 w-0 line-clamp-1" />
      <div className="renote-info flex gap-2 items-center">
        {isMine && (
          <MenuOrDrawer menu={menu}>
            <Button size="icon" variant="ghost">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </MenuOrDrawer>
        )}
        <MkTime time={note.createdAt} className="text-sm" />
        <MkVisibilityIcon iconProps={{ className: 'size-4' }} note={note} />
      </div>
    </div>
  );
};
