/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AtSignIcon, BellIcon, MailIcon } from 'lucide-react';
import { PageTitle } from '@/layouts/sidebar-layout';
import { AppPageTabs } from '@/components/app-page-tab';

export const Route = createFileRoute('/my/notifications')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle title={t('notifications')} />
      <AppPageTabs
        tabs={
          [
            {
              icon: <BellIcon />,
              label: t('all'),
              value: '/my/notifications',
            },
            { icon: <AtSignIcon />, label: t('mentions'), value: '/my/notifications/mentions' },
            {
              icon: <MailIcon />,
              label: t('directNotes'),
              value: '/my/notifications/pm',
            },
          ] as const
        }
      />
      <Outlet />
    </>
  );
}
