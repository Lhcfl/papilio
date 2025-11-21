import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { BadgeQuestionMarkIcon, GlobeIcon, WrenchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/site')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppPageTabList>
        <AppPageTab value="/site/about" icon={<BadgeQuestionMarkIcon />} label={t('instance')} />
        <AppPageTab value="/site/federation" icon={<GlobeIcon />} label={t('federation')} />
        <AppPageTab value="/site/tools" icon={<WrenchIcon />} label={t('tools')} />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
