/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderRightPortal } from '@/components/header-portal';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { queryAtom } from '@/routes/settings/-atoms';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <>
      <HeaderRightPortal>
        <InputGroup className="w-50 max-w-50">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            className="text-sm"
            placeholder={t('search')}
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value.trim().toLocaleLowerCase());
            }}
          />
        </InputGroup>
      </HeaderRightPortal>
      <Outlet />
    </>
  );
}
