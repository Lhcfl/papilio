import { createFileRoute } from "@tanstack/react-router";
import { MkTimeline } from "@/components/mk-timeline";
import { DefaultLayout } from "@/layouts/default-layout";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<DefaultLayout>
			<div>
				<MkTimeline type="home" />
			</div>
		</DefaultLayout>
	);
}
