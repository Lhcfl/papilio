import { useTranslation } from 'react-i18next';
import { MkMentionsList } from '@/components/mk-mentions-list';
import { MkNotifications, MkNotificationsFilter } from '@/components/mk-notifications';
import { DefaultLayout } from '@/layouts/default-layout';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { createFileRoute } from '@tanstack/react-router';
import { atom, useAtomValue } from 'jotai';
import { AtSignIcon, BellIcon, MailIcon } from 'lucide-react';

export const Route = createFileRoute('/my/notifications')({
  component: RouteComponent,
});

const excludeTypes = atom<NotificationIncludeableType[]>([]);

function RouteComponent() {
  const { t } = useTranslation();
  const excludes = useAtomValue(excludeTypes);

  return (
    <DefaultLayout
      title={t('notifications')}
      tabs={
        [
          {
            icon: <BellIcon />,
            label: t('all'),
            value: 'all',
            comp: <MkNotifications excludeTypes={excludes} />,
            headerRight: <MkNotificationsFilter excludedAtom={excludeTypes} />,
          },
          { icon: <AtSignIcon />, label: t('mentions'), value: 'mentions', comp: <MkMentionsList /> },
          { icon: <MailIcon />, label: t('directNotes'), value: 'pm', comp: <MkMentionsList visibility="specified" /> },
        ] as const
      }
    >
      <></>
    </DefaultLayout>
  );
}
