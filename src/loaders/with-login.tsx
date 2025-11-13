/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CircleXIcon } from 'lucide-react';
import type { EmojisResponse } from 'misskey-js/entities.js';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { PERSIST_GC_TIME } from '@/plugins/persister';
import { misskeyApi, site } from '@/services/inject-misskey-api';
import { MeContext } from '@/stores/me';
import { SiteMetaContext } from '@/stores/site';
import { NodeInfoContext, type NodeInfo } from '@/stores/node-info';
import { EmojisContext } from '@/stores/emojis';

export const WithLoginLoader = (props: { children: React.ReactNode }) => {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => misskeyApi('i', {}),
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const emojis = useQuery({
    queryKey: ['custom-emojis'],
    refetchInterval: 1000 * 60 * 60, // 1 hours
    queryFn: () => fetch(new URL('/api/emojis', site!)).then((r) => r.json() as Promise<EmojisResponse>),
    select: (data) => data.emojis,
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const meta = useQuery({
    queryKey: ['site-info'],
    queryFn: () => misskeyApi('meta', {}),
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const nodeInfo = useQuery({
    queryKey: ['node-info'],
    queryFn: () => fetch(new URL('/nodeinfo/2.1', site!)).then((r) => r.json() as Promise<NodeInfo>),
    gcTime: PERSIST_GC_TIME,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const queries = Object.entries({ me, emojis, meta, nodeInfo });

  const queryClient = useQueryClient();

  function reload() {
    void queryClient.invalidateQueries();
    window.location.reload();
  }

  if (queries.some(([, q]) => q.isError)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleXIcon />
            </EmptyMedia>
            <EmptyTitle>Error</EmptyTitle>
            <EmptyDescription>
              <ul>
                {queries.map(
                  ([k, q]) =>
                    q.error && (
                      <li key={k}>
                        <b>
                          {k}
                          :&nbsp;
                        </b>
                        <span>{q.error.message}</span>
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

  if (queries.some(([, q]) => !q.data)) {
    return (
      <div className="h-screen w-screen">
        <div className="absolute flex h-screen w-screen items-center justify-center">
          <Spinner className="size-8" />
        </div>
        <ul className="p-4 font-mono text-sm">
          <li>Booting Papilio...</li>
          {queries.map(([k, query]) => (
            <li key={k}>
              {query.isLoading ? (
                <span className="text-yellow-500">[LOADING]</span>
              ) : (
                <span className="text-green-500">[OK]</span>
              )}
              &nbsp;
              {k}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // all loaded
  return (
    <MeContext value={me.data!}>
      <EmojisContext
        value={{
          emojis: emojis.data!,
          emojisMap: new Map(emojis.data!.map((e) => [e.name, e])),
        }}
      >
        <SiteMetaContext value={meta.data!}>
          <NodeInfoContext value={nodeInfo.data!}>{props.children}</NodeInfoContext>
        </SiteMetaContext>
      </EmojisContext>
    </MeContext>
  );
};
