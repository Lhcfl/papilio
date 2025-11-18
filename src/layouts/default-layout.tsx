/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState } from 'react';
import { useMedia, useTitle } from 'react-use';
import { AppSidebar } from '@/components/app-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteMeta } from '@/stores/site';
import { DesktopRightbar } from '@/providers/rightbar-or-popup';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from '@tanstack/react-router';
import type { Tab } from '@/types/page-header';
import { AppNavBar } from '@/components/app-nav-bar';
import { getHeaderLeftId, getHeaderRightId } from '@/providers/window-provider';

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
  const siteName = useSiteMeta((s) => s.name);
  const navigate = useNavigate();
  const location = useLocation();
  const smbreakpoint = useMedia('(max-width: 40rem)');

  const { isRouteTab, tabs = [], onTabChange, title, pageTitle, children, ...rest } = props;

  useTitle(pageTitle ?? (title ? `${title} · ${siteName}` : (siteName ?? 'Papilio')));

  const [currentTabValue, setTabValue] = useState(tabs.at(0)?.value);
  const removedTailingSlashPathname = location.pathname.replace(/\/+$/, '') || '/';
  const actualCurrentTab = tabs.find(
    (tab) => tab.value === (isRouteTab ? removedTailingSlashPathname : currentTabValue),
  );

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
      <SidebarInset className="grid grid-cols-[minmax(0,1fr)_auto]">
        <Tabs
          onValueChange={handleTabChange}
          value={actualCurrentTab?.value ?? 'default'}
          className="main-container h-dvh gap-0"
        >
          <LayoutMiddle
            className="h-0 flex-[1_1]"
            {...rest}
            title={title}
            headerCenter={
              tabs.length > 0 && (
                <TabsList>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.icon}
                      <span
                        className={cn({
                          '@max-xl:hidden': tab.value != actualCurrentTab?.value,
                        })}
                      >
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              )
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
          {smbreakpoint && <AppNavBar />}
        </Tabs>
        <div className="right-container max-lg:hidden">
          <DesktopRightbar />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LayoutMiddle(props: {
  title?: string;
  className?: string;
  headerRight?: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerLeft?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { title, className, children, headerCenter, headerRight, headerLeft } = props;
  return (
    <ScrollArea className={className} id="main-scroll-area">
      <header className="bg-background @container sticky top-0 z-30 h-13 gap-1 border-b p-2">
        <div className="relative flex h-full w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <SidebarTrigger className="-mr-2 size-8 max-sm:hidden" />
            <div id={getHeaderLeftId('ptrb-header')} />
            {headerLeft ?? (
              <span
                className={cn('text-muted-foreground text-sm', {
                  '@max-xl:hidden': !!headerCenter,
                })}
              >
                {title}
              </span>
            )}
          </div>
          <div className="@sm:absolute @sm:top-1/2 @sm:left-1/2 @sm:-translate-x-1/2 @sm:-translate-y-1/2">
            {headerCenter}
          </div>
          <div className="flex items-center">
            <div id={getHeaderRightId('ptrb-header')} />
            {headerRight}
          </div>
        </div>
      </header>
      <div className="flex justify-center p-2">
        <div className="main-area w-0 max-w-200 flex-[1_1]">{children}</div>
      </div>
    </ScrollArea>
  );
}
