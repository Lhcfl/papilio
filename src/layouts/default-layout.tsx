import { toast } from 'sonner'
import { AppRightCard } from '@/components/app-right-card'
import { AppSidebar } from '@/components/app-sidebar'
import { MkNotificationToast } from '@/components/mk-notification-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MisskeyGlobalProvider } from '@/providers/misskey-global'

export function DefaultLayout<T extends string = string>(props: {
  tabs: Tab<T>[]
  children: (tab: Tab<T>) => React.ReactNode
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
}) {
  const { tabs, children, headerLeft, headerRight } = props

  const stream = useMisskeyStream()

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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="grid grid-cols-[1fr_auto]">
          <div className="main-container">
            <Tabs defaultValue={tabs[0]?.value}>
              <ScrollArea className="h-screen">
                <header className="flex gap-1 items-center p-2 sticky top-0 bg-background border-b z-10">
                  <SidebarTrigger className="size-8" />
                  <div>{headerLeft}</div>
                  <div className="flex-grow-1 w-0 text-center">
                    <TabsList>
                      {tabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                          {tab.icon}
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  <div>{headerRight}</div>
                </header>
                <div className="p-2">
                  {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value}>
                      {children(tab)}
                    </TabsContent>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </div>
          <div className="right-card-container p-2 border-l max-lg:hidden">
            <AppRightCard />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </MisskeyGlobalProvider>
  )
}
