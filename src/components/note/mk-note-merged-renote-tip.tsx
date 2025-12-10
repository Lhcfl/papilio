/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RepeatIcon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { useNoteValue } from '@/hooks/note';

export const MkNoteMergedRenoteTip = (props: { noteIds: string[] }) => {
  const firstNoteId = props.noteIds[0];
  const firstNote = useNoteValue(firstNoteId);
  if (!firstNote) return null;

  return (
    <div className="mk-note-renote-tip text-muted-foreground flex items-center gap-2 p-2">
      <RepeatIcon />
      {props.noteIds.map((noteId) => (
        <AvararForRenoteTip key={noteId} noteId={noteId} />
      ))}
      <MkUserName user={firstNote.user} className="line-clamp-1 w-0 flex-[1_1]" />
      <MkTime time={firstNote.createdAt} className="text-sm" />
    </div>
  );
};

function AvararForRenoteTip(props: { noteId: string }) {
  const { noteId } = props;
  const note = useNoteValue(noteId);
  if (!note) return null;

  return <MkAvatar user={note.user} avatarProps={{ className: 'size-6' }} />;
}
