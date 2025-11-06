/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkAvatar } from '@/components/mk-avatar';
import { MkCustomEmoji, MkEmoji } from '@/components/mk-emoji';
import { MkTime } from '@/components/mk-time';
import { MkUserName } from '@/components/mk-user-name';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia } from '@/components/ui/item';
import { misskeyApi } from '@/services/inject-misskey-api';

export function NoteReactionsList({ noteId }: { noteId: string }) {
  return (
    <ItemGroup>
      <MkInfiniteScroll
        queryKey={['notes/reactions', noteId]}
        queryFn={({ pageParam }) => misskeyApi('notes/reactions', { noteId, untilId: pageParam, limit: 50 })}
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
              <ItemMedia variant="image">
                {x.type.startsWith(':') ? <MkCustomEmoji name={x.type} /> : <MkEmoji emoji={x.type} />}
              </ItemMedia>
            </Item>
            <div className="border-b" />
          </>
        )}
      </MkInfiniteScroll>
    </ItemGroup>
  );
}
