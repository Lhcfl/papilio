import { MkFollowRequest } from '@/components/mk-follow-request';
import { MkInfiniteScroll } from '@/components/mk-infinite-scroll';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/follow-requests/sent')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MkInfiniteScroll
      queryFn={({ pageParam }) =>
        misskeyApi('following/requests/sent', {
          untilId: pageParam,
        })
      }
      queryKey={['follow-requests', 'sent']}
    >
      {(recv) => <MkFollowRequest user={recv.followee} type="sent" />}
    </MkInfiniteScroll>
  );
}
