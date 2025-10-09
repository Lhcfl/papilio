import { RepeatIcon } from "lucide-react";
import { MkAvatar } from "../mk-avatar";
import { MkTime } from "../mk-time";
import { MkUserName } from "../mk-user-name";
import { MkVisibilityIcon } from "./mk-visibility-icon";

export const MkNoteRenoteTip = (props: { note: NoteWithExtension }) => {
	const { me } = useMisskeyGlobal();

	return (
		<div className="mk-note-renote-tip p-2 flex gap-2 items-center text-muted-foreground">
			<RepeatIcon></RepeatIcon>
			<MkAvatar user={props.note.user} className="size-6" />
			<MkUserName user={props.note.user} className="flex-grow-1" />
			<div className="renote-info flex gap-2 items-center">
				<MkTime time={props.note.createdAt} />
				<MkVisibilityIcon note={props.note} className="size-4" />
			</div>
		</div>
	);
};
