import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { MailIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/follow-requests')({
  beforeLoad: (ctx) => {
    console.log(ctx);
    if (ctx.location.href === '/my/follow-requests') {
      return redirect({
        to: '/my/follow-requests/received',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <DefaultLayout
      title={t('followRequests')}
      isRouteTab
      tabs={[
        {
          value: '/my/follow-requests/received',
          label: t('_followRequest.recieved'),
          icon: <MailIcon />,
        },
        { value: '/my/follow-requests/sent', label: t('_followRequest.sent'), icon: <SendIcon /> },
      ]}
    >
      <Outlet />
    </DefaultLayout>
  );
}
