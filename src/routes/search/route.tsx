/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { PageTitle } from '@/layouts/sidebar-layout';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { TextInitialIcon, UserRoundIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/search')({
  beforeLoad: (ctx) => {
    if (ctx.location.pathname === '/search') {
      return redirect({ to: '/search/note', replace: true });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle title={t('search')} />
      <AppPageTabList>
        <AppPageTab value="/search/note" label={t('notes')} icon={<TextInitialIcon />} />
        <AppPageTab value="/search/user" label={t('users')} icon={<UserRoundIcon />} />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
