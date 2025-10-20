/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';

import {
  BellIcon,
  CloudIcon,
  CogIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
  UserPlusIcon,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, linkOptions } from '@tanstack/react-router';

export const AppSidebarMain = () => {
  const { t } = useTranslation();

  const data = linkOptions([
    { title: t('home'), icon: HomeIcon, to: '/' },
    { title: t('notifications'), icon: BellIcon, to: '/my/notifications' },
    { title: t('favorites'), icon: StarIcon, to: '/my/favorites' },
    { title: t('clips'), icon: StarIcon, to: '/my/clips' },
    { title: t('followRequests'), icon: UserPlusIcon, to: '/my/follow-requests' },
    { title: t('announcements'), icon: MegaphoneIcon, to: '/announcements' },
    { title: t('chat'), icon: MessageSquareIcon, to: '/chat' },
    { title: t('drive'), icon: CloudIcon, to: '/my/drive' },
    { title: t('search'), icon: SearchIcon, to: '/search' },
    { title: t('settings'), icon: CogIcon, to: '/settings' },
  ]);

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
