/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTabs } from '@/components/app-page-tab';

import { PageTitle } from '@/layouts/sidebar-layout';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { MailIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/follow-requests')({
  beforeLoad: (ctx) => {
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
    <>
      <PageTitle title={t('followRequests')} />
      <AppPageTabs
        tabs={[
          {
            value: '/my/follow-requests/received',
            label: t('_followRequest.recieved'),
            icon: <MailIcon />,
          },
          { value: '/my/follow-requests/sent', label: t('_followRequest.sent'), icon: <SendIcon /> },
        ]}
      />
      <Outlet />
    </>
  );
}
