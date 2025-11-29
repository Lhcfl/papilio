/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, type HTMLProps } from 'react';
import { MkNote } from '@/components/mk-note';
import clsx from 'clsx';
import { LoadingTrigger } from '@/components/loading-trigger';
import { injectMisskeyStream, misskeyApi, sharkeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/note';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { MoreHorizontalIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { NoteUpdatedEvent } from 'misskey-js/streaming.types.js';
import { MkEmpty } from '@/components/mk-empty';

export const MkNoteReplies = (
  props: {
    kind?: 'renotes' | 'replies';
    noteId: string;
    indent?: number;
    depth?: number;
    showEmpty?: boolean;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { noteId, kind = 'replies', indent = 0, depth = 0, showEmpty, className: classNameProps, ...divProps } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (kind !== 'replies') return;

    const stream = injectMisskeyStream();

    function onNoteReplied(ev: NoteUpdatedEvent) {
      const { id, type } = ev;
      if (id != noteId) return;

      // This is a sharkey/firefish extension event type
      if (type === ('replied' as never)) {
        void queryClient.invalidateQueries({
          queryKey: ['note-replies', noteId],
        });
      }
    }

    stream.addListener('noteUpdated', onNoteReplied);

    return () => {
      stream.removeListener('noteUpdated', onNoteReplied);
    };
  }, [noteId, queryClient, kind]);

  // TODO: maybe we can estimate the total count of replies from note.repliesCount?
  // but is's not accurate. You may be blocked to see some replies. And sometimes the note may be outdated.
  // So we just load until there's no more replies.
  const { data, isPending, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [`notes/${kind}`, noteId],
    queryFn: ({ pageParam: sinceId }) =>
      kind == 'replies'
        ? misskeyApi('notes/children', { noteId: noteId, sinceId }).then((ns) => registerNote(ns))
        : sharkeyApi('notes/renotes', { noteId: noteId, sinceId, quote: true }).then((ns) => registerNote(ns)),
    getNextPageParam: (lastPage) => lastPage.at(-1),
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialPageParam: '0',
  });

  const replies = data?.pages.flat() ?? [];
  const justOneReply = replies.length === 1;
  const reachLimit = depth >= 11 || indent >= 5;

  /**
   * realIndent 表示回复在回复树左侧的缩进
   */
  const realIndent = indent - (justOneReply ? 1 : 0);

  return (
    <div
      className={clsx('mk-note-replies', classNameProps, {
        'pl-9': !justOneReply && realIndent != 0,
      })}
      {...divProps}
      data-replies-count={replies.length}
    >
      {showEmpty && !isPending && replies.length === 0 && <MkEmpty />}
      {!reachLimit &&
        replies.map((n, index) => (
          <div key={n} className="relative">
            {/* 回复树构造。
             * realIndent 为 0 的时候我们不打算连线，跳过。
             * 每当至少有两个回复的时候在左边显示一个圆滑的连接
             * 只有一个回复的时候，直接从上到下贯穿就行了
             */}
            {realIndent > 0 && replies.length > 1 && (
              <div className="note-replies-line absolute top-1 left-0 h-9 w-9 rounded-bl-lg border-b-2 border-l-2" />
            )}
            {/* 为了让后面的帖子也能够连接起来，还需要在左侧放置一根线
             */}
            {realIndent > 0 && index < replies.length - 1 && (
              <div className="note-replies-line absolute top-0 -bottom-4 left-0 border-l-2" />
            )}
            <MkNote key={n} noteId={n} isSubNote hideReplyIcon showReply={false} />
            <MkNoteReplies kind={kind} className="-mt-4" noteId={n} indent={realIndent + 1} depth={depth + 1} />
          </div>
        ))}
      {reachLimit && replies.length > 0 && (
        <div className="relative">
          {realIndent > 0 && replies.length > 1 && (
            <div className="note-replies-line absolute top-1 left-0 h-9 w-9 rounded-bl-lg border-b-2 border-l-2" />
          )}
          {/* 为了让后面的帖子也能够连接起来，还需要在左侧放置一根线
           */}
          <Button className="z-10 ml-5" variant="outline" size="sm" asChild>
            <Link to="/notes/$id" params={{ id: noteId }}>
              <MoreHorizontalIcon />
              {t('showMore')}
            </Link>
          </Button>
        </div>
      )}
      {!reachLimit && hasNextPage && <LoadingTrigger className="h-1 w-2" onShow={() => fetchNextPage()} />}
    </div>
  );
};
