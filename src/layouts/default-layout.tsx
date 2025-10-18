import { useState } from 'react';
import { useTitle } from 'react-use';
import { AppSidebar } from '@/components/app-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WithLoginLoader } from '@/loaders/with-login';
import { useSiteMeta } from '@/stores/site';
import { useNoteUpdateListener } from '@/hooks/use-note';
import { useMainChannelListener } from '@/hooks/use-main-channel';
import { RightbarOrPopupProvider } from '@/providers/rightbar-or-popup';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from '@tanstack/react-router';
import type { Tab } from '@/types/page-header';
interface SidebarLayoutProps<Ts extends Tab[]> {
  isRouteTab?: boolean;
  title?: string;
  pageTitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  tabs?: Ts;
  onTabChange?: (value: Ts[number]['value']) => void;
  children?: React.ReactNode;
}

export function DefaultLayout<Ts extends Tab[]>(props: SidebarLayoutProps<Ts>) {
  return (
    <WithLoginLoader>
      <SidebarLayout {...props} />
      <Toaster />
    </WithLoginLoader>
  );
}

function SidebarLayout<Ts extends Tab[]>(props: SidebarLayoutProps<Ts>) {
  const siteName = useSiteMeta((s) => s.name);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isRouteTab,
    tabs,
    onTabChange,
    title = siteName ?? 'papilio',
    pageTitle = `${title} · ${siteName}`,
    children,
    ...rest
  } = props;

  useTitle(pageTitle);
  useNoteUpdateListener();
  useMainChannelListener();

  const [currentTabValue, setTabValue] = useState(tabs?.[0].value);
  const actualCurrentTab = tabs?.find((tab) => tab.value === (isRouteTab ? location.pathname : currentTabValue));

  const handleTabChange = (value: string) => {
    setTabValue(value);
    if (isRouteTab) {
      void navigate({ to: value });
    }
    if (onTabChange) {
      onTabChange(value as Ts[number]['value']);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="grid grid-cols-[1fr_auto]">
        <div className="main-container">
          {tabs ? (
            <Tabs onValueChange={handleTabChange} value={actualCurrentTab?.value}>
              <LayoutMiddle
                {...rest}
                title={title}
                headerCenter={
                  <TabsList>
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.icon}
                        <span
                          className={cn({
                            'max-sm:hidden': tab.value != actualCurrentTab?.value,
                          })}
                        >
                          {tab.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                }
                headerRight={
                  <>
                    {actualCurrentTab?.headerRight}
                    {props.headerRight}
                  </>
                }
              >
                {children}
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.comp}
                  </TabsContent>
                ))}
              </LayoutMiddle>
            </Tabs>
          ) : (
            <div>
              <LayoutMiddle {...props} title={title}>
                {children}
              </LayoutMiddle>
            </div>
          )}
        </div>
        <RightbarOrPopupProvider />
      </SidebarInset>
    </SidebarProvider>
  );
}

function LayoutMiddle(props: {
  title: string;
  headerRight?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerLeft?: React.ReactNode;
  children: React.ReactNode;
}) {
  const {
    title,
    children,
    headerCenter,
    headerRight,
    headerLeft = (
      <span
        className={cn('text-sm text-muted-foreground', {
          'max-sm:hidden': !!headerCenter,
        })}
      >
        {title}
      </span>
    ),
  } = props;
  return (
    <ScrollArea className="h-screen">
      <header className="h-13 flex gap-1 items-center p-2 sticky top-0 bg-background border-b z-30">
        <SidebarTrigger className="size-8" />
        <div>{headerLeft}</div>
        <div className="flex-grow-1 w-0 text-center">{headerCenter}</div>
        <div>{headerRight}</div>
      </header>
      <div className="p-2">{children}</div>
    </ScrollArea>
  );
}
