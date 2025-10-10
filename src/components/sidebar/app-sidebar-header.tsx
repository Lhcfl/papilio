import { SiteLogo } from '@/components/site-logo'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export const AppSidebarHeader = () => {
  const metaName = useSiteMeta(m => m.name)
  const site = injectCurrentSite()
  const domain = new URL(site).origin

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <SiteLogo />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{metaName}</span>
            <span className="truncate text-xs text-muted-foreground">{domain}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
