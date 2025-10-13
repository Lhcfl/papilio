import { useNoteValue } from '@/hooks/use-note';
import { MkMfm } from '../mk-mfm';
import { getNoteExcerpt } from '@/services/note-excerpt';
import { MkAvatar } from '../mk-avatar';
import { withNoSelection, withStopPrevent } from '@/lib/utils';

export const MkNoteReplyLine = (props: { noteId: string; onExpand: () => void }) => {
  const { noteId, onExpand } = props;
  const note = useNoteValue(noteId);
  if (note == null) return null;

  return (
    <div
      className="mk-note-reply-line px-2 flex relative gap-4 items-center cursor-pointer"
      onClick={withNoSelection(withStopPrevent(onExpand))}
    >
      <MkAvatar user={note.user} className="ml-1 z-10" />
      <div className="body line-clamp-2 w-full text-sm text-muted-foreground">
        <MkMfm text={getNoteExcerpt(note)} author={note.user} inline />
      </div>

      <div className="note-reply-line absolute -bottom-2 top-6 left-7 border-l-2" />
    </div>
  );
};
