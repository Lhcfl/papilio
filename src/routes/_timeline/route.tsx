/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useTimelineTabs } from '@/hooks/use-timeline-tabs';
import { MkPostForm } from '@/components/mk-post-form';
import { PageTitle } from '@/layouts/sidebar-layout';
import { AppPageTabs } from '@/components/app-page-tab';

export const Route = createFileRoute('/_timeline')({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const tabs = useTimelineTabs();
  const title = t('timeline');

  return (
    <>
      <PageTitle title={title} />
      <AppPageTabs
        tabs={tabs.map((t) => ({
          ...t,
          value: t.value == 'home' ? '/' : `/${t.value}-timeline`,
        }))}
      />
      <MkPostForm className="mb-2 border" autoFocus={false} />
      <Outlet />
    </>
  );
}
