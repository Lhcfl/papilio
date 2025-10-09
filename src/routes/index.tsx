import { createFileRoute } from "@tanstack/react-router";
import { MkTimelines } from "@/components/mk-timelines";
import { DefaultLayout } from "@/layouts/default-layout";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<DefaultLayout>
			<div>
				<MkTimelines />
			</div>
		</DefaultLayout>
	);
}
