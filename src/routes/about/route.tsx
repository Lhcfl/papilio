import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { BadgeQuestionMarkIcon, GlobeIcon, WrenchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppPageTabList>
        <AppPageTab value="/about/instance" icon={<BadgeQuestionMarkIcon />} label={t('instance')} />
        <AppPageTab value="/about/federation" icon={<GlobeIcon />} label={t('federation')} />
        <AppPageTab value="/about/tools" icon={<WrenchIcon />} label={t('tools')} />
        <AppPageTab value="/about/papilio" icon={<BadgeQuestionMarkIcon />} label="Papilio" />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
