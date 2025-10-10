import { SiteLogo } from '@/components/site-logo'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export const AppSidebarHeader = () => {
  const { meta, site } = useMisskeyGlobal()

  const domain = new URL(site).hostname

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <SiteLogo />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{meta.name}</span>
            <span className="truncate text-xs text-muted-foreground">{domain}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
