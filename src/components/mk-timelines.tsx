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

const timelines: TimelineTypes[] = ["home", "local", "hybrid", "global"];

export const MkTimelinesTabs = () => {
	const { t } = useTranslation();
	return (
		<TabsList>
			{timelines.map((timeline) => (
				<TabsTrigger key={timeline} value={timeline}>
					{timelineIcons[timeline]}
					{t(getTimelineTranslationKey(timeline))}
				</TabsTrigger>
			))}
		</TabsList>
	);
};

export const MkTimelinesContainer = (props: { children: React.ReactNode }) => {
	return <Tabs defaultValue="home">{props.children}</Tabs>;
};

export const MkTimelinesContent = () => {
	return timelines.map((timeline) => (
		<TabsContent key={timeline} value={timeline}>
			<MkTimeline type={timeline} />
		</TabsContent>
	));
};

export const MkTimelines = () => {
	return (
		<MkTimelinesContainer>
			<div className="mk-timelines-header">
				<div className="mk-timelines-nav">
					<MkTimelinesTabs />
				</div>
			</div>
			<MkTimelinesContent />
		</MkTimelinesContainer>
	);
};
