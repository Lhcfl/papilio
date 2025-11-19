/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AtSignIcon, BellIcon, MailIcon } from 'lucide-react';
import { PageTitle } from '@/layouts/sidebar-layout';
import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';

export const Route = createFileRoute('/my/notifications')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle title={t('notifications')} />
      <AppPageTabList>
        <AppPageTab value="/my/notifications" label={t('all')} icon={<BellIcon />} />
        <AppPageTab value="/my/notifications/mentions" label={t('mentions')} icon={<AtSignIcon />} />
        <AppPageTab value="/my/notifications/pm" label={t('directNotes')} icon={<MailIcon />} />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
