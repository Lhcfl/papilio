/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { SiteLogo } from '@/components/site-logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { SunMoonIcon } from 'lucide-react';
import { useSiteMeta } from '@/stores/site';
import { site } from '@/services/inject-misskey-api';
import { usePerference } from '@/stores/perference';
export const AppSidebarHeader = () => {
  const metaName = useSiteMeta((m) => m.name);
  const domain = new URL(site!).origin;
  const setTheme = usePerference((p) => p.setTheme);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2">
        <SidebarMenuButton size="lg">
          <SiteLogo />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{metaName}</span>
            <span className="truncate text-xs text-muted-foreground">{domain}</span>
          </div>
        </SidebarMenuButton>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
          }}
        >
          <SunMoonIcon />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
