import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { DefaultError, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { CircleXIcon } from 'lucide-react';
import type { EmojisResponse } from 'misskey-js/entities.js';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { PERSIST_GC_TIME } from '@/plugins/persister';
import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useSetableMe } from '@/stores/me';
import { useEmojis } from '@/stores/emojis';
import { useSetableSiteMeta } from '@/stores/site';

function useLoaderQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    onData: (data: TData) => void;
  },
) {
  const { onData, ...opts } = options;
  const { data, ...res } = useQuery(opts);
  const key = options.queryKey;

  if (data != null) onData(data);

  useEffect(() => {
    if (data != null) {
      onData(data);
    }
  }, [data, onData]);

  return { key, data, ...res };
}

export const WithLoginLoader = (props: { children: React.ReactNode }) => {
  const api = injectMisskeyApi();

  const setMe = useSetableMe((s) => s.setMe);
  const setEmojis = useEmojis((s) => s.setEmojis);
  const setMeta = useSetableSiteMeta((s) => s.setMeta);

  const queries = [
    useLoaderQuery({
      queryKey: ['me'],
      queryFn: () => api.request('i', {}).then(),
      gcTime: PERSIST_GC_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
      onData: setMe,
    }),
    useLoaderQuery({
      queryKey: ['custom-emojis'],
      refetchInterval: 1000 * 60 * 60, // 1 hours
      queryFn: () => fetch(new URL('/api/emojis', api.origin)).then((r) => r.json()) as Promise<EmojisResponse>,
      select: (data) => data.emojis,
      gcTime: PERSIST_GC_TIME,
      staleTime: 1000 * 60 * 60, // 1 hour
      onData: setEmojis,
    }),
    useLoaderQuery({
      queryKey: ['site-info'],
      queryFn: () => api.request('meta', {}),
      gcTime: PERSIST_GC_TIME,
      onData: setMeta,
      staleTime: 1000 * 60 * 60, // 1 hour
    }),
  ];

  const queryClient = useQueryClient();

  function reload() {
    void queryClient.invalidateQueries();
    window.location.reload();
  }

  if (queries.some((q) => q.isError)) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleXIcon />
            </EmptyMedia>
            <EmptyTitle>Error</EmptyTitle>
            <EmptyDescription>
              <ul>
                {queries.map(
                  (query) =>
                    query.error && (
                      <li key={query.key.join('/')}>
                        <b>
                          {query.key.join('/')}
                          :&nbsp;
                        </b>
                        <span>{query.error.message}</span>
                      </li>
                    ),
                )}
              </ul>
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={reload}>Reload</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (queries.some((q) => !q.data)) {
    return (
      <div className="w-screen h-screen">
        <div className="absolute w-screen h-screen flex justify-center items-center">
          <Spinner className="size-8" />
        </div>
        <ul className="font-mono text-sm p-4">
          <li>Booting Papilio...</li>
          {queries.map((query) => (
            <li key={query.key.join('/')}>
              {query.isLoading ? (
                <span className="text-yellow-500">[LOADING]</span>
              ) : (
                <span className="text-green-500">[OK]</span>
              )}
              &nbsp;
              {query.key.join('/')}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // all loaded
  return props.children;
};
