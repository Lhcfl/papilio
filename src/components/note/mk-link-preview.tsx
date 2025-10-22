/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { summaly } from '@misskey-dev/summaly';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import clsx from 'clsx';

type SummalyResult = Awaited<ReturnType<typeof summaly>>;

export const MkLinkPreview = (props: { url: string } & React.ComponentProps<typeof Item>) => {
  const { url, className, ...rest } = props;
  const { i18n } = useTranslation();

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

  return (
    <Item variant="outline" className={clsx('break-words break-all', className)} {...rest} asChild size="sm">
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
