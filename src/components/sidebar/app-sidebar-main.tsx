/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { MoreHorizontalIcon, RecycleIcon } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSidebarItems } from '@/hooks/sidebar';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { useQueryClient } from '@tanstack/react-query';
import { clearCache } from '@/loaders/clear-cache';
import { toast } from 'sonner';
import { AppSidebarMenuButton, AppSidebarMenuButtonLink } from '@/components/sidebar/app-sidebar-menu-button';

export const AppSidebarMain = () => {
  const { t } = useTranslation();
  const data = useSidebarItems();
  const queryClient = useQueryClient();

  const otherMenu: Menu = [
    {
      type: 'group',
      id: 'other',
      items: [
        { type: 'label', id: 'lbl_other', label: t('other') },
        {
          type: 'item',
          id: 'clearcache',
          label: t('clearCache'),
          icon: <RecycleIcon />,
          onClick: () => {
            toast.promise(clearCache(queryClient), {
              loading: t('clearCache'),
              success: t('clearCache'),
            });
          },
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.to}>
              <AppSidebarMenuButtonLink
                linkOptions={{ to: item.to }}
                icon={<item.icon />}
                title={item.title}
                count={item.count}
                ding={item.ding}
              />
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <MenuOrDrawer menu={otherMenu}>
              <AppSidebarMenuButton icon={<MoreHorizontalIcon />} title={t('other')} />
            </MenuOrDrawer>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
