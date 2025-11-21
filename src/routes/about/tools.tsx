/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { PageTitle } from '@/layouts/sidebar-layout';
import { clearCache } from '@/loaders/clear-cache';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { RecycleIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/about/tools')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: clearCacheMutate, isPending: isClearingCache } = useMutation({
    mutationKey: ['clearCache'],
    mutationFn: async () => clearCache(queryClient),
  });

  return (
    <div>
      <PageTitle title={t('tools')} />
      <section>
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>{t('clearCache')}</ItemTitle>
              <ItemDescription>
                用于解决缓存数据与服务器数据不一致问题。如果 Emojis 显示异常，建议清除缓存。
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                onClick={() => {
                  clearCacheMutate();
                }}
                disabled={isClearingCache}
              >
                {isClearingCache ? <Spinner /> : <RecycleIcon />}
                {t('clearCache')}
              </Button>
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Force Clear Cache</ItemTitle>
              <ItemDescription>
                如果上面的清除缓存功能无法解决问题，可以尝试使用此功能强制清除缓存。会将所有的缓存数据全部删除。
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="destructive"
                onClick={() => {
                  void queryClient.invalidateQueries();
                  location.reload();
                }}
              >
                <Trash2Icon />
                Force Clear Cache
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </section>
    </div>
  );
}
