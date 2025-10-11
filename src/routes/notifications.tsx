import { MkNotifications } from '@/components/mk-notifications'
import { DefaultLayout } from '@/layouts/default-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DefaultLayout>
      <MkNotifications />
    </DefaultLayout>
  )
}
