import type { HTMLProps } from 'react';
import { MkNote } from './mk-note';
import clsx from 'clsx';
import { LoadingTrigger } from './loading-trigger';

export const MkNoteReplies = (
  props: {
    noteId: string;
    indent?: number;
    depth?: number;
  } & HTMLProps<HTMLDivElement>,
) => {
  const { noteId, indent = 0, depth = 0, className: classNameProps, ...divProps } = props;
  const api = injectMisskeyApi();

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
      {replies.map((n, index) => (
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
          <MkNote key={n} noteId={n} isSubNote />
          {depth < 12 && indent < 5 && (
            <MkNoteReplies className="-mt-4" noteId={n} indent={realIndent + 1} depth={depth + 1} />
          )}
        </div>
      ))}
      <LoadingTrigger
        className="absolute w-2 h-1 bottom-0"
        onShow={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
    </div>
  );
};
