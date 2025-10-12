import { useTranslation } from 'react-i18next';

import { createFileRoute } from '@tanstack/react-router';
import { MkTimeline } from '@/components/mk-timeline';
import { DefaultLayout } from '@/layouts/default-layout';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const tabs = useTimelineTabs();
  const title = t('timeline');

  return (
    <DefaultLayout tabs={tabs} title={title}>
      {(tab) => <MkTimeline type={tab.value} />}
    </DefaultLayout>
  );
}
