import { ChevronsUpDownIcon, PencilIcon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MkUserName } from '../mk-user-name';
import { useMe } from '@/stores/me';
import { useTranslation } from 'react-i18next';

export const AppSidebarFooter = () => {
  const me = useMe();
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" variant="outline">
          <PencilIcon />
          {t('note')}
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <MkAvatar user={me} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="line-clamp-1 font-medium">
              <MkUserName user={me} />
            </span>
            <span className="truncate text-xs text-muted-foreground">@{me.username}</span>
          </div>
          <ChevronsUpDownIcon className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
