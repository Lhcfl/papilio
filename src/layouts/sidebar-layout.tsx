/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useMedia, useTitle } from 'react-use';
import { AppSidebar } from '@/components/app-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs } from '@/components/ui/tabs';
import { useNullableSiteMeta } from '@/stores/site';
import { DesktopRightbar } from '@/providers/rightbar-or-popup';
import { cn } from '@/lib/utils';
import { useRouterState } from '@tanstack/react-router';
import { AppNavBar } from '@/components/app-nav-bar';
import { getHeaderCenterId, getHeaderLeftId, getHeaderRightId } from '@/providers/window-provider';
import { HeaderLeftPortal } from '@/components/header-portal';

const SIDEBAR_HEADER_ID = 'ptrb-header';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const smbreakpoint = useMedia('(max-width: 40rem)');
  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="grid grid-cols-[minmax(0,1fr)_auto]">
        <Tabs className="main-container h-dvh gap-0">
          <ScrollArea className="h-0 flex-[1_1]" id="main-scroll-area">
            <header className="bg-background @container sticky top-0 z-30 h-13 gap-1 border-b">
              <div className="relative flex h-full w-full items-center justify-between p-2">
                <div className="flex items-center gap-1">
                  <SidebarTrigger className="-mr-2 size-8 max-sm:hidden" />
                  <div id={getHeaderLeftId(SIDEBAR_HEADER_ID)} />
                </div>
                <div
                  id={getHeaderCenterId(SIDEBAR_HEADER_ID)}
                  className="@sm:absolute @sm:top-1/2 @sm:left-1/2 @sm:-translate-x-1/2 @sm:-translate-y-1/2"
                />
                <div className="flex items-center" id={getHeaderRightId(SIDEBAR_HEADER_ID)} />
                {/* Loading indicator */}
                <div
                  className={cn('bg-tertiary absolute bottom-0 left-0 h-0.5 w-[95%] rounded-md transition-transform', {
                    'duration-3000 ease-out': isLoading,
                    '-translate-x-full duration-100': !isLoading,
                  })}
                />
              </div>
            </header>
            <div className="flex justify-center p-2">
              <div className="main-area w-0 max-w-200 flex-[1_1]">{children}</div>
            </div>
          </ScrollArea>
          {smbreakpoint && <AppNavBar />}
        </Tabs>
        <div className="right-container max-lg:hidden">
          <DesktopRightbar />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PageTitle({ title, pageTitle, noPortal }: { title: string; pageTitle?: string; noPortal?: boolean }) {
  const siteName = useNullableSiteMeta((s) => s.name);
  useTitle(pageTitle ?? (title ? `${title} · ${siteName}` : (siteName ?? 'Papilio')));

  if (noPortal) {
    return null;
  }

  return (
    <HeaderLeftPortal>
      <h1
        className={cn('text-muted-foreground text-sm', {
          // TODO: this should be controlled by center
          '@max-xl:hidden': true,
        })}
      >
        {title}
      </h1>
    </HeaderLeftPortal>
  );
}
