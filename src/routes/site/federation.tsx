import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { BanIcon, Link2Icon } from 'lucide-react';
import type { FederationInstance } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/site/federation')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <Tabs defaultValue="federating">
        <TabsList>
          <TabsTrigger value="federating">
            <Link2Icon /> {t('federating')}
          </TabsTrigger>
          <TabsTrigger value="blocked">
            <BanIcon /> {t('blockedInstances')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="blocked">
          <MkInfiniteScroll
            queryKey={['/federation/instances', 'blocked']}
            queryFn={() =>
              misskeyApi('federation/instances', {
                blocked: true,
              })
            }
          >
            {(item) => <InstanceItem item={item} />}
          </MkInfiniteScroll>
        </TabsContent>
        <TabsContent value="federating">
          <MkInfiniteScroll
            queryKey={['/federation/instances', 'federating']}
            queryFn={() =>
              misskeyApi('federation/instances', {
                federating: true,
              })
            }
          >
            {(item) => <InstanceItem item={item} />}
          </MkInfiniteScroll>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InstanceItem({ item }: { item: FederationInstance }) {
  return (
    <Item>
      <ItemMedia>
        <Avatar>
          <AvatarImage src={item.iconUrl ?? ''} />
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemDescription>
          {item.host} / {item.softwareName} {item.softwareVersion}{' '}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
