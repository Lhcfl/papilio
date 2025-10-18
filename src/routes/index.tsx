/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';

import { createFileRoute } from '@tanstack/react-router';
import { MkTimeline } from '@/components/mk-timeline';
import { DefaultLayout } from '@/layouts/default-layout';
import { useTimelineTabs } from '@/hooks/use-timeline-tabs';
import { MkPostForm } from '@/components/mk-post-form';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const tabs = useTimelineTabs();
  const title = t('timeline');

  return (
    <DefaultLayout tabs={tabs.map((tab) => ({ ...tab, comp: <MkTimeline type={tab.value} /> }))} title={title}>
      <MkPostForm className="border" />
    </DefaultLayout>
  );
}
