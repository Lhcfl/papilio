import { MkMentionsList } from '@/components/mk-mentions-list'
import { MkNotifications } from '@/components/mk-notifications'
import { DefaultLayout } from '@/layouts/default-layout'
import { createFileRoute } from '@tanstack/react-router'
import { AtSignIcon, BellIcon, MailIcon } from 'lucide-react'

export const Route = createFileRoute('/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  return (
    <DefaultLayout
      title={t('notifications')}
      tabs={[
        { icon: <BellIcon />, label: t('all'), value: 'all', comp: <MkNotifications /> },
        { icon: <AtSignIcon />, label: t('mentions'), value: 'mentions', comp: <MkMentionsList /> },
        { icon: <MailIcon />, label: t('directNotes'), value: 'pm', comp: <MkMentionsList visibility="specified" /> },
      ]}
    >
      {tab => tab.comp}
    </DefaultLayout>
  )
}
