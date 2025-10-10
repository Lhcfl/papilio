import { createFileRoute } from '@tanstack/react-router'
import { MkTimeline } from '@/components/mk-timeline'
import { DefaultLayout } from '@/layouts/default-layout'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const tabs = useTimelineTabs()

  return (
    <DefaultLayout tabs={tabs}>
      {tab => (<MkTimeline type={tab.value} />)}
    </DefaultLayout>
  )
}
