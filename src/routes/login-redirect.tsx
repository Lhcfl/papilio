import { DialogClose } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter, DialogHeader,
  DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { LoginLayout } from '@/layouts/login-layout'
import { injectCurrentSite, storeUserToken } from '@/services/inject-misskey-api'

export const Route = createFileRoute('/login-redirect')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      session: (search?.session as string) || '',
    }
  },
})

function RouteComponent() {
  const { session } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!session) {
      navigate({ to: '/login' })
      return
    }
    fetch(new URL(`/api/miauth/${session}/check`, injectCurrentSite()), {
      method: 'POST',
    })
      .then(res => res.json())
      .then((res) => {
        if (res.ok) {
          storeUserToken(res.token)
          navigate({ to: '/' })
        }
        else {
          setError(true)
        }
      })
  })

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setError(false)
      navigate({ to: '/login' })
    }
  }

  return (
    <LoginLayout>
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
      <Dialog open={error} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Failed to login. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button">Try Again</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LoginLayout>
  )
}
