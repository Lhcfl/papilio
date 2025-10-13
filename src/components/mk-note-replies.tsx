import { useInfiniteQuery } from '@tanstack/react-query';
import { type HTMLProps } from 'react';
import { MkNote } from './mk-note';
import clsx from 'clsx';
import { LoadingTrigger } from './loading-trigger';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { MoreHorizontalIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getNoteRoute } from '@/lib/note';

export const MkNoteReplies = (
  props: {
    noteId: string;
    indent?: number;
    depth?: number;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { noteId, indent = 0, depth = 0, className: classNameProps, ...divProps } = props;
  const api = injectMisskeyApi();
  const { t } = useTranslation();

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['note-replies', noteId],
    queryFn: ({ pageParam: sinceId }) =>
      api.request('notes/replies', { noteId: noteId, sinceId }).then((ns) => registerNote(...ns)),
    getNextPageParam: (lastPage) => lastPage.at(-1),
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialPageParam: '0',
  });

  const replies = data?.pages.flat() || [];
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
      {!reachLimit &&
        replies.map((n, index) => (
          <div key={n} className="relative">
            {/* 回复树构造。
             * realIndent 为 0 的时候我们不打算连线，跳过。
             * 每当至少有两个回复的时候在左边显示一个圆滑的连接
             * 只有一个回复的时候，直接从上到下贯穿就行了
             */}
            {realIndent > 0 && replies.length > 1 && (
              <div className="note-replies-line absolute top-1 left-0 h-9 w-9 border-l-2 border-b-2 rounded-bl-lg" />
            )}
            {/* 为了让后面的帖子也能够连接起来，还需要在左侧放置一根线
             */}
            {realIndent > 0 && index < replies.length - 1 && (
              <div className="note-replies-line absolute top-0 left-0 -bottom-4 border-l-2" />
            )}
            <MkNote key={n} noteId={n} isSubNote hideReplyIcon />
            {!reachLimit && <MkNoteReplies className="-mt-4" noteId={n} indent={realIndent + 1} depth={depth + 1} />}
          </div>
        ))}
      {reachLimit && replies.length > 0 && (
        <div className="relative">
          {realIndent > 0 && replies.length > 1 && (
            <div className="note-replies-line absolute top-1 left-0 h-9 w-9 border-l-2 border-b-2 rounded-bl-lg" />
          )}
          {/* 为了让后面的帖子也能够连接起来，还需要在左侧放置一根线
           */}
          <Button className="z-10 ml-5" variant="outline" size="sm" asChild>
            <Link to={getNoteRoute(props.noteId)}>
              <MoreHorizontalIcon />
              {t('showMore')}
            </Link>
          </Button>
        </div>
      )}
      {!reachLimit && hasNextPage && (
        <LoadingTrigger
          className="w-2 h-1"
          onShow={() => {
            if (hasNextPage) fetchNextPage();
          }}
        />
      )}
    </div>
  );
};
