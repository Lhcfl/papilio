/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useIsFetching, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { MkAlert } from '@/components/mk-alert';
import { MkError } from '@/components/mk-error';
import { MkNote } from '@/components/mk-note';
import { MkNoteReplies } from '@/components/mk-note-replies';
import { MkNoteSkeleton } from '@/components/mk-note-skeleton';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeIcon, Trash2Icon } from 'lucide-react';
import { useNoteQuery } from '@/hooks/use-note-query';
import { registerNote, useNoteValue } from '@/hooks/use-note';
import { getNoteRemoteUrl } from '@/lib/note';
import { misskeyApi } from '@/services/inject-misskey-api';
import { firstNonNull } from '@/lib/match';

export const Route = createFileRoute('/notes/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const { data, isPending, error, refetch } = useNoteQuery(id);
  const isLoading = useIsFetching({ predicate: (q) => q.queryKey[0] == 'note-replies' }) > 0;

  return (
    <DefaultLayout title={t('note')} headerRight={isLoading && <Spinner />}>
      {firstNonNull([
        isPending && <MkNoteSkeleton />,
        data && <LoadedMain noteId={id} />,
        error && <MkError error={error} retry={() => refetch()} />,
      ])}
    </DefaultLayout>
  );
}

function LoadedMain(props: { noteId: string }) {
  const { noteId } = props;
  const note = useNoteValue(noteId);
  const { t } = useTranslation();
  const isReply = note?.replyId != null;

  const { data: conversation, isPending: isConversationPending } = useQuery({
    queryKey: ['note-conversation', noteId],
    queryFn: () =>
      isReply
        ? misskeyApi('notes/conversation', { noteId: noteId }).then((ns) => registerNote(ns).reverse())
        : Promise.resolve(null),
    // Conversation (parent replies chain) will never change, so we can cache it indefinitely
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (note == null || note.isDeleted) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Trash2Icon />
          </EmptyMedia>
          <EmptyHeader>{t('removed')}</EmptyHeader>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">
              <HomeIcon />
              {t('home')}
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  // generate a scroll effect when mounted if the note is a reply
  function onMounted(el: HTMLDivElement | null) {
    if (el == null) return;
    if (note?.replyId == null) return;
    const scroller = el.closest('[data-slot="scroll-area-viewport"]');
    if (import.meta.env.DEV) {
      console.log({ scroller }, 'scroll');
    }
    scroller?.scrollBy(0, Math.max(0, el.clientHeight - 100));
  }

  const isRemoteNote = note.user.host != null;

  return (
    <div>
      {isRemoteNote && (
        <MkAlert>
          <span>{t('remoteUserCaution')}</span>
          <a className="text-tertiary hover:underline" target="_blank" href={getNoteRemoteUrl(note)}>
            {t('showOnRemote')}
          </a>
        </MkAlert>
      )}
      {isReply && (
        <div className="w-full">
          {isConversationPending ? (
            <div className="flex w-full items-baseline justify-center p-2">
              <Spinner />
            </div>
          ) : (
            <div className="note-conversations" ref={onMounted}>
              {conversation?.map((n) => (
                <MkNote key={n} noteId={n} isSubNote showReply={false} className="-mb-4" />
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <MkNote noteId={noteId} showReply={false} detailed />
      </div>
      <MkNoteReplies noteId={noteId} />
    </div>
  );
}
