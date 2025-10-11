import { CircleXIcon } from 'lucide-react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty'
import { Button } from './ui/button'
import { isAPIError, type APIError } from 'misskey-js/api.js'

export function MkError(props: { error: Error | APIError, retry?: () => void }) {
  const { error, retry } = props
  const { t } = useTranslation()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleXIcon />
        </EmptyMedia>
        <EmptyTitle>{t('error')}</EmptyTitle>
        <EmptyDescription>
          {error.message}
          <br />
          {isAPIError(error as APIError) && `(${(error as APIError).id})`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{retry && <Button onClick={retry}>{t('retry')}</Button>}</EmptyContent>
    </Empty>
  )
}
