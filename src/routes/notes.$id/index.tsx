/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useIsFetching, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MkAlert } from '@/components/mk-alert';
import { MkNote } from '@/components/mk-note';
import { MkNoteReplies } from '@/components/mk-note-replies';
import { MkNoteSkeleton } from '@/components/mk-note-skeleton';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  EyeClosedIcon,
  EyeIcon,
  HomeIcon,
  QuoteIcon,
  RepeatIcon,
  ReplyAllIcon,
  SmilePlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { noteQueryOptions } from '@/hooks/use-note-query';
import { registerNote, useNoteValue } from '@/hooks/use-note';
import { getNoteRemoteUrl } from '@/lib/note';
import { misskeyApi } from '@/services/inject-misskey-api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMisskeyForkFeatures } from '@/stores/node-info';
import { NoteReactionsList } from '@/components/infinite-loaders/note-reactions-list';
import { NoteRenotesList } from '@/components/infinite-loaders/note-renotes-list';
import { NoteDefaultStateContext } from '@/providers/expand-all-cw';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PageTitle } from '@/layouts/sidebar-layout';
import { HeaderRightPortal } from '@/components/header-portal';
import { queryClient } from '@/plugins/persister';

export const Route = createFileRoute('/notes/$id/')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(noteQueryOptions(params.id)),
  pendingComponent: () => <MkNoteSkeleton />,
});

function RouteComponent() {
  const { data: noteId } = useSuspenseQuery(noteQueryOptions(Route.useParams().id));
  const isLoading = useIsFetching({ predicate: (q) => q.queryKey[0] == 'note-replies' }) > 0;
  const [expandAllCw, setExpandAllCw] = useState(false);
  const note = useNoteValue(noteId);
  const { t } = useTranslation();
  const isReply = note?.replyId != null;
  const features = useMisskeyForkFeatures();

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
    <>
      <PageTitle title={t('note')} />
      <HeaderRightPortal>
        {isLoading && <Spinner />}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              className={cn({
                'text-tertiary bg-tertiary/10 hover:text-tertiary hover:bg-tertiary/20': expandAllCw,
              })}
              onClick={() => {
                setExpandAllCw(!expandAllCw);
              }}
            >
              {expandAllCw ? <EyeIcon /> : <EyeClosedIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('expandAllCws')}</TooltipContent>
        </Tooltip>
      </HeaderRightPortal>
      <NoteDefaultStateContext value={{ expandAllCw }}>
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
          <div className="min-h-[50vh]">
            <Tabs defaultValue="replies">
              <TabsList className="w-full">
                <TabsTrigger value="replies">
                  <ReplyAllIcon />
                  {t('replies')}
                </TabsTrigger>
                <TabsTrigger value="reactions">
                  <SmilePlusIcon />
                  {t('reactions')}
                </TabsTrigger>
                <TabsTrigger value="renotes">
                  <RepeatIcon />
                  {t('renotes')}
                </TabsTrigger>
                {features.quotePage && (
                  <TabsTrigger value="quotes">
                    <QuoteIcon />
                    {t('quote')}
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="replies">
                <MkNoteReplies noteId={noteId} showEmpty />
              </TabsContent>
              <TabsContent value="reactions">
                <NoteReactionsList noteId={noteId} />
              </TabsContent>
              <TabsContent value="renotes">
                <NoteRenotesList noteId={noteId} />
              </TabsContent>
              <TabsContent value="quotes">
                <MkNoteReplies noteId={noteId} kind="renotes" showEmpty />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </NoteDefaultStateContext>
    </>
  );
}
