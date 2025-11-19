/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkAnnouncement } from '@/components/mk-announcement';
import { misskeyApi } from '@/services/inject-misskey-api';

export function AnnouncementsList(props: { value: 'current' | 'previous' }) {
  return (
    <MkInfiniteScroll
      queryKey={['announcements', props.value]}
      queryFn={({ pageParam }) =>
        misskeyApi('announcements', { untilId: pageParam, isActive: props.value === 'current' })
      }
    >
      {(item) => <MkAnnouncement item={item} />}
    </MkInfiniteScroll>
  );
}
