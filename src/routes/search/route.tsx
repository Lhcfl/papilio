/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryAtom } from '@/routes/search/-atoms';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useSetAtom } from 'jotai';
import { SearchIcon, TextInitialIcon, UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search')({
  beforeLoad: (ctx) => {
    if (ctx.location.pathname === '/search') {
      return redirect({ to: '/search/note', replace: true });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const { q } = Route.useSearch() as { q?: string };
  const setQuery = useSetAtom(queryAtom);
  const [searchText, setSearchText] = useState(q);

  return (
    <div>
      <PageTitle title={t('search')} />
      <AppPageTabList>
        <AppPageTab value="/search/note" label={t('notes')} icon={<TextInitialIcon />} />
        <AppPageTab value="/search/user" label={t('users')} icon={<UserRoundIcon />} />
      </AppPageTabList>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={searchText}
          placeholder={t('search')}
          onInput={(e) => {
            setSearchText(e.currentTarget.value);
          }}
          onKeyUp={(e) => {
            if (e.key == 'Enter') {
              setQuery(e.currentTarget.value);
            }
          }}
        />
      </InputGroup>
      <Outlet />
    </div>
  );
}
