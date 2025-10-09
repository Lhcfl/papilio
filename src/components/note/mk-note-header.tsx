import { acct } from "misskey-js";
import type { Note } from "misskey-js/entities.js";
import { MkAvatar } from "../mk-avatar";
import { MkTime } from "../mk-time";
import { MkUserName } from "../mk-user-name";

export const MkNoteHeader = (props: { note: Note }) => {
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
				<MkTime time={props.note.createdAt} />
			</div>
		</div>
	);
};
