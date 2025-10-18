/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkAvatar } from '@/components/mk-avatar';
import { MkUserName } from '@/components/mk-user-name';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginLayout } from '@/layouts/login-layout';
import { getAccountList, saveToAccountList } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusCircleIcon } from 'lucide-react';
import { APIClient } from 'misskey-js/api.js';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/account-switch')({
  component: RouteComponent,
  staticData: {
    noAuth: true,
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const saved_accounts = getAccountList();

  if (import.meta.env.DEV) {
    console.log('saved accounts:', saved_accounts);
  }

  return (
    <LoginLayout>
      <Card className="w-full max-w-md shadow-none">
        <CardContent>
          <CardTitle>{t('switchAccount')}</CardTitle>
          <ScrollArea>
            <div className="flex flex-col gap-2 my-2">
              {saved_accounts.map((account) => (
                <AccountItem key={account.site + ':' + account.token} site={account.site} token={account.token} />
              ))}
              <Button asChild>
                <Link to="/login" search={{ noredirect: true }}>
                  <PlusCircleIcon />
                  {t('addAccount')}
                </Link>
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </LoginLayout>
  );
}

function AccountItem(props: { token: string; site: string }) {
  const { site, token } = props;
  const api = new APIClient({ origin: site, credential: token });

  const { data: account } = useQuery({
    queryKey: ['account-me', props.site, props.token],
    queryFn: async () => api.request('i', {}),
  });

  function onClick() {
    saveToAccountList({ site, token });
    window.location.href = new URL('/', window.location.origin).toString();
  }

  return account ? (
    <Item asChild className="w-full hover:bg-accent flex-nowrap text-left">
      <button type="button" onClick={onClick}>
        <ItemMedia variant="image">
          <MkAvatar user={account} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <MkUserName user={account} />
          </ItemTitle>
          <div className="text-sm text-muted-foreground flex flex-col">
            <div>{site}</div>
            <div className="text-xs">
              <code>{token}</code>
            </div>
          </div>
        </ItemContent>
      </button>
    </Item>
  ) : (
    <Skeleton className="w-full h-10" />
  );
}
