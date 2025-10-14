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
    <DefaultLayout tabs={tabs} title={title}>
      {(tab) => (
        <div>
          <MkPostForm className="border" />
          <MkTimeline type={tab.value} />
        </div>
      )}
    </DefaultLayout>
  );
}
