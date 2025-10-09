import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MisskeyGlobalProvider } from "@/providers/misskey-global";

export const DefaultLayout = (props: { children: React.ReactNode }) => {
	return (
		<MisskeyGlobalProvider>
			<SidebarProvider>
				<AppSidebar></AppSidebar>
				<main>
					<SidebarTrigger />
					{props.children}
				</main>
			</SidebarProvider>
		</MisskeyGlobalProvider>
	);
};
