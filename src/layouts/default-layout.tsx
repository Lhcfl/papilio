import { Fragment } from "react";
import { toast } from "sonner";
import { AppRightCard } from "@/components/app-right-card";
import { AppSidebar } from "@/components/app-sidebar";
import { MkNotificationToast } from "@/components/mk-notification-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { MisskeyGlobalProvider } from "@/providers/misskey-global";

export const DefaultLayout = (props: {
	children: React.ReactNode;
	wrapper?: (props: { children: React.ReactNode }) => React.JSX.Element;
	headerLeft?: React.ReactNode;
	headerRight?: React.ReactNode;
	headerCenter?: React.ReactNode;
}) => {
	const Wrapper = props.wrapper || Fragment;
	const stream = useMisskeyStream();
	const api = useMisskeyApi();

	useEffect(() => {
		const connection = stream.useChannel("main");
		if (import.meta.env.DEV) {
			console.log("subscribed to main channel");
		}

		connection.on("notification", (n) => {
			toast.custom((id) => <MkNotificationToast key={`toast-${id}`} notification={n} />);
		});

		return () => {
			if (import.meta.env.DEV) {
				console.log("main channel disposed");
			}
			connection.dispose();
		};
	});

	return (
		<MisskeyGlobalProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="grid grid-cols-[1fr_auto]">
					<div className="main-container">
						<Wrapper>
							<ScrollArea className="h-screen">
								<header className="flex gap-1 items-center p-2 sticky top-0 bg-background border-b z-10">
									<SidebarTrigger className="size-8" />
									<div>{props.headerLeft}</div>
									<div className="flex-grow-1 w-0 text-center">{props.headerCenter}</div>
									<div>{props.headerRight}</div>
								</header>
								<div className="p-2">{props.children}</div>
							</ScrollArea>
						</Wrapper>
					</div>
					<div className="right-card-container p-2 border-l max-lg:hidden">
						<AppRightCard />
					</div>
				</SidebarInset>
			</SidebarProvider>
			<Toaster />
		</MisskeyGlobalProvider>
	);
};
