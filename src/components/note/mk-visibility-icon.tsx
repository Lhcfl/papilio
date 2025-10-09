import { EyeOffIcon, GlobeIcon, HomeIcon, LockIcon, MessageSquareIcon } from "lucide-react";
import type { HTMLProps } from "react";

export const MkVisibilityIcon = (props: { note: NoteWithExtension } & HTMLProps<SVGSVGElement>) => {
	const { note, ...rest } = props;
	switch (note.visibility) {
		case "public":
			return <GlobeIcon {...rest} />;
		case "home":
			return <HomeIcon {...rest} />;
		case "followers":
			return <LockIcon {...rest} />;
		case "specified":
			return note.visibleUserIds?.length ? <MessageSquareIcon {...rest} /> : <EyeOffIcon {...rest} />;
	}
};
