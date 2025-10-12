import { SiteLogo } from '@/components/site-logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { SunMoonIcon } from 'lucide-react';

export const AppSidebarHeader = () => {
  const metaName = useSiteMeta((m) => m.name);
  const site = injectCurrentSite();
  const domain = new URL(site).origin;

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
            document.body.classList.toggle('dark');
          }}
        >
          <SunMoonIcon />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
