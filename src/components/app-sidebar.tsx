/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { AppSidebarFooter } from './sidebar/app-sidebar-footer';
import { AppSidebarHeader } from './sidebar/app-sidebar-header';
import { AppSidebarMain } from './sidebar/app-sidebar-main';

export const AppSidebar = () => {
  return (
    <Sidebar>
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
};
