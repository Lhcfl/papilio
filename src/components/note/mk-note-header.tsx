import { acct } from 'misskey-js';
import type { NoteWithExtension } from '@/types/note';
import { MkAvatar } from '../mk-avatar';
import { MkTime } from '../mk-time';
import { MkUserName } from '../mk-user-name';
import { MkVisibilityIcon } from './mk-visibility-icon';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link } from '@tanstack/react-router';
import { useSiteMeta } from '@/stores/site';
import { getNoteRoute } from '@/lib/note';

export const MkNoteHeader = (props: { note: NoteWithExtension }) => {
  const { note } = props;
  const metaName = useSiteMeta((s) => s.name);
  const metaIcon = useSiteMeta((s) => s.iconUrl);
  const instanceName = note.user.instance?.name || metaName || undefined;
  const instanceIcon = note.user.instance?.iconUrl || metaIcon || undefined;

  return (
    <div className="mk-note-header flex items-center gap-2 p-2">
      <MkAvatar user={note.user} className="size-10 z-10" />
      <div className="flex-grow-1 flex-shrink-1 w-0 flex flex-col">
        <div className="flex justify-between gap-1">
          <div className="user-name font-bold flex-grow-1 flex-shrink-1 w-0 line-clamp-1">
            <MkUserName user={note.user} />
          </div>
          <Link
            className="note-time flex items-center gap-2 flex-shrink-0 text-muted-foreground"
            to={getNoteRoute(note.id)}
          >
            <MkTime time={note.createdAt} className="text-sm" />
            <MkVisibilityIcon className="size-4" note={note} />
          </Link>
        </div>
        <div className="flex justify-between gap-2">
          <div className="user-username text-sm text-gray-500 flex-shrink-0">@{acct.toString(note.user)}</div>
          <div className="flex-grow-1 flex-shrink-1 w-0">
            <div className="note-instance ml-auto max-w-full text-xs flex items-center gap-1 px-1 py-0.5 bg-muted rounded-xl w-fit">
              <Avatar className="size-3">
                <AvatarImage src={instanceIcon} />
              </Avatar>
              <span className="truncate">{instanceName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
