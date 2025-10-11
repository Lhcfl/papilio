import { MkError } from '@/components/mk-error'
import { MkNote } from '@/components/mk-note'
import { Spinner } from '@/components/ui/spinner'
import { DefaultLayout } from '@/layouts/default-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { id } = Route.useParams()
  const { data, isPending, error, refetch } = useNoteQuery(id)

  return (
    <DefaultLayout title={t('note')}>
      {isPending && <Spinner />}
      {error && <MkError error={error} retry={() => refetch()} />}
      {data && <MkNote noteId={id} />}
    </DefaultLayout>
  )
}
