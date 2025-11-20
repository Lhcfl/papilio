/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { summaly } from '@misskey-dev/summaly';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { registerNote } from '@/hooks/use-note';
import { MkNoteSimple } from '@/components/mk-note-simple';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExpandIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

type SummalyResult = Awaited<ReturnType<typeof summaly>>;

export const MkLinkPreview = (props: { url: string; renoteId?: string | null } & React.ComponentProps<typeof Item>) => {
  const { url, className, renoteId, ...rest } = props;
  const { i18n } = useTranslation();
  const [rich, setRich] = useState(true);

  const { data } = useQuery({
    queryKey: ['link-preview', url],
    queryFn: () => {
      const urlurl = new URL(url);
      // TODO: CORS対策
      const path = new URL('/url', 'https://polished-shape-8bd2.lhcfllinca.workers.dev/');
      path.searchParams.append('url', urlurl.href);
      path.searchParams.append('lang', i18n.language);
      return window.fetch(path).then((r) => r.json()) as Promise<SummalyResult>;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const title = data?.title ?? url;
  const thumbnail = data?.thumbnail ?? data?.icon;
  const apuri = data?.activityPub;

  const { data: apData } = useQuery({
    queryKey: ['ap-note', apuri],
    queryFn: () =>
      misskeyApi('ap/show', { uri: apuri! })
        .then((r) => {
          if (r.type === 'Note') {
            registerNote([r.object]);
          }
          return r;
        })
        .catch(() => ({ type: '_Nothing', object: null }) as const),
    enabled: apuri != null,
  });

  if (rich) {
    if (apData?.type == 'Note' && apData.object.id !== renoteId) {
      return (
        <div className={cn('note-body-quote overflow-hidden rounded-md border', className)}>
          <MkNoteSimple
            noteId={apData.object.id}
            appendHeader={
              <Button
                size="icon-sm"
                onClick={() => {
                  setRich(false);
                }}
              >
                <XIcon />
              </Button>
            }
          />
        </div>
      );
    }
  }

  return (
    <Item variant="outline" className={cn('wrap-anywhere', className)} {...rest} asChild size="sm">
      <a href={url} target="_blank">
        {data ? (
          <>
            {thumbnail && (
              <ItemMedia variant="image">
                <img src={thumbnail} />
              </ItemMedia>
            )}
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription className="text-wrap">{data.description}</ItemDescription>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Avatar className="size-3">
                  <AvatarImage src={data.icon ?? undefined} />
                </Avatar>
                {data.sitename}
              </div>
            </ItemContent>
            {!rich && (
              // why `!rich`? because when rich is false, there must be somthing to expand
              <ItemActions>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRich(true);
                  }}
                  size="icon"
                >
                  <ExpandIcon />
                </Button>
              </ItemActions>
            )}
          </>
        ) : (
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>
              <Spinner />
            </ItemDescription>
          </ItemContent>
        )}
      </a>
    </Item>
  );
};
