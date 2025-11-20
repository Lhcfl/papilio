/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ChevronsUpDownIcon, LogOutIcon, PencilIcon, UserRoundIcon, Users2Icon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MkUserName } from '@/components/mk-user-name';
import { useMe } from '@/stores/me';
import { useTranslation } from 'react-i18next';
import { MkPostFormDialog } from '@/components/mk-post-form-dialog';
import { MenuOrDrawer, type Menu } from '@/components/menu-or-drawer';
import { linkOptions } from '@tanstack/react-router';
import { logout } from '@/lib/inject-misskey-api';
import { useAfterConfirm } from '@/stores/confirm-dialog';

export const AppSidebarFooter = () => {
  const me = useMe();
  const { t } = useTranslation();

  const logoutWithConfirm = useAfterConfirm(
    {
      title: t('logout'),
      description: t('logoutConfirm'),
      variant: 'destructive',
      confirmIcon: <LogOutIcon />,
      confirmText: t('logout'),
    },
    logout,
  );

  const menu: Menu = [
    {
      type: 'group',
      id: 'user-actions',
      items: [
        { type: 'label', id: 'user-label', label: t('user') },
        {
          type: 'item',
          id: 'profile',
          label: t('profile'),
          icon: <UserRoundIcon />,
          to: linkOptions({
            to: '/@{$acct}',
            params: { acct: me.username },
          }),
        },
      ],
    },
    {
      type: 'group',
      id: 'session-actions',
      items: [
        null,
        {
          type: 'item',
          id: 'switch-account',
          label: t('switchAccount'),
          icon: <Users2Icon />,
          to: linkOptions({ to: '/account-switch' }),
        },
        { type: 'item', id: 'logout', label: t('logout'), icon: <LogOutIcon />, onClick: logoutWithConfirm },
      ],
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <MkPostFormDialog>
          <SidebarMenuButton size="lg" variant="outline">
            <PencilIcon />
            {t('note')}
          </SidebarMenuButton>
        </MkPostFormDialog>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <MenuOrDrawer menu={menu}>
          <SidebarMenuButton size="lg">
            <MkAvatar user={me} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="line-clamp-1 font-medium">
                <MkUserName user={me} />
              </span>
              <span className="text-muted-foreground truncate text-xs">@{me.username}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </SidebarMenuButton>
        </MenuOrDrawer>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
