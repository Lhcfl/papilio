import { createFileRoute } from "@tanstack/react-router";
import { MkTimerline } from "@/components/mk-timerline";
import { Button } from "@/components/ui/button";
import { DefaultLayout } from "@/layouts/default-layout";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<DefaultLayout>
			<div className="p-2">
				<h3>Welcome Home!</h3>
			</div>
			<div>
				<Button>hello</Button>
			</div>
			<div>
				<MkTimerline />
			</div>
		</DefaultLayout>
	);
}
