import { MkFollowRequest } from '@/components/mk-follow-request';
import { MkInfiniteScroll } from '@/components/mk-infinite-scroll';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';
import { MailIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/follow-requests')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <DefaultLayout
      title={t('followRequests')}
      tabs={[
        {
          value: 'received',
          label: t('_followRequest.recieved'),
          icon: <MailIcon />,
          comp: <ReceivedFollowRequests />,
        },
        { value: 'sent', label: t('_followRequest.sent'), icon: <SendIcon />, comp: <SentFollowRequests /> },
      ]}
    >
      {(tab) => tab.comp}
    </DefaultLayout>
  );
}

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

const SentFollowRequests = () => (
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
