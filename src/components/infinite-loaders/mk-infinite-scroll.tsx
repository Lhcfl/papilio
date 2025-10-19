/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryFunction,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { MkError } from '@/components/mk-error';
import { LoadingTrigger } from '@/components/loading-trigger';
import { Spinner } from '@/components/ui/spinner';
import { Fragment } from 'react/jsx-runtime';
import { MkEmpty } from '@/components/mk-empty';
import type { HTMLProps } from 'react';
import { cn } from '@/lib/utils';

function getId<T>(item: unknown, fallback?: T) {
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (item == null) return fallback;
  if (typeof item === 'object' && 'id' in item && typeof item.id === 'string') return item.id;
  return fallback;
}

export function MkInfiniteScroll<P>(
  props: {
    queryFn: QueryFunction<P, unknown[], string>;
    queryKey: unknown[];
    initialPageParam?: string;
    getNextPageParam?: (lastPage?: P) => string | undefined;
    children: (data: FlatArray<P[], 1>) => React.ReactNode;
  } & Omit<HTMLProps<HTMLDivElement>, 'children'>,
) {
  const defaults = {
    initialPageParam: 'zzzzzzzzzzzzzzzzzz',
    getNextPageParam: (lastPage?: P) => {
      if (Array.isArray(lastPage)) {
        return getId(lastPage.at(-1), undefined);
      }
      return undefined;
    },
  };

  const { queryKey, queryFn, initialPageParam, getNextPageParam, children, ...rest } = { ...defaults, ...props };

  const result = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
  });

  return MkInfiniteScrollByData({ ...rest, infiniteQueryResult: result, children });
}

export function MkInfiniteScrollByData<TData>(
  props: {
    infiniteQueryResult: UseInfiniteQueryResult<InfiniteData<TData>>;
    children: (data: FlatArray<TData[], 1>) => React.ReactNode;
  } & Omit<HTMLProps<HTMLDivElement>, 'children'>,
) {
  const { infiniteQueryResult, children, className, ...rest } = props;
  const { data, isPending, fetchNextPage, hasNextPage, error, refetch } = infiniteQueryResult;
  const isEmpty = !isPending && data?.pages.flat(1).length === 0;

  return (
    <div className={cn('mk-infinite-scroll', className)} {...rest}>
      {isEmpty && <MkEmpty />}
      {error && <MkError error={error} retry={() => refetch()} />}
      <div className="flex flex-col gap-2">
        {data?.pages.flat(1).map((a, idx) => (
          <Fragment key={getId(a, idx)}>{children(a)}</Fragment>
        ))}
      </div>
      <LoadingTrigger onShow={() => hasNextPage && fetchNextPage()} />
      {(isPending || hasNextPage) && (
        <div className="w-full p-3 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
