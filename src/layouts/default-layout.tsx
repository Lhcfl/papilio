import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const DefaultLayout = (props: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar></AppSidebar>
			<main>
				<SidebarTrigger />
				{props.children}
			</main>
		</SidebarProvider>
	);
};
