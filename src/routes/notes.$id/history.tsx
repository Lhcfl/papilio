import { MkError } from '@/components/mk-error';
import { MkTime } from '@/components/mk-time';
import { MkNoteBody } from '@/components/note/mk-note-body';
import { MkNoteHeader } from '@/components/note/mk-note-header';
import { Spinner } from '@/components/ui/spinner';
import { useNoteValue } from '@/hooks/use-note';
import { useNoteQuery } from '@/hooks/use-note-query';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import type { NoteWithExtension } from '@/types/note';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { EditIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/notes/$id/history')({
  component: RouteComponent,
});

interface Version {
  oldDate: string;
  updatedAt: string;
  text: string | null;
}

function versionNote(note: NoteWithExtension, { oldDate, text }: Version): NoteWithExtension {
  return {
    ...note,
    text,
    updatedAt: oldDate,
  };
}

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { data: noteLoadedId } = useNoteQuery(id);
  const { data, isPending, error } = useQuery({
    queryKey: ['note-history', id],
    queryFn: () => misskeyApi('notes/versions', { noteId: id }),
    staleTime: 60 * 60 * 1000,
  });

  return (
    <DefaultLayout title={t('_chat.history')}>
      {isPending && (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      )}
      {error && <MkError error={error} />}
      {data && noteLoadedId && <RouteComponentLoaded versions={data} noteId={noteLoadedId} />}
    </DefaultLayout>
  );
}

function RouteComponentLoaded({ versions, noteId }: { versions: Version[]; noteId: string }) {
  const note = useNoteValue(noteId);

  if (!note) {
    return null;
  }

  return (
    <div>
      <NoteVersion note={note} isLatest />
      {versions.map((version) => (
        <NoteVersion key={version.updatedAt} note={versionNote(note, version)} />
      ))}
    </div>
  );
}

function NoteVersion({ note, isLatest }: { note: NoteWithExtension; isLatest?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="border-b pb-2">
      <p className="text-tertiary flex items-center gap-2 px-2 pt-2 text-sm">
        {note.updatedAt === note.createdAt ? <SendIcon className="size-4" /> : <EditIcon className="size-4" />}
        {isLatest ? t('latestVersion') : t('version')}
        <MkTime mode="detail" time={note.updatedAt ?? note.createdAt} />
      </p>
      <MkNoteHeader note={note} />
      <MkNoteBody note={note} disableRouteOnClick disableLinkPreview showQuoteAsIcon showReplyAsIcon />
    </div>
  );
}
