/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DefaultLayout } from '@/layouts/default-layout';
import { useTimelineTabs } from '@/hooks/use-timeline-tabs';
import { MkPostForm } from '@/components/mk-post-form';

export const Route = createFileRoute('/_timeline')({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const tabs = useTimelineTabs();
  const title = t('timeline');

  return (
    <DefaultLayout
      isRouteTab
      tabs={tabs.map((tab) => ({
        ...tab,
        value: tab.value == 'home' ? '/' : `/${tab.value}-timeline`,
      }))}
      title={title}
    >
      <MkPostForm className="mb-2 border" autoFocus={false} />
      <Outlet />
    </DefaultLayout>
  );
}
