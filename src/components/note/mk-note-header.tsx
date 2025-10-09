import { acct } from "misskey-js";
import type { Note } from "misskey-js/entities.js";
import { MkAvatar } from "../mk-avatar";

export const MkNoteHeader = (props: { note: Note }) => {
	return (
		<div className="mk-note-header flex items-center gap-2 p-2">
			<MkAvatar user={props.note.user} className="size-10" />
			<div className="user-info flex-grow-1 flex-shrink-1 w-0">
				<div className="user-name font-bold">
					{props.note.user.name || props.note.user.username}
				</div>
				<div className="user-username text-sm text-gray-500">
					@{acct.toString(props.note.user)}
				</div>
			</div>
			<div className="note-info">
				<div className="note-created-at text-sm text-gray-500">
					{new Date(props.note.createdAt).toLocaleString()}
				</div>
			</div>
		</div>
	);
};
