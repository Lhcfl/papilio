import { useInfiniteQuery, type QueryFunction } from '@tanstack/react-query';
import { MkError } from './mk-error';
import { LoadingTrigger } from './loading-trigger';
import { Spinner } from './ui/spinner';
import { Fragment } from 'react/jsx-runtime';
import { MkEmpty } from './mk-empty';

function getId<T>(item: unknown, fallback?: T) {
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (item == null) return fallback;
  if (typeof item === 'object' && 'id' in item && typeof item.id === 'string') return item.id;
  return fallback;
}

export function MkInfiniteScroll<P>(props: {
  queryFn: QueryFunction<P, unknown[], string>;
  queryKey: unknown[];
  initialPageParam?: string;
  getNextPageParam?: (lastPage?: P) => string | undefined;
  children: (data: FlatArray<P[], 1>) => React.ReactNode;
}) {
  const {
    queryKey,
    queryFn,
    initialPageParam = 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam = (lastPage) => {
      if (Array.isArray(lastPage)) {
        return getId(lastPage.at(-1));
      }
      return undefined;
    },
    children,
  } = props;

  const { data, isFetchingNextPage, isPending, fetchNextPage, hasNextPage, error, refetch } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
  });

  const isEmpty = !isPending && data?.pages.flat(1).length === 0;

  return (
    <div>
      {isEmpty && <MkEmpty />}
      {error && <MkError error={error} retry={() => refetch()} />}
      <div className="flex flex-col gap-2">
        {data?.pages.flat(1).map((a, idx) => (
          <Fragment key={getId(a, idx)}>{children(a)}</Fragment>
        ))}
      </div>
      <LoadingTrigger onShow={() => hasNextPage && fetchNextPage()} />
      {(isPending || (isFetchingNextPage && hasNextPage)) && (
        <div className="w-full p-3 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
