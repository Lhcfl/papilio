/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SiteLogo } from '@/components/site-logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSiteMeta } from '@/stores/site';
import { site } from '@/lib/inject-misskey-api';
import { AppThemeToggle } from '@/components/app-theme-toggle';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export const AppSidebarHeader = () => {
  const metaName = useSiteMeta((m) => m.name);
  const domain = new URL(site!).origin;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton size="lg" asChild>
          <Link to="/site/about">
            <SiteLogo />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{metaName}</span>
              <span className="text-muted-foreground truncate text-xs">{domain}</span>
            </div>
          </Link>
        </SidebarMenuButton>
        <Button variant="outline" size="icon" asChild className='group-data-[state="collapsed"]:hidden'>
          <AppThemeToggle />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
