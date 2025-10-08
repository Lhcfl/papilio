import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader>header</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>group 1</SidebarGroupLabel>
					<SidebarGroupContent>
						content
						<SidebarMenu>
							<SidebarMenuItem>111</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
					g1
				</SidebarGroup>
				<SidebarGroup>g2</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>footer</SidebarFooter>
		</Sidebar>
	);
};
