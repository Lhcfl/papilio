/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { MoreHorizontalIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { useSidebarItems } from '@/hooks/use-sidebar';

export const AppSidebarMain = () => {
  const { t } = useTranslation();
  const data = useSidebarItems();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton size="lg" asChild>
                <Link to={item.to}>
                  <item.icon />
                  {item.title}
                  {'count' in item && item.count > 0 && (
                    <span className="count bg-tertiary text-secondary rounded-sm px-1.5 py-0.5 text-xs">
                      {item.count}
                    </span>
                  )}
                  {'ding' in item && item.ding && <span className="ding bg-tertiary h-2 w-2 rounded-full" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <MoreHorizontalIcon />
              {t('other')}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
