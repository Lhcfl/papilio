import { ChevronsUpDownIcon } from 'lucide-react';
import { MkAvatar } from '@/components/mk-avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MkUserName } from '../mk-user-name';

export const AppSidebarFooter = () => {
  const me = useMe();

  return (
    <SidebarMenu>
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
