/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkAvatar } from '@/components/mk-avatar';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia } from '@/components/ui/item';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { RepeatIcon } from 'lucide-react';

export function NoteRenotesList({ noteId }: { noteId: string }) {
  return (
    <ItemGroup>
      <MkInfiniteScroll
        queryKey={['notes/renotes', noteId]}
        queryFn={({ pageParam }) => misskeyApi('notes/renotes', { noteId, untilId: pageParam, limit: 50 })}
      >
        {(x) => (
          <>
            <Item role="listitem">
              <ItemMedia>
                <MkAvatar user={x.user} avatarProps={{ className: 'size-10' }} />
              </ItemMedia>
              <ItemContent>
                <ItemHeader>
                  <MkUserName user={x.user} />
                </ItemHeader>
                <ItemDescription>
                  <MkTime time={x.createdAt} />
                </ItemDescription>
              </ItemContent>
              <ItemMedia variant="icon">
                <RepeatIcon />
              </ItemMedia>
            </Item>
            <div className="border-b" />
          </>
        )}
      </MkInfiniteScroll>
    </ItemGroup>
  );
}
