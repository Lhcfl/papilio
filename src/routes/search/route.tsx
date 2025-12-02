/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { registerNote } from '@/hooks/note';
import { noteQueryOptions } from '@/hooks/note-query';
import { PageTitle } from '@/layouts/sidebar-layout';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryAtom } from '@/routes/search/-atoms';
import { useConfirmDialog } from '@/stores/confirm-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { SearchIcon, TextInitialIcon, UserRoundIcon } from 'lucide-react';
import { acct } from 'misskey-js';
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
  const [query, setQuery] = useAtom(queryAtom);
  const [searchText, setSearchText] = useState(query);
  const pushDialog = useConfirmDialog((s) => s.pushDialog);
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  function handleSearch(input: string) {
    const query = input.trim();
    if (query.startsWith('@')) {
      pushDialog({
        title: t('lookupConfirm'),
        description: t('aSeemsLikeB', { a: query, b: t('username') }),
        onConfirm: () => {
          return navigate({ to: '/@{$acct}', params: { acct: query.slice(1) } });
        },
        onCancel: () => {
          setQuery(query);
        },
      });
      return;
    }
    if (query.startsWith('#')) {
      pushDialog({
        title: t('openTagPageConfirm'),
        description: t('aSeemsLikeB', { a: query, b: t('_mfm.hashtag') }),
        onConfirm: () => {
          return navigate({ to: '/tag/$tag', params: { tag: query.slice(1) } });
        },
        onCancel: () => {
          setQuery(query);
        },
      });
      return;
    }
    if (query.startsWith('https://')) {
      pushDialog({
        title: t('lookupConfirm'),
        description: t('aSeemsLikeB', { a: query, b: t('noteIdOrUrl') }),
        onConfirm: () =>
          misskeyApi('ap/show', { uri: query })
            .then((res) => {
              switch (res.type) {
                case 'User':
                  return navigate({ to: '/@{$acct}', params: { acct: acct.toString(res.object) } });
                case 'Note':
                  registerNote([res.object]);
                  queryClient.setQueryData(noteQueryOptions(res.object.id).queryKey, res.object.id);
                  return navigate({ to: '/notes/$id', params: { id: res.object.id } });
              }
            })
            .catch(() => {
              setQuery(query);
            }),
        onCancel: () => {
          setQuery(query);
        },
      });
      return;
    }
    setQuery(query);
  }

  return (
    <div>
      <PageTitle title={t('search')} />
      <AppPageTabList>
        <AppPageTab value="/search/note" label={t('notes')} icon={<TextInitialIcon />} />
        <AppPageTab value="/search/user" label={t('users')} icon={<UserRoundIcon />} />
      </AppPageTabList>
      <InputGroup>
        <InputGroupInput
          value={searchText || query}
          placeholder={t('search')}
          onInput={(e) => {
            setSearchText(e.currentTarget.value);
          }}
          onKeyUp={(e) => {
            if (e.key == 'Enter') {
              handleSearch(e.currentTarget.value);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => {
              handleSearch(searchText);
            }}
            title={t('search')}
          >
            <SearchIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <Outlet />
    </div>
  );
}
