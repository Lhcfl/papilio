/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScrollByData } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkMention } from '@/components/mk-mention';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { UsersFollowersResponse } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export function RelationInfinityLoaderTable(props: { children: React.ReactNode; className?: string }) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead />
          <TableHead>{t('username')}</TableHead>
          <TableHead>{t('name')}</TableHead>
          <TableHead>{t('createdAt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{props.children}</TableBody>
    </Table>
  );
}

export function RelationInfinityLoader(props: {
  query: UseInfiniteQueryResult<InfiniteData<UsersFollowersResponse>>;
  selected: Set<string>;
  setSelected: (newSet: Set<string>) => void;
  removed: Set<string>;
  kind: 'follower' | 'followee';
}) {
  const { query, selected, setSelected, removed, kind } = props;

  const Arrow = props.kind === 'followee' ? ArrowRight : ArrowLeft;

  return (
    <MkInfiniteScrollByData infiniteQueryResult={query} dataContainer={RelationInfinityLoaderTable}>
      {(relation) => {
        const displayUser = relation[kind]!;
        return removed.has(displayUser.id) ? null : (
          <TableRow>
            <TableCell>
              <Checkbox
                checked={selected.has(displayUser.id)}
                onCheckedChange={(checked) => {
                  if (checked && selected.has(displayUser.id)) {
                    return;
                  }
                  if (!checked && !selected.has(displayUser.id)) {
                    return;
                  }
                  const newSet = new Set(selected);
                  if (checked) {
                    newSet.add(displayUser.id);
                  } else {
                    newSet.delete(displayUser.id);
                  }
                  setSelected(newSet);
                }}
              />
            </TableCell>
            <TableCell>
              <Arrow className="size-4" />
            </TableCell>
            <TableCell>
              <MkMention username={displayUser.username} host={displayUser.host} />
            </TableCell>
            <TableCell>
              <MkUserName user={displayUser} />
            </TableCell>
            <TableCell>
              <MkTime time={relation.createdAt} />
            </TableCell>
          </TableRow>
        );
      }}
    </MkInfiniteScrollByData>
  );
}
