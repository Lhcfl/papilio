/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { acct } from 'misskey-js';
import type { NoteWithExtension } from '@/types/note';
import { MkAvatar } from '@/components/mk-avatar';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { MkVisibilityIcon } from '@/components/note/mk-visibility-icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { useSiteMeta } from '@/stores/site';
export const MkNoteHeader = (props: { note: NoteWithExtension }) => {
  const { note } = props;
  const metaName = useSiteMeta((s) => s.name);
  const metaIcon = useSiteMeta((s) => s.iconUrl);
  const instanceName = note.user.instance?.name ?? metaName ?? undefined;
  const instanceIcon = note.user.instance?.iconUrl ?? metaIcon ?? undefined;

  return (
    <div className="mk-note-header flex items-center gap-2 p-2">
      <MkAvatar user={note.user} className="z-10" avatarProps={{ className: 'size-10' }} />
      <div className="flex-grow-1 flex-shrink-1 w-0 flex flex-col">
        <div className="flex justify-between gap-1">
          <div className="user-name font-bold flex-grow-1 flex-shrink-1 w-0 line-clamp-1">
            <MkUserName user={note.user} />
          </div>
          <span className="note-time flex items-center gap-2 flex-shrink-0 text-muted-foreground">
            <Link className="" to="/notes/$id" params={{ id: note.id }}>
              <MkTime time={note.createdAt} className="text-sm" />
            </Link>
            <MkVisibilityIcon iconProps={{ className: 'size-4' }} note={note} />
          </span>
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
