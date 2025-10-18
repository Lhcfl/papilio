import { useTranslation } from 'react-i18next';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AtSignIcon, BellIcon, MailIcon } from 'lucide-react';
import { NotificationsHeaderRight } from '.';

export const Route = createFileRoute('/my/notifications')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <DefaultLayout
      title={t('notifications')}
      isRouteTab
      tabs={
        [
          {
            icon: <BellIcon />,
            label: t('all'),
            value: '/my/notifications',
            headerRight: <NotificationsHeaderRight />,
          },
          { icon: <AtSignIcon />, label: t('mentions'), value: '/my/notifications/mentions' },
          {
            icon: <MailIcon />,
            label: t('directNotes'),
            value: '/my/notifications/pm',
          },
        ] as const
      }
    >
      <Outlet />
    </DefaultLayout>
  );
}
