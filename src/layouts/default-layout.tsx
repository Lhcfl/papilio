/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect, useState } from 'react';
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
import { createPortal } from 'react-dom';
import { PORTALABLE_HEADER_LEFT_CLASSNAME, PORTALABLE_HEADER_RIGHT_CLASSNAME } from '@/components/app-portals';
import { AppNavBar } from '@/components/app-nav-bar';

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

export const HEADER_RIGHT_PORTAL_ID = 'sdbr__h-r-portal';

export function HeaderRightPortal(props: { children: React.ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // We have to set container in useEffect, because the element may not be present.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContainer(document.getElementById(HEADER_RIGHT_PORTAL_ID));
  }, []);
  if (!container) return null;
  else return createPortal(props.children, container);
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
                          'max-sm:hidden': tab.value != actualCurrentTab?.value,
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
      <header className="bg-background sticky top-0 z-30 flex h-13 items-center gap-1 border-b p-2">
        <SidebarTrigger className="size-8 max-sm:hidden" />
        <div className="flex items-center gap-1">
          <div className={PORTALABLE_HEADER_LEFT_CLASSNAME} data-ptrb-rank="0" />
          {headerLeft ?? (
            <span
              className={cn('text-muted-foreground text-sm', {
                'max-sm:hidden': !!headerCenter,
              })}
            >
              {title}
            </span>
          )}
        </div>
        <div className="w-0 flex-grow-1 text-center">{headerCenter}</div>
        <div className="flex items-center">
          <div className={PORTALABLE_HEADER_RIGHT_CLASSNAME} data-ptrb-rank="0" />
          <div id={HEADER_RIGHT_PORTAL_ID} />
          {headerRight}
        </div>
      </header>
      <div className="flex justify-center p-2">
        <div className="main-area w-0 max-w-200 flex-[1_1]">{children}</div>
      </div>
    </ScrollArea>
  );
}
