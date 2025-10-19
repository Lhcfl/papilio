/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkFollowRequest } from '@/components/mk-follow-request';
import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';

const ReceivedFollowRequests = () => (
  <MkInfiniteScroll
    queryFn={({ pageParam }) =>
      misskeyApi('following/requests/list', {
        untilId: pageParam,
      })
    }
    queryKey={['follow-requests', 'received']}
  >
    {(recv) => <MkFollowRequest user={recv.follower} type="received" />}
  </MkInfiniteScroll>
);

export const Route = createFileRoute('/my/follow-requests/received')({
  component: ReceivedFollowRequests,
});
