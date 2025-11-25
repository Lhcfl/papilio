/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/relations')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppPageTabList>
        <AppPageTab value="/my/relations/followers" icon={<ArrowLeftIcon />} label={t('followers')} />
        <AppPageTab value="/my/relations/following" icon={<ArrowRightIcon />} label={t('following')} />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
