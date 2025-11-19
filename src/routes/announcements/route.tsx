/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CalendarCheckIcon, HourglassIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/announcements')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppPageTabList>
        <AppPageTab value="/announcements" label={t('currentAnnouncements')} icon={<HourglassIcon />} />
        <AppPageTab value="/announcements/previous" label={t('pastAnnouncements')} icon={<CalendarCheckIcon />} />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
