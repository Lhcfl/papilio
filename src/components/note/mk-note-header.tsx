import { acct } from "misskey-js";
import type { NoteWithExtension } from "@/types/note";
import { MkAvatar } from "../mk-avatar";
import { MkTime } from "../mk-time";
import { MkUserName } from "../mk-user-name";
import { MkVisibilityIcon } from "./mk-visibility-icon";

export const MkNoteHeader = (props: { note: NoteWithExtension }) => {
	return (
		<div className="mk-note-header flex items-center gap-2 p-2">
			<MkAvatar user={props.note.user} className="size-10" />
			<div className="user-info flex-grow-1 flex-shrink-1 w-0">
				<div className="user-name font-bold">
					<MkUserName user={props.note.user}></MkUserName>
				</div>
				<div className="user-username text-sm text-gray-500">@{acct.toString(props.note.user)}</div>
			</div>
			<div className="note-info">
				<div className="note-time flex items-center gap-2">
					<MkTime time={props.note.createdAt} className="text-sm" />
					<MkVisibilityIcon className="size-4" note={props.note} />
				</div>
			</div>
		</div>
	);
};
