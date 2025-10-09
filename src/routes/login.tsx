import { createFileRoute } from '@tanstack/react-router'
import { permissions } from 'misskey-js'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { LoginLayout } from '@/layouts/login-layout'
import { storeUserSite, useMisskeyApi } from '@/services/use-misskey-api'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()

  const [domain, updateDomain] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate({ from: '/login' })

  useEffect(() => {
    try {
      // This is not a react hook, just a function call to check if the user is already logged in.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const api = useMisskeyApi()
      if (api != null) {
        navigate({ to: '/' })
      }
    }
    catch {
      return
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const session = `${crypto.randomUUID()}`

    const site
      = domain.startsWith('https://') || domain.startsWith('http://')
        ? domain
        : `https://${domain}`

    storeUserSite(site)

    const url = new URL(`/miauth/${session}`, site)

    url.searchParams.append('name', 'Papilio the another Misskey Client')
    url.searchParams.append(
      'callback',
      `${window.location.origin}/login-redirect`,
    )
    url.searchParams.append('permission', permissions.join(','))

    console.log(url.toString())

    setLoading(true)
    window.location.href = url.toString()
  }

  return (
    <LoginLayout>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{t('login')}</h1>
          </div>
          <Field>
            <FieldLabel htmlFor="domain">{t('_registry.domain')}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>https://</InputGroupAddon>
              <InputGroupInput
                id="domain"
                type="text"
                placeholder="example.com"
                required
                onChange={e => updateDomain(e.target.value)}
              />
            </InputGroup>
          </Field>
          <Field>
            <Button type="submit">
              {loading && <Spinner />}
              {t('login')}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </LoginLayout>
  )
}
