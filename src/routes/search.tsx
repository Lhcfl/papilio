/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { SearchIcon, TextInitialIcon, UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <DefaultLayout
      title={t('search')}
      tabs={[
        { value: 'notes', label: t('notes'), icon: <TextInitialIcon />, comp: <NoteSearch /> },
        { value: 'users', label: t('users'), icon: <UserRoundIcon />, comp: <UserSearch /> },
      ]}
    />
  );
}

function NoteSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');

  return (
    <div>
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

      {query.trim() != '' && (
        <div className="search-result mt-4">
          <Separator />
          <div className="p-2 search-result-label text-sm text-muted-foreground">{t('searchResult')}</div>
          <MkInfiniteScroll
            queryKey={['search/notes', query]}
            queryFn={({ pageParam }) =>
              misskeyApi('notes/search', {
                query,
                untilId: pageParam,
              }).then((ns) => registerNote(ns))
            }
          >
            {(nid) => <MkNote noteId={nid} key={nid} />}
          </MkInfiniteScroll>
        </div>
      )}
    </div>
  );
}

function UserSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');

  return (
    <div>
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
      {query}
    </div>
  );
}
