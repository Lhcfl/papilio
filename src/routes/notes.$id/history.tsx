/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkTime } from '@/components/mk-time';
import { MkNoteBody } from '@/components/note/mk-note-body';
import { MkNoteHeader } from '@/components/note/mk-note-header';
import { useNoteValue } from '@/hooks/note';
import { noteQueryOptions } from '@/hooks/note-query';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryClient } from '@/plugins/persister';
import { misskeyApi } from '@/lib/inject-misskey-api';
import type { NoteWithExtension } from '@/types/note';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { EditIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const historyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['note-history', id],
    queryFn: () => misskeyApi('notes/versions', { noteId: id }),
  });

export const Route = createFileRoute('/notes/$id/history')({
  component: RouteComponent,
  loader: ({ params }) =>
    Promise.all([
      queryClient.ensureQueryData(historyQueryOptions(params.id)),
      queryClient.ensureQueryData(noteQueryOptions(params.id)),
    ]),
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
  const { data: noteLoadedId } = useSuspenseQuery(noteQueryOptions(id));
  const { data: versions } = useSuspenseQuery({
    queryKey: ['note-history', id],
    queryFn: () => misskeyApi('notes/versions', { noteId: id }),
  });
  const note = useNoteValue(noteLoadedId);

  if (!note) {
    return null;
  }

  return (
    <div>
      <PageTitle title={t('_chat.history')} />
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
