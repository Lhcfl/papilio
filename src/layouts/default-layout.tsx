import { useTitle } from 'react-use'
import { AppRightCard } from '@/components/app-right-card'
import { AppSidebar } from '@/components/app-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WithLoginLoader } from '@/loaders/with-login'
import type { Tab } from '@/types/page-header'
import { atom, useAtom } from 'jotai'

type DefaultLayoutPropsCommon = {
  title?: string
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
}

type DefaultLayoutPropsTab<Ts extends Tab[]> = DefaultLayoutPropsCommon & {
  tabs: Ts
  children: (tab: Ts[number]) => React.ReactNode
  onTabChange?: (value: Ts[number]['value']) => void
  headerRightWhenTab?: (tab: Ts[number]['value']) => React.ReactNode
}

type DefaultLayoutPropsNoTab = DefaultLayoutPropsCommon & {
  tabs?: undefined
  children?: React.ReactNode
  onTabChange?: undefined
  headerCenter?: React.ReactNode
  headerRightWhenTab?: undefined
}

type DefaultLayoutProps<Ts extends Tab[]>
  = | DefaultLayoutPropsTab<Ts>
    | DefaultLayoutPropsNoTab

export function DefaultLayout<Ts extends Tab[]>(props: DefaultLayoutProps<Ts>) {
  return (
    <WithLoginLoader>
      <SidebarLayout {...props} />
      <Toaster />
    </WithLoginLoader>
  )
}

function SidebarLayout<Ts extends Tab[]>(props: DefaultLayoutProps<Ts>) {
  const siteName = useSiteMeta(s => s.name)
  const { tabs, onTabChange, headerRightWhenTab, title = siteName ?? 'papilio', children, ...rest } = props
  useTitle(title)
  useNoteUpdateListener()
  useMainChannelListener()
  const [tab, setTab] = useState(tabs?.[0].value)
  const handleTabChange = (value: string) => {
    setTab(value)
    if (onTabChange) {
      onTabChange(value as Ts[number]['value'])
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="grid grid-cols-[1fr_auto]">
        <div className="main-container">
          { tabs
            ? (
                <Tabs defaultValue={tabs[0]?.value} onValueChange={handleTabChange}>
                  <LayoutMiddle
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
                    headerRight={(
                      <>
                        {props.headerRight}
                        {tab && headerRightWhenTab?.(tab)}
                      </>
                    )}
                  >
                    {tabs.map(tab => (
                      <TabsContent key={tab.value} value={tab.value}>
                        {(children as (tab: Tab) => React.ReactNode)(tab)}
                      </TabsContent>
                    ))}
                  </LayoutMiddle>
                </Tabs>
              )
            : (
                <div>
                  <LayoutMiddle {...props} title={title}>
                    {children as React.ReactNode}
                  </LayoutMiddle>
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

function LayoutMiddle(props: DefaultLayoutPropsCommon & {
  title: string
  headerCenter?: React.ReactNode
  children: React.ReactNode
}) {
  const { title, children,
    headerLeft = <span className="text-sm text-muted-foreground">{title}</span>,
    headerCenter, headerRight } = props
  return (
    <ScrollArea className="h-screen">
      <header className="h-13 flex gap-1 items-center p-2 sticky top-0 bg-background border-b z-30">
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
