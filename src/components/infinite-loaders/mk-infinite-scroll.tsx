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
import { Spinner } from '@/ui/spinner';
import { Fragment } from 'react/jsx-runtime';
import { MkEmpty } from '@/components/mk-empty';
import type { ComponentProps, HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { INITIAL_UNTIL_ID } from '@/lib/inject-misskey-api';

function getId<T>(item: unknown, fallback?: T): typeof fallback | string {
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (item == null) return fallback;
  if (typeof item === 'object' && 'id' in item && typeof item.id === 'string') return item.id;
  if (Array.isArray(item) && item.length > 0) {
    return getId(item.at(0), fallback);
  }
  return fallback;
}

export function MkInfiniteScroll<P, FlatDepth extends number = 1>(
  props: {
    queryFn: QueryFunction<P, unknown[], string>;
    queryKey: unknown[];
    initialPageParam?: string;
    getNextPageParam?: (lastPage?: P) => string | undefined;
    children: (data: FlatArray<P[], FlatDepth>) => React.ReactNode;
    flatDepth?: FlatDepth;
  } & Omit<ComponentProps<typeof MkInfiniteScrollByData>, 'children' | 'infiniteQueryResult'>,
) {
  const defaults = {
    initialPageParam: INITIAL_UNTIL_ID,
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

  return (
    <MkInfiniteScrollByData<P, FlatDepth> {...rest} infiniteQueryResult={result}>
      {children}
    </MkInfiniteScrollByData>
  );
}

export function MkInfiniteScrollByData<TData, FlatDepth extends number = 1>(
  props: {
    infiniteQueryResult: UseInfiniteQueryResult<InfiniteData<TData>>;
    containerClassName?: string;
    dataContainer?: (props: { children: React.ReactNode; className: string }) => React.ReactNode;
    wrapperContainer?: (props: { children: React.ReactNode; className: string }) => React.ReactNode;
    children: (data: FlatArray<TData[], FlatDepth>) => React.ReactNode;
    flatDepth?: FlatDepth;
  } & Omit<HTMLProps<HTMLDivElement>, 'children'>,
) {
  const {
    infiniteQueryResult,
    children,
    containerClassName,
    dataContainer,
    wrapperContainer,
    className,
    flatDepth,
    ...rest
  } = props;
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage, error, refetch } = infiniteQueryResult;
  const items = (flatDepth == 0 ? (data?.pages as FlatArray<TData[], FlatDepth>[]) : data?.pages.flat(flatDepth)) ?? [];
  const isEmpty = !isPending && items.length === 0;

  /**
   * Key for each rendered item.
   *
   * When `flatDepth === 0`, an item is a whole page (a "window" of the timeline). The
   * default key (the first element of the page) is unstable for the newest window: every
   * incoming note is prepended to it, so the key changes and React unmounts + remounts
   * the whole window on every new note. The last element (`untilId`) stays stable while
   * notes are prepended, so use it as the page key instead.
   */
  const getItemKey = (a: unknown, idx: number): string | number =>
    (flatDepth === 0 && Array.isArray(a) ? getId(a.at(-1), idx) : getId(a, idx)) ?? idx;

  const DataContainer = dataContainer ?? 'div';
  const WrapperContainer = wrapperContainer ?? 'div';

  return (
    <WrapperContainer className={cn('mk-infinite-scroll', className)} {...rest}>
      {/* it is intended to not use `cn`, because if we change containerClassName, we want to avoid unintended styles */}
      <DataContainer className={containerClassName ?? 'flex flex-col gap-2'}>
        {items.map((a, idx) => (
          <Fragment key={getItemKey(a, idx)}>{children(a)}</Fragment>
        ))}
      </DataContainer>
      {isEmpty && <MkEmpty />}
      {error && <MkError error={error} retry={() => refetch()} />}
      <LoadingTrigger onShow={() => hasNextPage && !isFetchingNextPage && fetchNextPage()} />
      {(isPending || hasNextPage) && (
        <div className="flex w-full justify-center p-3">
          <Spinner />
        </div>
      )}
    </WrapperContainer>
  );
}
