/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { AppSidebarHeader } from '@/components/sidebar/app-sidebar-header';
import { AppSidebarMain } from '@/components/sidebar/app-sidebar-main';
import { site, token } from '@/lib/inject-misskey-api';
import { LogoutSidebarFooter } from '@/components/sidebar/logout-sidebar-footer';
import { LogoutSidebarMain } from '@/components/sidebar/logout-sidebar-main';

export const AppSidebar = () => {
  if (token != null && site != null) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <AppSidebarHeader />
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarMain />
        </SidebarContent>
        <SidebarFooter>
          <AppSidebarFooter />
        </SidebarFooter>
      </Sidebar>
    );
  } else {
    return (
      <Sidebar>
        <SidebarContent>
          <LogoutSidebarMain />
        </SidebarContent>
        <SidebarFooter>
          <LogoutSidebarFooter />
        </SidebarFooter>
      </Sidebar>
    );
  }
};
