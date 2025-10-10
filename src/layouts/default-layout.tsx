import { useTitle } from 'react-use'
import { toast } from 'sonner'
import { AppRightCard } from '@/components/app-right-card'
import { AppSidebar } from '@/components/app-sidebar'
import { MkNotificationToast } from '@/components/mk-notification-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MisskeyGlobalProvider } from '@/providers/misskey-global'

type DefaultLayoutPropsCommon = {
  title?: string
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
}

type DefaultLayoutPropsTab<T extends string = string> = DefaultLayoutPropsCommon & {
  tabs: Tab<T>[]
  children: (tab: Tab<T>) => React.ReactNode
}

type DefaultLayoutPropsNoTab = DefaultLayoutPropsCommon & {
  tabs?: undefined
  children?: React.ReactNode
  headerCenter?: React.ReactNode
}

type DefaultLayoutProps<T extends string = string>
  = | DefaultLayoutPropsTab<T>
    | DefaultLayoutPropsNoTab

export function DefaultLayout<T extends string = string>(props: DefaultLayoutProps<T>) {
  const stream = injectMisskeyStream()

  useEffect(() => {
    const connection = stream.useChannel('main')
    if (import.meta.env.DEV) {
      console.log('subscribed to main channel')
    }

    connection.on('notification', (n) => {
      toast.custom(id => <MkNotificationToast key={`toast-${id}`} notification={n} />)
    })

    return () => {
      if (import.meta.env.DEV) {
        console.log('main channel disposed')
      }
      connection.dispose()
    }
  })

  return (
    <MisskeyGlobalProvider>
      <SidebarLayout {...props} />
      <Toaster />
    </MisskeyGlobalProvider>
  )
}

function SidebarLayout<T extends string = string>(props: DefaultLayoutProps<T>) {
  const { meta, me } = useMisskeyGlobal()
  const { tabs, title = meta.name ?? 'papilio', children, ...rest } = props
  useTitle(title)
  useNoteUpdateListener({ meId: me.id })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="grid grid-cols-[1fr_auto]">
        <div className="main-container">
          { tabs
            ? (
                <Tabs defaultValue={tabs[0]?.value}>
                  <LayoutCenter
                    {...rest}
                    title={title}
                    headerCenter={(
                      <TabsList>
                        {tabs.map(tab => (
                          <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.icon}
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    )}
                  >
                    {tabs.map(tab => (
                      <TabsContent key={tab.value} value={tab.value}>
                        {children(tab)}
                      </TabsContent>
                    ))}
                  </LayoutCenter>
                </Tabs>
              )
            : (
                <div>
                  <LayoutCenter {...props} title={title} headerCenter={props.headerCenter}>
                    {children}
                  </LayoutCenter>
                </div>
              )}
        </div>
        <div className="right-card-container p-2 border-l max-lg:hidden">
          <AppRightCard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function LayoutCenter(props: DefaultLayoutPropsCommon & {
  title: string
  headerCenter: React.ReactNode
  children: React.ReactNode
}) {
  const { title, children,
    headerLeft = <span className="text-sm text-muted-foreground">{title}</span>,
    headerCenter, headerRight } = props
  return (
    <ScrollArea className="h-screen">
      <header className="flex gap-1 items-center p-2 sticky top-0 bg-background border-b z-10">
        <SidebarTrigger className="size-8" />
        <div>
          {headerLeft}
        </div>
        <div className="flex-grow-1 w-0 text-center">
          {headerCenter}
        </div>
        <div>
          {headerRight}
        </div>
      </header>
      <div className="p-2">
        { children }
      </div>
    </ScrollArea>
  )
}
