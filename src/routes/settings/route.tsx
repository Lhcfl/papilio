/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DefaultLayout } from '@/layouts/default-layout';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings } from '@/settings';
import { createFileRoute, Outlet, useChildMatches } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const page = useChildMatches({
    select: (ms) => ms.find((m) => m.routeId == '/settings/$page')?.params.page,
  });

  const pageContent = page ? DetailedSettings.find((p) => p.value === page) : undefined;
  const title = pageContent?.name ?? t('settings');
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <DefaultLayout
      title={title}
      headerRight={
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={t('search')}
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value.trim().toLocaleLowerCase());
            }}
          />
        </InputGroup>
      }
    >
      <Outlet />
    </DefaultLayout>
  );
}
