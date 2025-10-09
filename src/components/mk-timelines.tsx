import { GlobeIcon, HomeIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { MkTimeline } from "./mk-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const getTimelineTranslationKey = (type: TimelineTypes) => {
	// fuck?
	if (type === "hybrid") return "_timelines.social";
	return "_timelines." + type;
};

const timelineIcons = {
	home: <HomeIcon />,
	local: <MapPinIcon />,
	hybrid: <UsersIcon />,
	global: <GlobeIcon />,
};

export const MkTimelines = () => {
	const timelines: TimelineTypes[] = ["home", "local", "hybrid", "global"];
	const { t } = useTranslation();

	return (
		<Tabs defaultValue="home">
			<TabsList>
				{timelines.map((timeline) => (
					<TabsTrigger key={timeline} value={timeline}>
						{timelineIcons[timeline]}
						{t(getTimelineTranslationKey(timeline))}
					</TabsTrigger>
				))}
			</TabsList>
			{timelines.map((timeline) => (
				<TabsContent key={timeline} value={timeline}>
					<MkTimeline type={timeline} />
				</TabsContent>
			))}
		</Tabs>
	);
};
