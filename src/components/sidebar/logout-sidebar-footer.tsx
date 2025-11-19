/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { LogInIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

export const LogoutSidebarFooter = () => {
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <LogInIcon />
          {t('login')}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
