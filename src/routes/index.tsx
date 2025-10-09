import { Tabs } from "@radix-ui/react-tabs";
import { createFileRoute } from "@tanstack/react-router";
import { MkTimelinesContainer, MkTimelinesContent, MkTimelinesTabs } from "@/components/mk-timelines";
import { DefaultLayout } from "@/layouts/default-layout";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<DefaultLayout wrapper={MkTimelinesContainer} headerCenter={<MkTimelinesTabs />}>
			<MkTimelinesContent />
		</DefaultLayout>
	);
}
